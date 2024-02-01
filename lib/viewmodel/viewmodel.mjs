/**
 * Viewmodel
 *
 *
 * todo [REFACTOR]:
 *  - view models should not extend this class
 *      - introduce @ViewModel annotation
 *      - provide as mixin?
 *
 * Change listeners:
 *  - deep observe viewmodel (all nested properties)
 *  - depp observe model
 *
 *  try to follow th path, consider scope of aurora sructural elements like aurora-section, ...
 *  if object exists, add change listener
 *  after each 'change', try to add missing listeners
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

import { propWithPath, elems } from "/evolux.util";

import { Reporter }   from "/evolux.supervise";
import AccessObserver from "/evolux.universe/lib/accessobserver.mjs";
import { doAsync }    from "/evolux.universe";

const EXCLUDEPROPS = ['errors', '$thoregon', '$thoregonEntity', 'proxy$', '$entityResolver'];

const VM_PRIVATE_PROPERTIES = ['west', 'east', 'model', '@REF'];

export default class ViewModel extends Reporter(Object) {

    constructor(...args) {
        super(...args);
        this.mutationListeners$ = [];
        this.pathListeners$     = {model: [], meta: [], viewmodel: [], viewmeta: []};
        this.actions$           = [];

        this.vmMutationListener = async (evt) => {
            await doAsync();
            this.invokePathListeners('viewmodel', evt.property ?? evt.prop);
            this.invokeMutationListeners();
        };

        this.modelMutationListener = async (evt) => {
            await doAsync();
            this.invokePathListeners('model', evt.property ?? evt.prop);
            this.invokeMutationListeners();
        }

    }

    static async with({
                          model,
                          modelRef,
                          view,
                          behavior,
                          parent,
                          container,
                      } = {}) {
        const bare = new this();
        Object.assign(bare, { model, modelRef, view, behavior, parent, container });
        let vm =  AccessObserver.observe(bare);
        // vm.vmMapping();   // init mapping viewmodel and view
        if (modelRef) {
            vm['@REF'] = modelRef;
            if (vm.setModelRef) {
                await vm.setModelRef(modelRef);
            } else {
                // console.log("Viewmodel doesn't implement 'setModelRef'", this);
            }
        } else {
            if (vm.noModelRef) {
                await vm.noModelRef();
            }
        }
        await vm.initialize();
        // listen to changes after (!) initialization is done
        // vm.addEventListener('change', vm.vmMutationListener);
        vm.addDeepListener('change', vm.vmMutationListener, { omit: ['@REF', 'view', 'west', 'east', 'model', 'vmMutationListener', 'modelMutationListener', 'modelRef', 'behavior', 'parent']});
        return vm;
    }

    replaceRoute() {
        const modelRef = this.getModelRef();
        if (!modelRef) return;
        const uirouter = universe.uirouter;
        uirouter.replaceEntityRouteNewWithRef(modelRef);
    }

    getModelRef() {
        // override by subclass if other id is used
        return this.model?.handle;
    }

    get privateProperties$() {
        return VM_PRIVATE_PROPERTIES;
    }

    async initialize() {
        // implement by subclass
    }

    //
    // app interface
    //


    get interfaceSettings() {
        return universe.uirouter?.interfaceSettings ?? {};
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
        this.model.prop(path, value);
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
            const obj = parts.length > 0 ? propWithPath(target, parts.join('.')) : target;
            if (!obj) return;
            obj[setprop] = value;
            return value;
        } else {
            return propWithPath(target, path);
        }
    }

    //
    // listners
    //

    removeAllListeners(listeners) {
        this.mutationListeners$       = this.mutationListeners$.filter(listener => !listeners.includes(listener));
        this.pathListeners$.model     = this.pathListeners$.model.filter(listener => !listeners.find(plistener => plistener.listener === listener));
        this.pathListeners$.meta      = this.pathListeners$.meta.filter(listener => !listeners.find(plistener => plistener.listener === listener));
        this.pathListeners$.viewmodel = this.pathListeners$.viewmodel.filter(listener => !listeners.find(plistener => plistener.listener === listener));
        this.pathListeners$.viewmeta  = this.pathListeners$.viewmeta.filter(listener => !listeners.find(plistener => plistener.listener === listener));
    }

    // will be triggered on any mutation of the model/viewmodel
    addMutationListener(listener) {
        if (this.mutationListeners$.includes(listener)) return;
        this.mutationListeners$.push(listener);
    }

    removeMutationListener(listener) {
        this.mutationListeners$ = this.mutationListeners$.filter(mlistener => mlistener !== listener);
    }

    addPathListener(path, selector, listener) {
        const listeners = this.pathListeners$[selector];
        if (listeners.includes(listener)) return;
        listeners.push({ path, listener });
    }

    removePathListener(path, selector, listener) {
        const listeners = this.pathListeners$[selector];
        this.pathListeners$[selector] = listeners.filter(plistener => plistener !== listener);
    }

    invokePathListeners(ltype, lpath) {
        Object.entries(this.pathListeners$).forEach(([type, pathListeners]) => {
            if (!ltype || ltype === type) {
                if ((type === 'model' || type === 'meta') && !this.hasModel) return; // if there is no model, no need to fire listeners
                pathListeners.forEach(async (pathListener) => {
                    try {
                        const path = pathListener.path;
                        if (!lpath || lpath === '*' || lpath === path || (lpath.endsWith('.*') && path.startsWith(lpath.slice(0,-1)))) {
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
        const mutationListeners = this.mutationListeners$;
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
        // todo [OPEN]: add recursive change listener
        observable.addEventListener('change', this.modelMutationListener);
        observable.addDeepListener('change', this.modelMutationListener);
    }

    get model() {
        return this._model;
    }

    silentReplaceMode(observable) {
        // if there was a model, don't remove it
        if (!observable) return;

        // make it observable if it is not decorated
        observable = this.observed(observable);

        this._model = observable;
    }

    get hasModel() {
        return this._model != undefined;
    }

    observed(object) {
        return object.__isObserved__ ? object : AccessObserver.observe(object);
    }

    viewModelChange(evt) {
        const prop = evt.property ?? evt.prop;
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
        if ( ! this.actions$[set] ) {
            this.actions$[set] = {};
        }
        this.actions$[set][ actionspec.name ] = actionspec;
    }

    getActions( set = "default" ) {
        let result = {
            'all'      : [],
            'primary'  : [],
            'secondary': []
        }

        let actions = Object.values( this.actions$[set] ?? [] );

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
        this.removeEventListener('change', this.vmMutationListener);
        this.west?.removeEventListener('change', this.modelMutationListener);

        this.removeDeepListener('change', this.vmMutationListener);
        this.west?.removeDeepListener('change', this.modelMutationListener);
    }


}
