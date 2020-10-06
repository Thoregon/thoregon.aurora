/**
 * A view model connects a view with a (entity) model, where
 * - west side  ... model
 * - east side  ... view
 * - inner      ... behavior
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

const factoryregistry = [];

export default class ViewModel extends VmEventEmitter(Reporter(Object)) {

    constructor({
                    model,
                    view,
                    behavior
                } = {}) {
        super();
        this._eventlisteners = [];
        Object.assign(this, { model, view, behavior });
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
        if (this.mapping) return;   // todo [OPEN]: dynamic view/model changes
        if (!this.east || !this.west) return;

        this.mapping = {};
        this.vmitems.forEach(vmitem => {
            let identifier = vmitem.identifier;
            if (identifier) {
                let modelitem = this.west.attachIdentifier(identifier);     // west = model
                if (modelitem) this.mapping[identifier] = { vmitem, modelitem };
            }
        });

        this.all2East();   // now init the view with is model
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
        this.west = new ModelClass(this);
        this.west.attachModel(observable);
        this.matchEastWest();
    }

    // todo [REFACTOR]: the mutation of the model emits again an event which causes a loop. this loop is broken because both sides check if the new value is different. can we stop earlier?
    toEast(mutation) {  // east = view
        let mapping = this.mapping[mutation.identifier];
        if (mapping) mapping.vmitem.mutate(mutation);
    }

    all2East() {        // east = view
        Object.entries(this.mapping).forEach(([identifier, mapping]) => {
            let mutation = mapping.modelitem.current(identifier);
            if (mutation) mapping.vmitem.mutate(mutation);
        })
    }

    toWest(mutation) {      // west = model
        let mapping = this.mapping[mutation.identifier];
        if (mapping) mapping.modelitem.mutate(mutation);
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
        this.vmitems = viewElements.map(viewElement => {
            viewElement.attachViewModel(this);
            return ViewItem.itemFor(viewElement, this).attachView(viewElement)
        });
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

}
