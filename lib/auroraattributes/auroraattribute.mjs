/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

// import { callStack }         from "/evolux.util";

import { ErrNotImplemented } from "../errors.mjs";
import AuroraElement         from "../auroraelement.mjs";
import ViewModel             from "../viewmodel/viewmodel.mjs";

const DBGID = '[Aurora] AuroraAttribute';
const debuglog = (...args) => {}; // {};   // console.log(...args);
globalThis.auroralog = [];

const DEBOUNCE_DELAY = 50;

const ALL_AURORAATTRIBUTES      = new Map();
const DISPOSED_AURORAATTRIBUTES = new Map();

export default class AuroraAttribute {

    constructor(elem, { name, value } = {}) {
        this._handle            = 'AA_' + universe.random(5);

        this.element   = elem;
        this.attribute = { name, value };
        this.spec      = this.parseAttributeSelector();

        this.elementListener = undefined;
        this.modelListener   = undefined;
        this.routeListener   = (evt) => this.routeChanged(evt);

        this._description = {
            attribute     : name,
            value,
            viewmodelclass: elem.parentViewModel()?.constructor.name ?? '<??>',
            uipath        : elem.getAuroraUIPath()
        }

        // const stack = callStack().splice(3);
        ALL_AURORAATTRIBUTES.set(this._handle, this);
        // debuglog("**> created", this.auroraName, name, value);
    }

    static with(elem, { name, value } = {}) {
        const attribute = new this(elem, { name, value });
        attribute.connectElementListeners(elem);
        attribute.connectRouteListener();
        return attribute;
    }

    static get AuroraAttributes() { return ALL_AURORAATTRIBUTES }
    static get DisposedAuroraAttributes() { return DISPOSED_AURORAATTRIBUTES }

    get description() {
        return JSON.stringify(this._description, null, 3);
    }

    get is(){
        return this.hasAttr(this.elem);
    }

    static get auroraName() {
        return `aurora-${this.name}`;
    }

    get auroraName() {
        return this.constructor.auroraName;
    }

    static get auroraShortName() {
        return `a-${this.name}`;
    }

    get auroraShortName() {
        return this.constructor.auroraShortName;
    }

    static whichAuroraAttribute(attributename) {
        return Object.values(AuroraElement.definedAuroraAttributes).find(auroraattribute => auroraattribute.hasName(attributename));
    }

    static attrCompare() {
        const names = [this.auroraName, this.auroraShortName];
        return !this.supportsSelector
               ? (attrname) => names.includes(attrname)
               : (attrname) => names.includes(attrname)
                               || (names.findIndex(name => attrname.startsWith(`${name}:`)) > -1)   // selector
                               || (names.findIndex(name => attrname.startsWith(`${name}.`)) > -1);  // subselector
    }

    static getAttr(element) {
        const elemattrnames = element.getAttributeNames();
        const name          = elemattrnames.find(this.attrCompare());
        if (name === undefined) return;
        const value         = element.getAttribute(name);
        return { name, value };
    }

    static getAttrs(element) {
        // when it does not support multiple attributes even when it supports selectors, get only the first
        if (!this.supportsMultiple) {
            const attr = this.getAttr(element);
            return attr !== undefined ? [attr] : [];
        }
        const elemattrnames = element.getAttributeNames();
        const attrnames     = elemattrnames.filter(this.attrCompare());
        const attrs         = attrnames.map((attrname) => ({ name: attrname, value : element.getAttribute(attrname) }));
        return attrs;
    }

    static hasName(name) {
        return this.attrCompare()(name);
    }

    hasName(name) {
        return this.constructor.hasName(name);
    }

    isForElement(element) {
        return this.element === element;
    }

    get selector() {
        return this.spec.selector;
    }

    get subselector() {
        return this.spec.subselector;
    }

    parseAttributeSelector() {
        let name = this.attribute?.name;
        if (!name) return;
        let selector, subselector;
        let parts = name.split('.');     // first try to get a subselector
        if (parts.length > 1) {
            name        = parts.shift();
            subselector = parts.join('.');
        }
        parts = name.split(':');         // now try to get the selector
        if (parts.length > 1) {
            name        = parts.shift();
            selector    = parts.join(':');
        }
        name = this.adjustName(name);
        return { name, selector, subselector };
    }

    adjustName(name) {
        return name;
    }

    //
    // subclasses
    //

    /**
     * name of the attribute
     */
    static get name() {
        throw ErrNotImplemented('name');
    }

    get name() {
        return this.constructor.name;
    }

    /**
     * specify if this aurora attribute can be specialized with a selector
     * e.g. aurora-name:meta
     * @return {boolean}
     */
    static get supportsSelector() {
        return false;
    }

    static get supportsMultiple() {
        return false;
    }

    static get selectors() {
        return [];
    }

    static get subselectors() {
        return [];
    }

