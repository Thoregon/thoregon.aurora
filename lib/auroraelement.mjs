/**
 * use this as base class for all aurora elements!
 *
 * @author: Bernhard Lukassen
 */

import { forEach, className, parseIni } from '/evolux.util';

import { doAsync }             from "/evolux.universe";
import { UIElement }           from '/evolux.ui';
import translate, * as plurals from './i18n/translate.mjs';
import doT                     from "/dot";

import { ErrNotImplemented } from "./errors.mjs";
import { Q }                 from "/evolux.util";

const observeOptions     = {
    childList            : true,
    subtree              : true,
    attributes           : true,
    attributeOldValue    : true,
    characterData        : true,
    characterDataOldValue: true
};

let _behaviormodule      = {};
let _defaultValues       = {};
let _styles              = {};
let _i18n                = {};
let _config              = {};
let _templates           = {};

export default class AuroraElement extends UIElement {

    constructor() {
        super();
        this._behaviorQ = [];
        this._validation = undefined;
    }


    /**
     * name of the defining element library
     * @return {string}
     */
    static get libraryId() {
        return 'aurora';
    }

    static get elementTag() {
        throw ErrNotImplemented(`static ${className(this)}.elementTag`);
    }

    get elemId() {
        return this.constructor.elementTag;
    }

    /*
     * Inner Properties (todo [OPEN])
     */

    /**
     * defines the attributes from elements within the shadowRoot which will be forwarded
     * to inner elements and vice versa to the surrounding aurora element
     *
     * answer a map of event definitions. a definition can define:
     *  {
     *      <attrname> : {
     *          inner: <innerattributename>,                // if the inner attr name differs (rename attribute)
     *          select: <selector-for-element>              // mandatory: query the element with 'this.container.querySelector(selector)'
     *          // todo [OPEN]: introduce middleware fn's for get & set?
     *      }
     *  }
     *  Base for selector is 'this.container'
     *
     * If an empty definition is passed, the event will be 'copied'
     * and dispatched with the aurora element as target
     *
     * override by subclasses but don't forget to add  'super.forwardedProperties()'
     * e.g. return Object.assign(super.forwardedProperties(), { property: { select: '#elem'}});
     */
    forwardedProperties() {
        return {}
    }

    /*
     * Inner Attributes
     */

    /**
     * defines the attributes from elements within the shadowRoot which will be forwarded
     * to inner elements and vice versa to the surrounding aurora element
     *
     * caution: this method is static because the 'observedElements' can only be defined when the custom element is defined
     *
     * answer a map of event definitions. a definition can define:
     *  {
     *      <attrname> : {
     *          inner: <innerattributename>,                // if the inner attr name differs (rename attribute)
     *          select: <selector-for-element>              // mandatory: query the element with 'this.container.querySelector(selector)'
     *          // todo [OPEN]: introduce middleware fn's for get & set?
     *      }
     *  }
     *  Base for selector is 'this.container'
     *
     * If an empty definition is passed, the event will be 'copied'
     * and dispatched with the aurora element as target
     *
     * override by subclasses but don't forget to add  'super.forwardedAttributes()'
     * e.g. return Object.assign(super.forwardedAttributes(), { attr: { select: '#elem'}});
     */
    static forwardedAttributes() {
        return {};
    }


    static get observedAttributes() {
        let forwardedAttrs = Object.keys(this.forwardedAttributes());
        return [...super.observedAttributes, ...forwardedAttrs];
    }

