/**
 * Viewmodel
 *
 *
 * todo [REFACTOR]:
 *  - view models should not extend this class
 *  - view model as observed object like model
 *      - deep observe (all nested properties)
 *  - depp observe model
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

import { propertywithpath, elems } from "/evolux.util";

import { Reporter }   from "/evolux.supervise";
import VmEventEmitter from "./events/vmeventemitter.mjs";
import JSInspector    from "/thoregon.crystalline/lib/jsinspector.mjs";
import AccessObserver from "/evolux.universe/lib/accessobserver.mjs";

// const factoryregistry = [];

// const JSINSPECTOR  = new JSInspector();
const EXCLUDEPROPS = ['errors', '$thoregon', '$thoregonEntity', 'proxy$', '$entityResolver'];

export default class ViewModel extends VmEventEmitter(Reporter(Object)) {

    constructor(...args) {
        super(...args);
        this.mutationListeners = [];
        this.pathListeners     = { model: [], meta: [], viewmodel: [], viewmeta: [] };

        this.vmMutationListener = (evt) => {
            this.invokePathListeners('viewmodel', evt.prop);
            this.invokeMutationListeners();
        };
    }


    static async with({
                          model,
                          modelRef,
                          view,
                          behavior,
                          parent
                      } = {}) {
        let vm =  AccessObserver.observe(new this());
        vm.addEventListener('change', vm.vmMutationListener);
        // vm.vmMapping();   // init mapping viewmodel and view
        Object.assign(vm, { model, modelRef, view, behavior, parent });
        await vm.initialize();
        if (modelRef) await vm.setModelRef(modelRef);
        return vm;
    }

    async initialize() {
        // implement by subclass
    }

    //
    // accessors
    //

    async getValueModelPath(path) {
        if (!this.model) return;
        const value = await this.model.prop(path);
        return value;
    }

    getValueMetaModelPath(path) {
        const meta = this.model?.metaClass;
        if (!meta) return;
        return this.prop$(meta, path);
    }

    getValueViewModelPath(path) {
        return this.prop$(this, path);
    }

    getValueViewModelMetaPath(path) {
        const meta = this.metaModel;
        if (!meta) return;
        return this.prop$(meta, path);
    }

    setValueModelPath(path, value) {
        if (!this.model) return;
        this.model.prop$(path, value);
        // the model sends a change event, don't do 'this.invokeListeners(path)'
        // todo: add a listener on the path of the model
        //  - which invokes the path listeners
        //  - and also invokes all mutation listeners
    }

    setValueMetaModelPath(path, value) {
        // don't modify attibutes of the metaclass
/*
        const meta = this.model?.metaClass;
        if (!meta) return;
        this.prop$(meta, path, value);
*/
    }

     setValueViewModelPath(path, value) {
        this.prop$(this, path, value);
        this.invokePathListeners('viewmodel', path);
        this.invokeMutationListeners();
    }

    setValueViewModelMetaPath(path, value) {
        // don't modify attibutes of the metaclass
/*
        const meta = this.metaModel;
        if (!meta) return;
        this.prop$(meta, path, value);
*/
    }

    prop$(target, path, value) {
        if (!path) return target;
        if (value != undefined) {
            const parts = elems(path);
            const setprop = parts.pop();
            const obj = parts.length > 0 ? propertywithpath(target, parts.join('.')) : target;
            if (!obj) return;
            obj[setprop] = value;
            return value;
        } else {
            return propertywithpath(target, path);
        }
    }

    //
    // listners
    //

    removeAllListeners(listeners) {
        this.mutationListeners       = this.mutationListeners.filter(listener => !listeners.includes(listener));
        this.pathListeners.model     = this.pathListeners.model.filter(listener => !listeners.find(plistener => plistener.listener === listener));
        this.pathListeners.meta      = this.pathListeners.meta.filter(listener => !listeners.find(plistener => plistener.listener === listener));
        this.pathListeners.viewmodel = this.pathListeners.viewmodel.filter(listener => !listeners.find(plistener => plistener.listener === listener));
        this.pathListeners.viewmeta  = this.pathListeners.viewmeta.filter(listener => !listeners.find(plistener => plistener.listener === listener));
    }

    // will be triggered on any mutation of the model/viewmodel
    addMutationListener(listener) {
        if (this.mutationListeners.includes(listener)) return;
        this.mutationListeners.push(listener);
    }

    removeMutationListener(listener) {
        this.mutationListeners = this.mutationListeners.filter(mlistener => mlistener !== listener);
    }

    addPathListener(path, selector, listener) {
        const listeners = this.pathListeners[selector];
        if (listeners.includes(listener)) return;
        listeners.push({ path, listener });
    }

    removePathListener(path, selector, listener) {
        const listeners = this.pathListeners[selector];
        this.pathListeners[selector] = listeners.filter(plistener => plistener !== listener);
    }

    invokePathListeners(ltype, lpath) {
        Object.entries(this.pathListeners).forEach(([type, pathListeners]) => {
            if (!ltype || ltype === type) {
                if ((type === 'model' || type === 'meta') && !this.hasModel) return; // if there is no model, no need to fire listeners
                pathListeners.forEach(async (pathListener) => {
                    try {
                        const path = pathListener.path;
                        if (!lpath || lpath === path) {
                            const listener = pathListener.listener;
                            const value = await this.getValueForType(type, path);
                            listener({ value });
                        }
                    } catch (e) {
                        console.log("ViewModel path listener: ", e);
                    }
                });
            }
        })
    }

    async getValueForType(type, path) {
        let value;
        switch (type) {
            case 'model':
                value = await this.getValueModelPath(path);
                break;
            case 'meta'         :
                value = this.getValueMetaModelPath(path);
                break;
            case 'viewmodel'    :
                value = this.getValueViewModelPath(path);
                break;
            case 'viewmodelmeta':
                value = this.getValueViewModelMetaPath(path);
                break;
            default:
                value = await this.getValueModelPath(path);
                break;
        }
        return value;
    }

    invokeMutationListeners() {
        const mutationListeners = this.mutationListeners;
        mutationListeners.forEach(mutationListener => {
            try {
                mutationListener();
            } catch (e) {
                console.log("ViewModel mutation listener: ", e);
            }
        });
    }

    // when view or model has been set or changed sync all
    doFirstSync(type) {
        // first invoke mutation listeners
        this.invokeMutationListeners();

        // now invoke path listeners
        this.invokePathListeners(type);
    }



    //
    // actions
    //

    executeAction(name) {

    }

    //
    // transactions
    //

    /**
     *  implement by subclasses if this viewmodel handles a 'create'
     * @return {boolean}
     */
    get isCreate() {
        return false;
    }

    async createModel() {
        // implement by subclasses
    }

    //
    // Model: West Side
    //
    set model(observable) {
        // if there was a model, don't remove it
        if (!observable) return;

        // make it observable if it is not decorated
        observable = this.observed(observable);

        this._model = observable;
        this.west = observable;     // todo: remove
        // fire listeners
        this.doFirstSync('model');
    }

    get model() {
        return this._model;
    }

    get hasModel() {
        return this._model != undefined;
    }

    observed(object) {
        return object.__isObserved__ ? object : AccessObserver.observe(object);
    }

    viewModelChange(evt) {
        const prop = evt.prop;
        this.invokePathListeners('viewmodel', prop);
        this.invokeMutationListeners();
    }

    //
    // View: East Side
    //
    set view(view) {
        // if there was a view, don't remove it
        if (!view) return;
        // view attaches itself. Only required properties will be matched
        this.east = view;
        // fire listners
        this.doFirstSync();
    }

    // todo: review what to do!
    refreshView(view) {
        this.view = view;
    }

    //
    // validations
    //

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

    //
    // commands
    //
    async executeCommand( commandName, commandArguments ) {
        let command = this.west.model.getCommand(commandName);
        return await command.execute( commandArguments );
    }

    //
    // standard user protocol
    // todo: review
    //

    getCurrentUser() {}
    isLoggedIn() {
        return false;
    }
    currentUserHasRole( role ) {}
    currentUserIsOwner() {}

    allowGuest() { return false; }
    currentUserIsGuest( domain ) {}

    createGuest( domain, nickname, email ) {
        let guest = {
            id      : universe.random(32),
            nickname: nickname,
            email   : email,
            expire  : 'date until id is valid',
        };
        localStorage.setItem(domain, JSON.stringify(guest));
    }

    //
    // ACTIONS
    //

    registerAction( actionspec, set = "default" ) {
        if ( ! this.constructor.actions[set] ) {
            this.constructor.actions[set] = {};
        }
        this.constructor.actions[set][ actionspec.name ] = actionspec;
    }

    getActions( set = "default" ) {
        let result = {
            'all'      : [],
            'primary'  : [],
            'secondary': []
        }

        let actions = Object.values( this.constructor.actions[set] ?? [] );

        for (let i = 0; i < actions.length; i++) {
            let action  = actions[i];
            let sortkey = String(action.order ).padStart(3, '0') + action.label + action.name;
            switch (action.priority ) {
                case 1:
                    result.primary[ sortkey ] = action;
                    break;
                case 2:
                default:
                    result.secondary[ sortkey ] = action;
                    break;
            }
        }

        //--- sort each pocket  ---

        //--- load in sort sequence  ---
        result.primary   = Object.values(result.primary);
        result.secondary = Object.values(result.secondary);

        //--- combine in ALL pocket  ---
        result.all = [ ...result.primary, ...result.secondary ];

        return result;
    }

    isActionAvailable( object, action ) { return true; }
    isActionDisabled( object, action ) { return false; }

    //
    // Cleanup
    //

    dispose() {
        this.removeEventListener('change', this.vmMMutationListener);
        // implement by sublclass
    }


}