    /**
     * add params
     * @returns {{$element}}
     */
    elementAndAttributeParams(additionalParams = {}) {
        const $element = this.element;
        return { $element, $viewContext: $element.viewContext(), $listvm: this.listViewModel?.deref(), ...additionalParams };
    }

    elementAndAttributeParamNames() {
        return ['$element', '$viewContext', '$listvm'];
    }

    //
    // view model
    //

    /**
     * a view model has been assigned to the view
     * if there was another view model attached before
     * it will be detached
     * @param viewModel
     */
    attachViewModel(viewModel, listViewModel) {
        const oldViewModel = this.getAttachedViewModel();
        if (oldViewModel === viewModel) return;     // nothing to do
        if (oldViewModel) this.detachViewModel(); // if this attribute was connected to another vm disconnect it first
        // debuglog("**> attach viewModel", this.auroraName, this.attribute.name, this.attribute.value);
        this.viewModelRef = new WeakRef(viewModel);
        this.connectViewModelListeners(viewModel);

        if (this.attribute.value?.indexOf("$listvm") > -1) {
            if (listViewModel) {
                this.listViewModel = new WeakRef(listViewModel);
                this.connectViewModelListeners(listViewModel);      // todo: review, all events from list view model will also update the item
                this.doFirstSync();
            } else {
                this.disconnect();
            }
        } else {
            this.doFirstSync();
        }
    }

    /**
     * attribute has been removed from the element
     * detach from view model
     */
    detachViewModel() {
        let oldViewModel = this.getAttachedViewModel();
        if (!oldViewModel) return;
        debuglog("**> detach viewModel", this.auroraName, this.attribute.name, this.attribute.value);

        if (this.modelListener) oldViewModel.removeMutationListener(this.modelListener);
    }

    getAttachedViewModel() {
        return this.viewModelRef?.deref();
    }

    connectElementListeners(viewModel) {
        // implement by subclasses
    }

    connectViewModelListeners(viewModel) {
        // implement by subclasses
    }

    disconnectElement() {
        // implement by subclass
    }

    //
    // element
    //

    getSelectOptionValues() {
        if (!this.element?.type.startsWith('select')) return [];
        const options = [...this.element.options];
        const values = options.map(option => option.value);
        return values;
    }

    isSelectOptionAvailable(value) {
        return this.getSelectOptionValues().includes(value);
    }

    //
    // processing
    //

    doFirstSync() {
        // implement by subclasses
        // debuglog("**> doFirstSync ", this.auroraName, this.attribute.name, this.attribute.value);
    }

    async modelMutated() {
        // implement by subclass
    }

    debounceDelay(fn) {
        // fn();
        setTimeout(fn, DEBOUNCE_DELAY);
    }

    //
    // routes
    //

    shouldListenToRoute() {
        return this.attribute?.value?.indexOf('routeActive(') > -1;
    }

    listenToRoute() {
        universe.uirouter.addRouteListener(this.routeListener)
    }

    routeChanged(evt) {
        this.modelMutated();
    }

    connectRouteListener() {
        if (!this.shouldListenToRoute()) return;
        this.listenToRoute();
    }

    /**
     * changed attribute value
     * adjust mapping
     * @param value
     * @param viewModel
     */
    update(value, viewModel) {
        // debuglog("**> update ", this.auroraName, this.attribute.name, this.attribute.value);
        this.attribute.value = value;   // memorize the new value
        // if the viewmodel has been changed, reconnect
        if (this.getAttachedViewModel() !== viewModel) {
            this.detachViewModel();
            this.attachViewModel(viewModel);
        } else {
            this.doFirstSync();
        }
    }

    disconnect() {
        ALL_AURORAATTRIBUTES.delete(this._handle);
        DISPOSED_AURORAATTRIBUTES.set(this._handle, new WeakRef(this));
        this.detachViewModel();
        this.disconnectElement();
        universe.uirouter.removeRouteListener(this.routeListener);
    }

    //
    // debounce
    //

    triggered() {
        const t_last = this.t_last;
        if (t_last) {
            // auroralog.push({ auroraName: this.auroraName, last: t_last, action: 'triggered', attributeName: this.attribute.name, value: this.attribute.value });
        }
        this.t_last = Date.now();
    }
}

// AuroraElement.useAuroraAttribute(AuroraAttribute)

universe.$AuroraAttribute = AuroraAttribute;

//
// HTML Element polyfills
//

Object.defineProperties(Element.prototype,{
    getAuroraAttributes: {
        configurable: false,
        enumerable: false,
        value: function getAuroraAttributes() {
            if (this.auroraAttributes) return this.auroraAttributes;
            const auroraattributes = [];
            Object.values(AuroraElement.definedAuroraAttributes).forEach((AuroraAttribute) => {
                const found = AuroraAttribute.getAttrs(this);
                if (!found.is_empty) {
                    found.forEach(({ name, value }) => {
                        auroraattributes.push(AuroraAttribute.with(this, { name, value }));
                    });
                }
            });
            this.auroraAttributes = auroraattributes;
            return auroraattributes;
        }
    },

});