    /**
     * forward to the inner element
     */
    attributeChangedCallback(name, oldValue, newValue) {
        // bind set handler to aurora element instance
        let forwarded = this._forwardedAttributes[name];
        if (forwarded) {
            if (this._modifyingAttrs) return;       // well, this works only in a single threaded JS engine!
            let currentValue = forwarded.element.getAttribute(name);
            if (currentValue !== newValue) forwarded.element.setAttribute(name, newValue);
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    exposeAttribute(name, mutations) {
        if (mutations.length < 1) return;
        let newValue = mutations[0].target.getAttribute(name);
        let currentValue = this.getAttribute(name);
        if (currentValue !== newValue) this.setAttribute(name, newValue);
    }

    /*
     * Inner Events
     */

    /**
     * defines the events from elements within the shadowRoot which will be exposed
     * to listeners on the aurora element
     *
     * answer a map of event definitions. a definition can define:
     *  {
     *      <evtname> : {
     *          inner: <innereventname>,                    // if the inner event name differs (rename event)
     *          select: <selector-for-element>              // will query the element with 'this.container.querySelector(selector)'
     *          edit: fn(auroraEvent, originalEvent)        // do adjustments on the 'auroreEvent' if necessary, if answers 'false' the event will not be dispatched
     *      }
     *  }
     *
     *  Base for selector is 'this.container'
     *
     * If an empty definition is passed, the event will be 'copied'
     * and dispatched with the aurora element as target
     *
     * override by subclasses but don't forget to add  'super.exposedEvents()'
     * e.g. return Object.assign(super.exposedEvents(), { event: { select: '#elem'}});
     */
    exposedEvents() {
        return {
            focus: {},
            blur: {}
        }
    }

    /**
     * update a definition for an exposed event
     * can be done if the event behavior changes due to
     * a state change
     * @param eventname
     * @param def
     */
    updateExposedEvent(eventname, def) {
        // todo [OPEN]
    }

    dispatchExposedEvent(evtdef, originalEvent) {
        let auroraEvent = document.createEvent('Event');
        auroraEvent.initEvent(evtdef.exposed, true, true);

        if (evtdef.edit(auroraEvent, originalEvent)) this.emitEvent(evtdef.exposed, auroraEvent);
    }


    refinish() {
        // forward properties
        let forwardedProperties = this.forwardedProperties();
        let clsprops = {};
        Object.entries(forwardedProperties).forEach(([propname, definition]) => {
            let propdef = Object.assign({}, definition, { name: propname });
            let element = this.container.querySelector(propdef.select);
            if (element && !this[propname]) {
                propdef.element = element;
                let name = propdef.inner ? propdef.inner : propname;
                clsprops[propname] = {
                    configurable: true,   // can be redefined if necessary
                    enumerable: false,
                    get: function () {    // don't use as fat arrow function '() => {}', 'this' will be bound to undefined
                        return element[name];
                    },
                    set: function(value) {
                        element[name] = value;
                    }
                }
            } else {
                if (!element)       this.logger.warn("forwardedProperties: selection returns no element");
                if (this[propname]) this.logger.warn(`forwardedProperties: property '${propname}' exists, didn't override`);
            }
        });
        Object.defineProperties(this, clsprops);

        // forward attributes
        let forwardedAttributes = this.constructor.forwardedAttributes();
        this._forwardedAttributes = {};
        Object.entries(forwardedAttributes).forEach(([attrname, definition]) => {
            let attrdef = Object.assign({}, definition, { name: attrname });
            let element = this.container.querySelector(attrdef.select);
            if (element) {
                attrdef.element = element;
                this._forwardedAttributes[attrname] = attrdef;
                // watch mutations
                attrdef.mutationobserver = new MutationObserver((mutations) => this.exposeAttribute(attrname, mutations));
                attrdef.mutationobserver.observe(element, { attributes: true, attributeFilter: [attrname] });
            } else {
                this.logger.warn("forwardedAttributes: selection returns no element");
            }
        });

        // expose events
        let exposedEvents = this.exposedEvents();
        this._exposedEvents = {};       // memorize which events are now exposed with its listeners to be able to modify it
        Object.entries(exposedEvents).forEach(([eventname, definition]) => {
            let evtdef = Object.assign({ inner: eventname, edit: (auroraEvent, originalEvent) => true }, definition, { exposed: eventname } );
            let element = evtdef.select ? this.container.querySelector(evtdef.select) : this.container;
            if (element) {
                evtdef.listener = (evt) => this.dispatchExposedEvent(evtdef, evt);
                evtdef.element = element;
                element.addEventListener(evtdef.inner, evtdef.listener);
                this._exposedEvents[eventname] = evtdef;
            } else {
                this.logger.warn("exposedEvents: selection returns no element");
            }
        });
    }

    /*
     * UI rendering
     */

    // returns undefined. methods using it must handle undefined
    get templateElements() {
    }

    applyStyles() {
        // let tplelem = this.templateElements;

    }

    buildElement() {
        return this.builder.newDiv();
    }

    async config() {
        this.config    = await this.getComponentConfig();
        let transl     = await this.getComponentTranslations();
        this.i18n      = transl
            ? translate(transl, {
                pluralize: plurals.plural_EN,       // todo: select language
            })
            : (msg) => msg;
    }

    refresh() {
        let container = this.container;
        if (!container) return;
        container.innerHTML = '';
        this.applyContent(container);
    }

    async applyContent(container) {
        await this.applyTemplates(container);
        await this.adjustContent(container);
        await this.attachBehavior();
    }


    async allChildElementsExists() {
        let created = this.childViews.map(item => {
            return new Promise((resolve) => {
                item.addEventListener('exists', () => resolve(item));
            })
        });
        await Promise.all(created);
    }

    /**
     * implement by subclasses
     * invoked after templates are applied
     * @param container
     */
    async adjustContent(container) {}

    get appliedTemplateName() {
        throw ErrNotImplemented('appliedTemplateName');
    }

    async applyTemplates(container) {
        let properties        = this.propertiesValues();
        Object.assign( properties, await this.calculatedValues() );
        properties['classes'] = this.collectClasses().join(' ');
        let tplsrc            = await this.templates();
        let tplstr            = tplsrc[this.appliedTemplateName];
        let tempFn            = doT.template(tplstr, undefined, {});
        let element           = tempFn(properties);

        container.innerHTML   = element;
        container.style.width = this.getStyleWidth();
    }

    collectClasses() {
        return [];
    }

    //--- classes to add
    async templates() {
        if (_templates[this.elemId]) return _templates[this.elemId];
        return await Q(`${this.elemId}/templates`, async () => {
            let tplelem   = this.templateElements;
            let templates = {};
            if (!tplelem) return templates;
            let uiroot    = this.uiComponentRoot;
            let tplnames  = tplelem.templates;
            let theme     = tplelem.theme || 'material';
            let component = tplelem.component;
            await forEach(tplnames, async (name) => {
                let tplpath = `${uiroot}/${theme}/${component}/${theme}${name}.jst`;
                try {
                    let res = await fetch(tplpath);
                    if (res.ok) templates[name] = await res.text();
                } catch (ignore) { }
            });
            _templates[this.elemId] = templates;
            return templates;
        });
    }

    get uiComponentRoot() {
        return '/thoregon.aurora/themes';
    }

    async getComponentConfig() {
        if (_config[this.elemId]) return _config[this.elemId];
        return await Q(`${this.elemId}/config`, async () => {
            let tplelem = this.templateElements;
            if (!tplelem) return;
            let uiroot    = this.uiComponentRoot;
            let theme     = tplelem.theme || 'material';
            let component = tplelem.component;
            let inipath   = `${uiroot}/${theme}/${component}/config.ini`;
            try {
                let res = await fetch(inipath);
                if (res.ok) {
                    let ini              = await res.text();
                    let config           = parseIni(ini);
                    _config[this.elemId] = config;
                    return config;
                }
            } catch (ignore) { }
        });
    }

    async getComponentTranslations() {
        if (_i18n[this.elemId]) return _i18n[this.elemId];
        return await Q(`${this.elemId}/i18n`, async () => {
            let tplelem = this.templateElements;
            if (!tplelem) return;
            let uiroot    = this.uiComponentRoot;
            let theme     = tplelem.theme || 'material';
            let component = tplelem.component;
            let inipath   = `${uiroot}/${theme}/${component}/i18n.json`;
            try {
                let res = await fetch(inipath);
                if (res.ok) {
                    let ini            = await res.text();
                    let i18n           = JSON.parse(ini);
                    _i18n[this.elemId] = i18n;
                    return i18n;
                }
            } catch (ignore) { }
        });
    }

    async elementStyle(templatename) {
        if (_styles[this.elemId]) return _styles[this.elemId];
        return await Q(`${this.elemId}/style`, async () => {
            let tplelem = this.templateElements;
            if (!tplelem) return '';
            templatename  = templatename ? `${tplelem.theme || 'material'}${templatename}` : `${tplelem.theme || 'material'}${this.appliedTemplateName}`
            let styles    = [];
            let uiroot    = this.uiComponentRoot;
            let theme     = tplelem.theme || 'material';
            let component = tplelem.component;
            let csspath   = `${uiroot}/${theme}/${theme}.css`;
            try {
                let res = await fetch(csspath);
                if (res.ok) styles.push(await res.text());
            } catch (ignore) { }

            csspath = `${uiroot}/${theme}/${component}/${component}.css`;
            try {
                let res = await fetch(csspath);
                if (res.ok) styles.push(await res.text());
            } catch (ignore) { }

            csspath = `${uiroot}/${theme}/${component}/${templatename}.css`;
            try {
                let res = await fetch(csspath);
                if (res.ok) styles.push(await res.text());
            } catch (ignore) { }

            _styles[this.elemId] = `/* elem: ${this.elemId} */\n${styles.join('\n')}`;
            return _styles[this.elemId];
        });
    }

    /*
     * Structure
     */

    appendChild(element) {
        if (!element instanceof HTMLElement) throw ErrNoHTMLElement(element.constructor.name);
        this.container.appendChild(element);
    }

    removeChild(element) {
        this.container.removeChild(element);
    }

    /*
     * Element properties (attributes)
     */

    /**
     *  todo: cascade of field definitions
     *  todo: counter
     *  todo: model  -> View Model Design
     *  todo: validations and errors
     *  todo: make own CSS for text Field
     *  todo: add text type
     *
     */

    /**
     * Will return all attributes which are filled on the aurora element
     * @returns {{}}
     */
    transferredAttributes() {
        let attributesTransferred = {};
        [...this.attributes].forEach(attribute => attributesTransferred[attribute.name] = attribute.nodeValue);
        return attributesTransferred;
    }

    /**
     * Will return the width of the element
     * TODO: need to include the width attribute
     * @returns {string}
     */
    getStyleWidth() {
        let size = this.getDefaultWidth();

        let propertiesValues = this.propertiesValues();
        if ( propertiesValues['fullwidth'] ) {
            size = '100%';
        }
        return size;
    }


    /**
     * Will return all defined variables with the transferred/default values.
     * It will also include additional attributes defined as BooleanRequest from the calling
     * aurora element.
     * @returns {{}}
     */
    propertiesValues() {
        var propertiesValues = {};
        var defaults   = this.propertiesDefaultValues();
        var attributes = this.transferredAttributes();
        var asBoolean  = this.propertiesAsBooleanRequested();

        for (var prop of Object.keys( defaults ) ) {
            if ( attributes.hasOwnProperty( prop ) ) {
                if ( attributes[prop] === '' ) {
                    propertiesValues[prop] = true;
                } else {
                    propertiesValues[prop] = this.transformPropertyValue( prop, attributes[prop] )
 //                   propertiesValues[prop] = attributes[prop];
                }
            } else {
                propertiesValues[prop] = defaults[prop];
            }
            if ( asBoolean.hasOwnProperty( prop ) ) {
                if ( propertiesValues[prop] ) {
                    propertiesValues[ asBoolean[prop] ] = this.transformPropertyAsBooleanValue( prop, attributes[prop] );
                } else {
                    propertiesValues[ asBoolean[prop] ] = false;
                }
            }
        }
        return propertiesValues;
    }

    transformPropertyAsBooleanValue( property, value ) {
        if ( value == '' ) { return false; }
        return true;
    }

    transformPropertyValue( property, value ) {

        switch ( this.propertiesDefinitions()[property].type ) {
            case 'array':
                // TODO: still debug code...
                let temp = value.replaceAll(/[\n\r]/g, '');
                temp = temp.replaceAll("'", '"');
                let test = JSON.parse( temp );
                return test;
                break;
            default:
                return value;
        }
    }

    async calculatedValues() {
        return {};
    }

    /**
     * This array describes addtional attributes which most time are used in the themplate engine
     *
     * @returns {{attribute: booleanrepresentation,}}
     */
    propertiesAsBooleanRequested() { return {};}

    /**
     * Returns an array with all the defined default values.
     * @returns {{}}
     */
    propertiesDefaultValues() {
        if (_defaultValues[this.elemId]) return _defaultValues[this.elemId];
        var defaultValues = {};
        var defs = this.propertyDefs;
        for ( var i in defs ) {
            defaultValues[i] = defs[i]['default'];
        }
        _defaultValues[this.elemId] = defaultValues;
        return defaultValues;
    }

    get propertyDefs() {
        if (!this._propertyDefs) this._propertyDefs = this.propertiesDefinitions();
        return this._propertyDefs;
    }

    /**
     * This array holds the definitions of the available properties of the element.
     * @returns {Object}
     */
    propertiesDefinitions() {
        return {};
    }

    /*
     * Theme Behaviors
     */

    async attachBehavior() {
        if (this.behavior) return;
        let Behavior = await this.themeBehavior(this.appliedTemplateName);
        if (!Behavior) return;
        try {
            this.behavior = new Behavior();
            if (!this.behavior.attach) return; // not a theme behavior!
            await this.behavior.attach(this);
            this.doBehaviorQ();
        } catch (e) {
            console.log(`Can't create behavior: '${this.elemId}' -> '${this.appliedTemplateName}': ${e.stack ? e.stack : e.message }`);
        }
    }

    async themeBehavior(name) {
        if (_behaviormodule[`${this.elemId}:${name}`]) return _behaviormodule[`${this.elemId}:${name}`].default;
        return await Q(`${this.elemId}/behavior`, async () => {
            let tplelem = this.templateElements;
            if (!tplelem) return;
            let uiroot       = this.uiComponentRoot;
            let theme        = tplelem.theme || 'material';
            let component    = tplelem.component;
            let behaviorpath = `${uiroot}/${theme}/${component}/${theme}${name}.mjs`;
            let behaviormodule;
            if (behaviorpath) {
                try {
                    behaviormodule = await import(behaviorpath);
                } catch (e) {
                    console.log(`Can't load behavior '/${theme}/${component}/${theme}${name}.mjs': ${e.stack ? e.stack : e.message }`);
                    // behavior not found, always return empty, don't try to load again
                    behaviormodule = { default: undefined };
                }
            } else {
                behaviormodule = { default: undefined };
            }
            _behaviormodule[`${this.elemId}:${name}`] = behaviormodule;
            return behaviormodule.default;
        });
    }

    behaviorname() {
        let clsname = className(this).toLowerCase();
        if (clsname.startsWith('aurora')) clsname = clsname.substr(6); // cut away 'aurora'
        return `${clsname}.mjs`;
    }

    behaviorQ(fn) {
        if (this.behavior) {
            fn();
        } else {
            this._behaviorQ.push(fn);
        }
    }

    doBehaviorQ() {
        let q = this._behaviorQ;
        this._behaviorQ = [];
        q.forEach(fn => fn());
    }

    /*
     * View models
     */

    attachViewModel(viewModel) {
        this.viewModel = viewModel;
/*
        this._mutationobserver = new MutationObserver((mutations) => {
            this.viewMutated(mutations);
        });
        this._mutationobserver.observe(this.shadowRoot, observeOptions);
*/
    }

    detachViewModel(viewModel) {
        // if (this._mutationobserver) this._mutationobserver.disconnect();
    }

    viewMutated(mutations) {
        // todo [OPEN]: depending on the mutation, e.g. adding/removing a control or input, the ViewModel needs to be adjusted
        // this.viewModel.viewMutated(mutations);
    }

    attachViewItem(viewItem) {

    }

    detachViewItem(viewItem) {

    }

    /*
     * Aurora sub elements
     */

    get auroraname() {
        return this.getAttribute('aurora-name');
    }

    get isAuroraElement() {
        return true;
    }

    get isAuroraView() {
        return !!this.auroraname;
    }

    // todo [REFACTOR]: handle dynamic element mutations (add/remove some elements)
    get viewElements() {
        let elems = this.childViews;
        if (this.isAuroraView) elems.unshift(this);
        return elems;
    }

    get childViews() {
        let elements = this.allChildNodes( [...this.container.children]);
        return elements.filter(element => element.isAuroraView);
    }

    auroraChildNodes() {
        return this.container.children;
    }

    allChildNodes(nodes) {
        let elements = [];
        nodes.forEach(node => {
            elements.push(node);
            elements = elements.concat(this.allChildNodes([...node.children]));
        });
        return elements;
    }

    attachView(parentelement) {

    }

    detachView(parentelement) {

    }
}

/*
 * Aurora Behavior Extensions for HTMLElements
 * todo [REFACTOR]: add observation capabilities also to all other nodes. Enable observation of not aurora elements
 */

Object.defineProperties(Node.prototype,{
    isAuroraElement     : { value: false, configurable: true, enumerable: true, writable: true  },
    isAuroraFormElement     : { value: false, configurable: true, enumerable: true, writable: true  },
    isAuroraView        : { value: false, configurable: true, enumerable: true, writable: true  },

    attachView: {
        configurable: false,
        enumerable: false,
        writable: true,
        value: function(parentelement) {
        }
    },
    detachView: {
        configurable: false,
        enumerable: false,
        writable: true,
        value: function(parentelement) {
        }
    },

    viewElements: {
        configurable: false,
        enumerable: false,
        get: function () {    // don't use () => {} because it binds this to undefined!
            return [...this.children].filter(child => child.isAuroraView);
        }
    }

/*
    attachViewModel: {
        configurable: true,
        enumerable: false,
        writable: true,
        value: function(viewModel) {
            this._mutationobserver = new MutationObserver((mutations) => {
                viewModel.viewMutated(mutations);
            });
            this._mutationobserver.observe(this, observeOptions);
        }
    },

    detachViewModel: {
        configurable: true,
        enumerable: false,
        writable: true,
        value: function(viewModel) {
            if (this._mutationobserver) this._mutationobserver.disconnect();
        }
    }
*/
});