/*
class ViewModel_ extends VmEventEmitter(Reporter(Object)) {

    constructor() {
        super();
        this._eventListeners   = {};
        this._2WestInterceptor = async (mutation) => true;
        this._2EastInterceptor = async (mutation) => true;

        this._processes2east   = false;
        this._processes2west   = false;

        this.constructor.actions = {};
    }

    static async with({
                    model,
                    modelRef,
                    view,
                    behavior,
                    parent
                } = {}) {
        let vm = new this();
        // vm.vmMapping();   // init mapping viewmodel and view
        Object.assign(vm, { model, view, behavior, parent });
        // if (modelRef) await vm.setModelRef(modelRef);
        return vm;
    }

    /!**
     * implement by subclasses,
     * answer true if the class can observe the object
     * @param observable
     *!/
    static observes(observable) {
        return false;
    }

    static selectVMClass(observable) {
        return factoryregistry.find(cls => cls.observes(observable));
    }

    /!**
     * register your subclass to be selectable.
     * add the class as first item to be asked.
     * todo [OPEN]: add a remove fn
     * @param vmclass
     *!/
    static add2factoryRegister(vmclass) {
        factoryregistry.unshift(vmclass);
    }

    /!*
     * Behavior: Inner
     *!/
    set behavior(behavior) {
        this._inner = behavior;
    }

    matchEastWest() {
        if (!this.vmitems) return;

        this.initMapping();
        this.vmitems.forEach(vmitem => {
            let identifier = vmitem.identifier;
            if (vmitem.itemActions) identifier = 'itemActions';
            if (identifier) {
                let miditem = this.mid ? this.mid.attachIdentifier(identifier) : undefined;     // mid = viewmodel
                if (miditem) {
                    this.addMapping(identifier, { vmitem, miditem });
                } else {
                    let modelitem = this.west ? this.west.attachIdentifier(identifier) : undefined;     // west = model
                    if (modelitem) this.addMapping(identifier, { vmitem, modelitem });
                }
            }

        });
        if (!this._mappingInit) {
            this.initModelMapping();
            this._mappingInit = true;
        }
        this.all2East();   // now init the view with is model*!/
    }

    initMapping() {
        this.mapping = {};
    }

    addMapping(identifier, mapping) {
        let mappings = this.mapping[identifier];
        if (!mappings) {
            mappings = [];
            this.mapping[identifier] = mappings;
        }
        mappings.push(mapping);
    }

    refreshView(view) {
        this._mappingInit = false;
        this.view = view;
    }

    initModelMapping() {
        // implement by subclasses
    }

    /!*
     * ViewModel: Midstation
     *!/
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

    /!*
     * Model: West Side
     *!/
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
        this.modelChanged(observable);
        this.matchEastWest();
    }

    get model() {
        return this._model;
    }

    modelChanged(model) {
        // implement by subclass
    }

    async setModelRef(ref) {
        // implement by subclasses
    }

    // todo [REFACTOR]: the mutation of the model emits again an event which causes a loop. this loop is broken because both sides check if the new value is different. can we stop earlier?
    async toEast(mutation) {  // east = view
        if (!await this._2EastInterceptor(mutation)) return;
        if (this._processes2west) return;
        this._processes2east = true;
        try {
            let mappings = this.mapping[mutation.identifier];
            if (mappings) mappings.forEach((mapping) => mapping.vmitem.mutate(mutation));
        } finally {
            this._processes2east = false;
        }
    }

    all2East() {        // east = view
        if (this._processes2west) return;
        (async () => {
            this._processes2east = true;
            try {
                Object.entries(this.mapping).forEach(async ([identifier, mappings]) => {
                    for await (const mapping of mappings) {
                        let mutation;
                        if (mapping.miditem) mutation = await mapping.miditem.current(identifier);
                        if (!mutation && mapping.modelitem) mutation = await mapping.modelitem.current(identifier);
                        if (mutation) mapping.vmitem.mutate(mutation);
                    }
                })
            } finally {
                this._processes2east = false;
            }
            this.modelDisplayed()
        })()
    }

    modelDisplayed() {
        this.east?.modelDisplayed();
    }

    async toWest(mutation) {      // west = model
        if (!await this._2WestInterceptor(mutation)) return;
        if (this._processes2east) return;
        let mappings = this.mapping[mutation.identifier];
        if (mappings) {
            this._processes2west = true;
            for await (const mapping of mappings) {
                try {
                    if (mapping.miditem) {
                        let r = await mapping.miditem.mutate(mutation);
                        this.east.actionTriggered(mutation);
                        return r;
                    } else if (mapping.modelitem) {
                        let r =  await mapping.modelitem.mutate(mutation);
                        this.east.actionTriggered(mutation);
                        return r;
                    }
                } catch (e) {
                    console.log(e);
                } finally {
                    this._processes2west = false;
                }
            };
        }
    }

    intercept2West(fn) {
        this._2WestInterceptor = fn;
    }

    intercept2East(fn) {
        this._2EastInterceptor = fn;
    }

    /!*
     * View: East Side
     *!/
    set view(view) {
        if (!view) return;
        this.east = view;
        this.attachView(view);
        this.matchEastWest();
    }

    attachView(view) {
        let viewElements = view.viewElements;
        if (view.attachViewModel) view.attachViewModel(this);
        let vmitems = viewElements.map(viewElement => {
            viewElement.attachViewModel(this);
            return ViewItem.itemFor(viewElement, this).attachView(viewElement)
        });
        // now attach standard html elements
        let elems = view.expandedChildNodes.filter(item => !item.isAuroraView && (!!item.auroraname || !!item.auroraaction || !!item.auroravisible || !!item.auroraenabled) && view.includeInViewMapping(item) /!*&& !item.isMapped*!/).map(viewElement => {
            // viewElement.isMapped = true;
            if (viewElement.attachViewModel) viewElement.attachViewModel(this);
            return ViewItem.itemFor(viewElement, this).attachView(viewElement)
        });

        // attach elements attributes
        // todo [OPEN]: special AttributeItem for 'aurora' attributes
        let attrs = view.elementProperties;
        if (attrs) attrs = Object.keys(attrs).map(attr => {
            return (attr !== 'view') ? AttributeItem.itemFor(this).attachView(view, attr) : undefined;
        } ).filter(item => item != undefined);
        // let attrs = [];

        this.vmitems = [...elems, ...vmitems, ...attrs];
    }

    viewMutated(mutations) {
        this.logger.info('view mutations');
    }

    /!*
     * validations
     *!/

    /!**
     * add a validation method object
     * @param auroraname
     * @param vfn           must implement ValidationMethod!
     *!/
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

    //
    // Cleanup
    //

    dispose() {
        this.west?.dispose();
        this.mid?.dispose();
        if (this.mapping) Object.values(this.mapping).forEach(mappings => mappings.forEach((mapping) => mapping.vmitem?.dispose()));
    }

    //
    // Properties
    //

    getWestProperty(name) {
        return (this.west && this.west.model) ? this.west.model[name] : undefined;
    }

    getWestProperties() {
        let props = {};
        if (this.west && this.west.model) {
            const model = this.west.model;
            // Object.entries(this.west.model).forEach(([name, value]) => props[name] = value);
            JSINSPECTOR.getAllPropertyNames(model).filter((name) => !name.startsWith('_') && !EXCLUDEPROPS.includes(name)).forEach((name) => props[name] = model[name]);
        }
        return props;
    }

    getVMProperties() {
        let props = {};
        // Object.entries(this).forEach(([name, value]) => props[name] = value);
        JSINSPECTOR.getAllPropertyNames(this).filter((name) => !name.startsWith('_') && !EXCLUDEPROPS.includes(name)).forEach((name) => props[name] = this[name]);

        return props;
    }

    //--- COMMANDS -------------------------------------------------------------
    async executeCommand( commandName, commandArguments ) {
        let command = this.west.model.getCommand(commandName);
        return await command.execute( commandArguments );
    }

    //--- standard user protocol ----------------------------------------------
    getCurrentUser() {}
    isLoggedIn() {
        return false;
    }
    currentUserHasRole( role ) {}
    currentUserIsOwner() {}

    allowGuest() { return false; }
    currentUserIsGuest( domain ) {}

    createGuest( domain, nickname, email ) {
        let guest = {
            id      : universe.random(32),
            nickname: nickname,
            email   : email,
            expire  : 'date until id is valid',
        };
        localStorage.setItem(domain, JSON.stringify(guest));
    }


    //
    // ACTIONS
    //

    registerAction( actionspec, set = "default" ) {
        if ( ! this.constructor.actions[set] ) {
            this.constructor.actions[set] = {};
        }
        this.constructor.actions[set][ actionspec.name ] = actionspec;
    }

    getActions( set = "default" ) {
        let result = {
            'all'      : [],
            'primary'  : [],
            'secondary': []
        }

        let actions = Object.values( this.constructor.actions[set] ?? [] );

        for (let i = 0; i < actions.length; i++) {
            let action  = actions[i];
            let sortkey = String(action.order ).padStart(3, '0') + action.label + action.name;
            switch (action.priority ) {
                case 1:
                    result.primary[ sortkey ] = action;
                    break;
                case 2:
                default:
                    result.secondary[ sortkey ] = action;
                    break;
            }
        }

        //--- sort each pocket  ---

        //--- load in sort sequence  ---
        result.primary   = Object.values(result.primary);
        result.secondary = Object.values(result.secondary);

        //--- combine in ALL pocket  ---
        result.all = [ ...result.primary, ...result.secondary ];

        return result;
    }


    isActionAvailable( object, action ) { return true; }
    isActionDisabled( object, action ) { return false; }

}
*/
