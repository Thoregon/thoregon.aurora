/**
 * Viewmodels follows the west (model) - east (view) direction
 *
 * A view model connects a view with a (entity) model, where
 * - west side   ... model
 * - mid station ... view model (this)
 * - east side   ... view
 * - inner       ... behavior
 *
 * The hierarchy - nested objects, nested views - can be different
 *      match automatically
 *      specify match
 *      multiple matches object - view
 * dynamically opened views
 * view builder
 *      generates (aurora) elements
 *      generated mockups
 *
 * todo [OPEN]:
 *  - transformers model <-> view mapping
 *  - formatters model <-> view mapping
 * todo [OPEN]: headless tesing w/o view. there are no comfort features available. e.g. use mockups for view elements
 * todo [OPEN]: build default view from model, mixed views (part defined, part generated from model)
 * todo [OPEN]: collaboration features
 *  - Someone is editing the same entity or field
 *  - data events: mutations of values
 *  - control events: someone enters/leaves editing; later: someone starts/ends observing, caution: this may cause heavy network load
 *
 * @author: Bernhard Lukassen
 */

import { className }  from "/evolux.util";
import { Reporter }   from "/evolux.supervise";
import ViewItem       from "./items/viewitem.mjs";
import VmEventEmitter from "./events/vmeventemitter.mjs";
import AttributeItem  from "./items/attributeitem.mjs";

const factoryregistry = [];

export default class ViewModel extends VmEventEmitter(Reporter(Object)) {

    constructor() {
        super();
        this._eventListeners = {};
    }

    static with({
                    model,
                    view,
                    behavior,
                    parent
                } = {}) {
        let vm = new this();
        vm.vmMapping();   // init mapping viewmodel and view
        Object.assign(vm, { model, view, behavior, parent });
        return vm;
    }

    /**
     * implement by subclasses,
     * answer true if the class can observe the object
     * @param observable
     */
    static observes(observable) {
        return false;
    }

    static selectVMClass(observable) {
        return factoryregistry.find(cls => cls.observes(observable));
    }

    /**
     * register your subclass to be selectable.
     * add the class as first item to be asked.
     * todo [OPEN]: add a remove fn
     * @param vmclass
     */
    static add2factoryRegister(vmclass) {
        factoryregistry.unshift(vmclass);
    }

    /*
     * Behavior: Inner
     */
    set behavior(behavior) {
        this._inner = behavior;
    }

    matchEastWest() {
        if (!this.vmitems) return;

        this.mapping = {};
        this.vmitems.forEach(vmitem => {
            let identifier = vmitem.identifier;
            if (identifier) {
                let miditem = this.mid ? this.mid.attachIdentifier(identifier) : undefined;     // mid = viewmodel
                if (miditem) {
                    this.mapping[identifier] = { vmitem, miditem };
                } else {
                    let modelitem = this.west ? this.west.attachIdentifier(identifier) : undefined;     // west = model
                    if (modelitem) this.mapping[identifier] = { vmitem, modelitem };
                }
            }

        });
        if (!this._mappingInit) {
            this.initModelMapping();
            this._mappingInit = true;
        }
        this.all2East();   // now init the view with is model
    }

    refreshView(view) {
        this._mappingInit = false;
        this.view = view;
    }

    initModelMapping() {
        // implement by subclasses
    }

    /*
     * ViewModel: Midstation
     */
    vmMapping() {
        let ModelClass = ViewModel.selectVMClass(this);
        if (!ModelClass) return;
        this.mid = new ModelClass(this);
        this.mid.attachModel(this);
        this.matchEastWest();
    }

    addEventListener(eventname, listener) {
        let listeners = this._eventListeners[eventname];
        if (!listeners) {
            listeners = [];
            this._eventListeners[eventname] = listeners;
        }
        if (listeners.indexOf(listener) === -1) listeners.push(listener);
    }

    removeEventListener(eventname, listener) {
        let listeners = this._eventListeners[eventname];
        if (listeners) {
            let i = listeners.indexOf(listener);
            if (i > -1) listeners.splice(i, 1);
        }
    }

    /*
     * Model: West Side
     */
    set model(observable) {
        if (!observable) return;
        let ModelClass = ViewModel.selectVMClass(observable);
        if (!ModelClass) {
            this.logger.warn(`no responsible handler for ${className(observable)}`);
            return;
        }
        this._model = observable;
        this.west = new ModelClass(this);
        this.west.attachModel(observable);
        this.matchEastWest();
    }

    get model() {
        return this._model;
    }

    set modelRef(ref) {
        // implement by subclasses
    }

    // todo [REFACTOR]: the mutation of the model emits again an event which causes a loop. this loop is broken because both sides check if the new value is different. can we stop earlier?
    toEast(mutation) {  // east = view
        let mapping = this.mapping[mutation.identifier];
        if (mapping) mapping.vmitem.mutate(mutation);
    }

    all2East() {        // east = view
        Object.entries(this.mapping).forEach(([identifier, mapping]) => {
            let mutation;
            if (mapping.miditem) mutation = mapping.miditem.current(identifier);
            if (!mutation) mutation = mapping.modelitem.current(identifier);
            if (mutation) mapping.vmitem.mutate(mutation);
        })
    }

    async toWest(mutation) {      // west = model
        let mapping = this.mapping[mutation.identifier];
        if (mapping) {
            if (mapping.miditem) {
                return await mapping.miditem.mutate(mutation);
            } else if (mapping.modelitem) {
                return await mapping.modelitem.mutate(mutation);
            }
        }
    }

    /*
     * View: East Side
     */
    set view(view) {
        if (!view) return;
        this.east = view;
        this.attachView(view);
        this.matchEastWest();
    }

    attachView(view) {
        let viewElements = view.viewElements;
        view.attachViewModel(this);
        let vmitems = viewElements.map(viewElement => {
            viewElement.attachViewModel(this);
            return ViewItem.itemFor(viewElement, this).attachView(viewElement)
        });
        // now attach standard html elements
        let elems = view.expandedChildNodes.filter(item => !item.isAuroraView && (!!item.auroraname || !!item.auroraaction)).map(viewElement => {
            if (viewElement.attachViewModel) viewElement.attachViewModel(this);
            return ViewItem.itemFor(viewElement, this).attachView(viewElement)
        });

        // attach elements attributes
        // todo [OPEN]: special AttributeItem for 'aurora' attributes
        let attrs = view.elementProperties;
        if (attrs) attrs = Object.keys(attrs).map(attr => AttributeItem.itemFor(this).attachView(view, attr));

        this.vmitems = [...vmitems, ...elems, ...attrs];
    }

    viewMutated(mutations) {
        this.logger.info('view mutations');
    }

    /*
     * validations
     */

    /**
     * add a validation method object
     * @param auroraname
     * @param vfn           must implement ValidationMethod!
     */
    addValidation(auroraname, vfn) {
        let vmitem = this.vmitems.find(item => item.name === auroraname);
        if (vmitem) vmitem.addValidation(vfn); // todo [REFACTOR]: else log warning
    }

    hasErrors() {
        return !!this.vmitems.find(vmitem => vmitem.hasErrors());
    }

    get errors() {
        return this.vmitems.reduce((errors, vmitem) => {
            let errs = vmitem.errors;
            if (!errs.is_empty) errors[vmitem.name] = errs;
            return errors
        }, {});
    }

    structuredErrors() {
        return this.errors;
    }

    reportErrors(item, errors) {
        this.dispatchEvent('valid-state', { item, errors });
    }

    /*
     *
     */

    getWestProperty(name) {
        return (this.west && this.west.model) ? this.west.model[name] : undefined;
    }
}
