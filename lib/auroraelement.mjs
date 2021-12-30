/**
 * use this as base class for all aurora elements!
 *
 * @author: Bernhard Lukassen
 */

import { forEach, className, parseIni, joinPath } from '/evolux.util';
import ResourceProxy                              from "/thoregon.truCloud/lib/resource/resourceproxy.mjs";
import Query                                      from "/thoregon.truCloud/lib/query.mjs";

// import { doAsync }             from "/evolux.universe";
import UIElement               from './uielement.mjs';
import translate, * as plurals from './i18n/translate.mjs';
import doT                     from "./formating/doT.mjs";

import { ErrNotImplemented }   from "./errors.mjs";
import { Q }                   from "/evolux.util";

import { asColorDefinitions }  from "./util.mjs";
import { StateMachine }        from '/evolux.util';


//
// resources
//
let proxy;
let import_ = async (url)      => await import(url);
let fetch_  = async (url, opt) => await fetch(url, opt);

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
let _cssparts            = {};
let _i18n                = {};
let _config              = {};
let _templates           = {};
let _colors              = {};
let _appstyle            = {};

const auroraelements    = {};

const appelements       = {};

const AURORA_ROOT = '/thoregon.aurora';

export default class AuroraElement extends UIElement {

    constructor() {
        super();
        this._behaviorQ = [];
        this._validation = undefined;
        this._vmQ        = [];

        this._state = new ElementStatus();
        this._state.create();
        this.emit('create', { element: this });
        this._state.created();
    }

    //
    // dynamic element import
    //

    static withElements(elements) {
        // Object.assign(auroraelements, elements);
        Object.entries(elements).forEach(([name, path]) => {
            if (Array.isArray(path)) {
                auroraelements[name] = [];
                path.forEach(item => auroraelements[name].push(item.replace(/^\.\/lib/, AURORA_ROOT+'/lib')));
            } else {
                auroraelements[name] = path.replace(/^\.\/lib/, AURORA_ROOT+'/lib');
            }
        });
    }

    static async dynamicElements(root) {
        // await this._proxy();
        root = root || window.body;
        for await (const element of [...root.querySelectorAll('*')]) {
            const tag = element.tagName.toLowerCase();
            const src = auroraelements[tag];
            if (src) {
                delete auroraelements[tag];
                try {
                    // there can be a collection of elements to import
                    if (Array.isArray(src)) {
                        for await (const item of src) {
                            await import_(item);
                        }
                    } else {
                        await import_(src);
                    }
                } catch (e) {
                   if (universe.DEBUG) console.log(`$$ can't import aurora-element ${tag}`, e);
                }
            }
        }
    }

    static addAppElement(elem, path, name) {
        appelements[elem.elementTag] = { elem, path, name };
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
     *
     * todo [REFACTOR]: introduce a hook (register callback) to avoid disabling of framework functions
     */
    attributeChangedCallback(name, oldValue, newValue) {
        // bind set handler to aurora element instance
        let forwarded = this._forwardedAttributes ? this._forwardedAttributes[name] : undefined;
        if (forwarded) {
            if (this._modifyingAttrs) return;       // well, this works only in a single threaded JS engine!
            this.propagateForwardedAttribute(name, forwarded, newValue);
        }
        super.attributeChangedCallback(name, oldValue, newValue);
    }

    propagateForwardedAttribute(name, forwarded, newValue) {
        let elements = [...this.container.querySelectorAll(forwarded.select)];
        elements.forEach((element) => {
            let currentValue = element.getAttribute(name);
            if (currentValue !== newValue) {
                if (newValue == undefined) {
                    element.removeAttribute(name);
                } else {
                    element.setAttribute(name, newValue);
                }
            }
        })
}

    propagateForwardedAttributes() {
        Object.entries(this._forwardedAttributes).forEach(([name, forwarded]) => {
            this.propagateForwardedAttribute(name, forwarded, this.getAttribute(name));
        })
    }

    collectionItemsLengthChanged() {
        // implement by subclass
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


    async refinish() {
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
                if (!elements)       this.logger.warn("forwardedProperties: selection returns no element");
                if (this[propname]) this.logger.warn(`forwardedProperties: property '${propname}' exists, didn't override`);
            }
        });
        Object.defineProperties(this, clsprops);

        // forward attributes
        let forwardedAttributes = this.constructor.forwardedAttributes();
        this._forwardedAttributes = {};
        Object.entries(forwardedAttributes).forEach(([attrname, definition]) => {
            let attrdef = Object.assign({}, definition, { name: attrname });
            if (!!attrdef.select) {
                this._forwardedAttributes[attrname] = attrdef;
                // !caution: changed; because we forward to multiple elements don't sync back (watch mutation)
                // attrdef.mutationobserver = new MutationObserver((mutations) => this.exposeAttribute(attrname, mutations));
                // attrdef.mutationobserver.observe(element, { attributes: true, attributeFilter: [attrname] });
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

        // route
        let route = this.propertiesValues()['route'];
        if (route && !this.auroraaction) {
            this.addEventListener('click', (evt) => this.triggerRoute());
        }
    }

    async childrenAvailiable(){
        this.propagateForwardedAttributes();
    }

    async connect() {
        // implement by subclasses
    }

    async existsConnect() {
        // implement by subclasses
    }

    /*
     * child element trigger
     */

    parentAddListenert() {
        let parent = this.parentAuroraElement();
        if (!parent) return;
        return parent.listenTo(this.container);
    }

    listenTo(childcontainer) {
        // implement by subclasses
    }

    actionTriggered(mutation) {
        if (this.handleActionTriggered(mutation)) return;
        let parent = this.parentAuroraElement();
        if (!parent) return;
        parent.actionTriggered(mutation);
    }

    handleActionTriggered(mutation) {
        return false;
    }

    get hasItemActions() {
        return false;
    }



    /*
     * UI rendering
     */

    // returns undefined. methods using it must handle undefined
    get componentConfiguration() {
    }

    applyStyles() {
        // let tplelem = this.componentConfiguration;

    }

    buildElement() {
        return this.builder.newDiv();
    }

    async config() {
        // await AuroraElement._proxy();

        this.elemconfig = await this.getComponentConfig();
        let transl      = await this.getComponentTranslations();
        this.i18n       = transl
            ? translate(transl, {
                pluralize: plurals.plural_EN,       // todo: select language
            })
            : (msg) => msg;
    }

    async refresh() {
        let container = this.container;
        if (!container) return;
        container.innerHTML = '';
        delete this.behavior;
        await this.applyContent(container);
        if (this.viewModel) await this.viewModel.refreshView(this);
    }

    async applyContent(container) {
        await this.applyTemplates(container);
        await this.adjustContent(container);
        await this.applyChildElements(container);
        await this.attachBehavior();
    }


    async allChildElementsExists() {
        let created = this.allAuroraElements.map(item => {
            return new Promise((resolve) => {
                if (item._elementExists) resolve(item);
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

    /*
        todo [OPEN]: sanitize content of 'properties'
     //----------------------
    function quoteattr(s, preserveCR) {
        preserveCR = preserveCR ? '&#13;' : '\n';
        return ('' + s) // Forces the conversion to string.
            .replace(/&/g, '&amp;') // This MUST be the 1st replacement.
            .replace(/'/g, '&apos;') // The 4 other predefined entities, required.
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
        //  You may add other replacements here for HTML only (but it's not necessary).
        //  Or for XML, only if the named entities are defined in its DTD.
            .replace(/\r\n/g, preserveCR) // Must be before the next replacement.
            .replace(/[\r\n]/g, preserveCR);
     }
     //----------------------
     @see also to sanitize HTML: https://gomakethings.com/how-to-sanitize-html-strings-with-vanilla-js-to-reduce-your-risk-of-xss-attacks/
     */
    async renderTemplateWithProperties ( templateName, properties ) {
        let tplsrc            = await this.templates();
        let tplstr            = tplsrc[ templateName ];
        if (!tplsrc) {
            throw ErrTemplateNotFound(`${this.elemId} - ${templateName}`);
        }
        let tempFn            = doT.template(tplstr, undefined, {});
        this.tplVars          = tempFn.vars;
        return tempFn(properties);
    }

    collectedProperties() {
        let properties        = this.propertiesValues();
        Object.assign( properties, this.getVMProperties(), this.globalProperties(), this.getCalculatedProperties() );
        return properties;
    }

    async renderTemplate( templateName ) {
        let properties = this.collectedProperties();
        let calcValues = await this.calculatedValues();
        Object.assign(properties, calcValues);
        properties['classes'] = this.collectClasses().join(' ');
        return await this.renderTemplateWithProperties(templateName, properties)
    }

    async applyTemplates(container) {
        let element = await this.renderTemplate( this.appliedTemplateName);

        container.innerHTML   = element;
        container.style.width = this.getStyleWidth();
        // import missing aurora elements
        await AuroraElement.dynamicElements(container);

        this.observeTriggers(container);
    }

    observeTriggers(container) {
        // container.addEventListener('click', (evt) => this.triggerClicked(evt), true);
    }

    triggerClicked(evt) {
        // todo [OPEN]: introduce a name mapping to handle triggers with other names
        let elem = evt.path[0];
        let trigger;
        while(!trigger && elem) {
            trigger = elem.getAttribute("aurora-trigger");
            if (!trigger) elem = elem.parentElement;
        }
        if (!trigger) return;
        if (this.behavior) this.behavior.triggerClicked(trigger, evt);
    }

    collectClasses() {
        let propertiesValues = this.propertiesValues();
        let classes = [];
        if ( propertiesValues['class'] != '' )   { classes.push( propertiesValues['class'] ); }
        return classes;
    }

    elementSpec() {
        let tplelem = this.componentConfiguration;
        if (!tplelem) return {};
        let uiroot    = this.uiRoot;
        let theme     = tplelem.theme || 'material';
        let component = tplelem.component;
        let style     = tplelem.style;

        let pathary = [];
        pathary.push(uiroot);
        if (this.isAppElement()) pathary.push("themes");
        pathary.push(theme);
        if (component) pathary.push(component);
        if (style) pathary.push(style);
        let path = pathary.join('/');

        return { tplelem, path, theme };
    }

    //
    // element parts (ini, config, i18n, css, ...)
    //

    get elemHasI18N() {
        return true;
    }

    get elemHasConfig() {
        return true;
    }

    get elemHasFlex() {
        return true;
    }

    get elemHasSkeleton() {
        return true;
    }


    //--- load all the templates which are used for this component
    //    by definition it will load the templates from the componentConfiguration
    //    but this may be overwritten by the config file from the theme component
    //
    async templates() {
        if (_templates[this.elemId]) return _templates[this.elemId];
        return await Q(`${this.elemId}/templates`, async () => {
            const { tplelem, path, theme } = this.elementSpec();
            if (!tplelem) {
                _templates[this.elemId] = {};
                return {};
            }

            let templates     = {};
            let tplnames      = await this.templateConfiguration() || tplelem.templates;

            await forEach(tplnames, async (name) => {
                let tplpath = `${path}/${theme}${name}.jst`;
                try {
                    let res = await this.fetch(tplpath);
                    if (res.ok) templates[name] = await res.text();
                } catch (ignore) {
                    // console.log("templates()", ignore);
                }
            });
            _templates[this.elemId] = templates;
            return templates;
        });
    }

    async templateConfiguration() {
        let config = await this.getComponentConfig();
        return config?.templates?.items;
    }

    get app() {
        return this._app ? this._app : this.uibase ? this.uibase.app : this.parentElement ? this.parentElement.app : undefined;
    }

    set app(app) {
        this._app = app;
    }

    get uiRoot() {
        return (this.isAppElement())
            ? this.appElementUiRoot
            : this.delivery(this.uiComponentRoot);
    }

    isAppElement() {
        return !!appelements[this.elemId];
    }

    get appElementSpec() {
        return appelements[this.elemId];
    }

    get appElementUiRoot() {
        const appelemdef = appelements[this.elemId];
        return appelemdef.path + '/' + appelemdef.name;
    }

    get themeRoot() {
        return this.delivery(this.constructor.uiThemeRoot);
    }

    get uiComponentRoot() {
        return this.constructor.uiComponentRoot;
    }

    static get uiThemeRoot() {
        return'/thoregon.aurora/themes';
    }

    static get uiComponentRoot() {
        return this._uiroot ? this._uiroot : this.uiThemeRoot;
    }

    static set uiComponentRoot(root) {
        this._uiroot = root;
    }



    delivery(path) {
        return this.constructor.delivery(path);
    }

    static delivery(path) {
        return thoregon.delivery ? thoregon.delivery + path : path;
    }

    async getComponentConfig() {
        if (!this.elemHasConfig) _i18n[this.elemId] = {};
        if (_config[this.elemId]) return _config[this.elemId];
        return await Q(`${this.elemId}/config`, async () => {
            const { tplelem, path, theme } = this.elementSpec();
            if (!tplelem) {
                _config[this.elemId] = {};  // init empty
                return {};
            }

            let inipath = `${path}/config.ini`;
            try {
                let res = await this.fetch(inipath);
                if (res.ok) {
                    let ini              = await res.text();
                    let config           = parseIni(ini);
                    _config[this.elemId] = config;
                    return config;
                }
            } catch (e) {
                if (universe.DEBUG) console.log(e);
            }
            _config[this.elemId] = {};    // init empty
            return {};
        });
    }

    async getComponentTranslations() {
        if (!this.elemHasI18N) _i18n[this.elemId] = {};
        if (_i18n[this.elemId]) return _i18n[this.elemId];
        return await Q(`${this.elemId}/i18n`, async () => {
            const { tplelem, path, theme } = this.elementSpec();
            if (!tplelem) {
                _i18n[this.elemId] = {};
                return {};
            }

            let inipath   = `${path}/i18n.json`;
            try {
                let res = await this.fetch(inipath);
                if (res.ok) {
                    let ini            = await res.text();
                    let i18n           = JSON.parse(ini);
                    _i18n[this.elemId] = i18n;
                    return i18n;
                }
            } catch (ignore) { }
            _i18n[this.elemId] = {};
            return {};
        });
    }

    // todo [REFACTOR]:
    //  - review the CSS hierarchy
    //  - simpler caching
    //  - use constructed stylesheet (only Chromium based browsers)
    //      -> https://developers.google.com/web/updates/2019/02/constructable-stylesheets
    //      -> CSSStyleSheet (https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet)
    async elementStyle(templatename) {
        let cacheid = `${this.elemId}/${this.appliedTemplateName}`;
        if (_styles[cacheid]) return _styles[cacheid];
        // console.log("> elementStyle", cacheid);
        return await Q(`${cacheid}/style`, async () => {
            let tplelem = this.componentConfiguration;
            if (!tplelem) {
                _styles[cacheid] = '';
                return '';
            }
            templatename  = templatename ? `${tplelem.theme || 'material'}${templatename}` : `${tplelem.theme || 'material'}${this.appliedTemplateName}`
            let styles    = [];
            let uiroot    = this.uiRoot;
            let theme     = tplelem.theme || 'material';
            let component = tplelem.component;
            let csspath;

            // get color definition if any
            if (!_colors[uiroot]) {
                try {
                    let res = await this.fetch(`${uiroot}/${theme}/app/colors.xml`);
                    if (res.ok) {
                        let xml       = await res.text();
                        let colorDefs = asColorDefinitions(xml);
                        let colorCSS  = this.asColorCSS(colorDefs);
                        _colors[uiroot] = colorCSS || '/* no colors.xml */\n';
                        styles.push(_colors[uiroot]);
                    }
                } catch (ignore) { }
            } else {
                styles.push(_colors[uiroot]);
            }

            // style for app
            if (!_appstyle[uiroot]) {
                csspath   = `${uiroot}/${theme}/app/app.css`;
                try {
                    let res = await this.fetch(csspath);
                    if (res.ok) {
                        _appstyle[uiroot] = await res.text();
                        styles.push(_appstyle[uiroot]);
                    }
                } catch (ignore) { }
            } else {
                styles.push(_appstyle[uiroot]);
            }

            // style for flex rows
            if (this.elemHasFlex) {
                csspath   = `${this.themeRoot}/${theme}/flex.css`;
                if (_cssparts[csspath]) {
                    styles.push(_cssparts[csspath]);
                } else {
                    try {
                        let res = await this.fetch(csspath);
                        if (res.ok) {
                            let css            = await res.text();
                            _cssparts[csspath] = css;
                            styles.push(css);
                        }
                    } catch (ignore) { }
                }
            }

            // style for flex skeleton
            if (this.elemHasSkeleton) {
                csspath = `${this.themeRoot}/${theme}/skeleton.css`;
                if (_cssparts[csspath]) {
                    styles.push(_cssparts[csspath]);
                } else {
                    try {
                        let res = await this.fetch(csspath);
                        if (res.ok) {
                            let css            = await res.text();
                            _cssparts[csspath] = css;
                            styles.push(css);
                        }
                    } catch (ignore) { }
                }
            }

            // style for general theme
            csspath   = `${this.themeRoot}/${theme}/${theme}.css`;
            if (_cssparts[csspath]) {
                styles.push(_cssparts[csspath]);
            } else {
                try {
                    let res = await this.fetch(csspath);
                    if (res.ok) {
                        let css = await res.text();
                        _cssparts[csspath] = css;
                        styles.push(css);
                    }
                } catch (ignore) { }
            }

            // sytle for theme in app
            csspath   = `${uiroot}/${theme}/${theme}.css`;
            if (_cssparts[csspath]) {
                styles.push(_cssparts[csspath]);
            } else {
                try {
                    let res = await this.fetch(csspath);
                    if (res.ok) {
                        let css = await res.text();
                        _cssparts[csspath] = css;
                        styles.push(css);
                    }
                } catch (ignore) { }
            }

            let style     = tplelem.style;

            let pathary = [];
            pathary.push(uiroot);
            if (this.isAppElement()) pathary.push('themes');
            pathary.push(theme);
            if (component) pathary.push(component);
            if (style) pathary.push(style);

            let componentPath = pathary.join('/');

            // sytle for component
            csspath = this.isAppElement() ? `${uiroot}/${this.appElementSpec.name}.css`: `${componentPath}/${component}.css`;
            if (_cssparts[csspath]) {
                styles.push(_cssparts[csspath]);
            } else {
                try {
                    let res = await this.fetch(csspath);
                    if (res.ok) {
                        let css = await res.text();
                        _cssparts[csspath] = css;
                        styles.push(css);
                    }
                } catch (ignore) { }
            }

            const appelement = this.getAuroraAppElement();
            if (appelement?.appstyle) {
                styles.push(appelement.appstyle);
            }
            // sytle for template
            csspath = `${componentPath}/${templatename}.css`;
            if (_cssparts[csspath]) {
                styles.push(_cssparts[csspath]);
            } else {
                try {
                    let res = await this.fetch(csspath);
                    if (res.ok) {
                        let css = await res.text();
                        _cssparts[csspath] = css;
                        styles.push(css);
                    }
                } catch (ignore) { }
            }
            _styles[cacheid] = `/* elem: ${this.elemId} */\n${styles.join('\n')}`;
            return _styles[cacheid];
        });
    }

    asColorCSS(colorDefs) {
        // implement by subclass
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

    domRemoveChild(element) {
        super.removeChild(element);
    }

    disposeView() {
        this.childViews.forEach(view => view.disposeView());
        this.destroy();
    }

    destroy() {
        // implement by subclass
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
        let size = '100%';
        try {
            size = this.getDefaultWidth();

            let propertiesValues = this.propertiesValues();
            if (propertiesValues['fullwidth']) {
                size = '100%';
            }
        } catch (e) {
            if (universe.DEBUG) console.log(e);
        }
        return size;
    }

    getDefaultWidth() {
        return '100%';
    }

    /**
     * Will return all defined variables with the transferred/default values.
     * It will also include additional attributes defined as BooleanRequest from the calling
     * aurora element.
     * @returns {{}}
     */
    propertiesValues() {
       if ( this._propertiesValues ) return this._propertiesValues;
        let propertiesValues = {};
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
        this._propertiesValues = propertiesValues;
        return propertiesValues;
    }


    transformPropertyAsBooleanValue( property, value ) {
        if ( value === '' ) { return false; }
        return true;
    }

    transformPropertyValue( property, value ) {

        switch ( this.elementProperties[property].type ) {
            case 'array':
                // TODO: still debug code...
                let temp = value.replaceAll(/[\n\r]/g, '');
                temp = temp.replaceAll("'", '"');
                let test;
                try {
                    test = JSON.parse( temp );
                } catch (ignore) {
                    test = [];
                }
                return test;
                break;
            case'boolean':
                return ( value === 'true' );
            default:
                return value;
        }
    }

    globalProperties() {
        let props = { loggedin: universe.Identity ? universe.Identity.is : false };
        if (universe.uirouter?.app) Object.assign(props, { interface: universe.uirouter.app.interfaceSettings });
        return props;
    }

    getVMProperties() {
        let properties = this.viewmodel?.getVMProperties() || {};
        return properties;
    }

    getCalculatedProperties() {
        return {};
    }

    async calculatedValues() {
        return {};
    }

    /**
     * This array describes addtional attributes which most time are used in the themplate engine
     *
     * @returns {Object}
     */
    propertiesAsBooleanRequested() { return {};}

    /**
     * Returns an array with all the defined default values.
     * @returns {{}}
     */
    propertiesDefaultValues() {
        if (_defaultValues[this.elemId]) return _defaultValues[this.elemId];
        var defaultValues = {};
        var defs = this.elementProperties;
        for ( var i in defs ) {
            defaultValues[i] = defs[i]['default'];
        }
        _defaultValues[this.elemId] = defaultValues;
        return defaultValues;
    }

    get elementProperties() {
        if (!this._propertyDefs) this._propertyDefs = this.propertiesDefinitions();
        return this._propertyDefs;
    }

    /**
     * This array holds the definitions of the available properties of the element.
     * @returns {Object}
     */
    propertiesDefinitions() {

        return {
            route: {
                default:        '',
                type:           'string',
                description:    'It defines the route the router will use in case the element will be clicked.',
                group:          'Behavior',
                example:        'app/settings/{id}/details'
            }
        };
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
            if (universe.DEBUG) console.log(`Can't create behavior: '${this.elemId}' -> '${this.appliedTemplateName}': ${e.stack ? e.stack : e.message }`);
        }
    }

    async themeBehavior(name) {
        let id = `${this.elemId}/${name}`;
        if (_behaviormodule[id]) return _behaviormodule[id].default;
        return await Q(`${id}/behavior`, async () => {
            const { tplelem, path, theme } = this.elementSpec();
            if (!tplelem) {
                _behaviormodule[id] = { default: undefined };
                return _behaviormodule[id];
            }

            // let behaviorpath = `${uiroot}/${theme}/${component}/${style}${theme}${name}.mjs`;
            let behaviorpath = `${path}/${theme}${name}.mjs`;
            let behaviormodule;
            if (behaviorpath) {
                try {
                    behaviormodule = await this.import(behaviorpath);
                } catch (e) {
                    if (universe.DEBUG) console.log(`Can't load behavior '${behaviorpath}': ${e.stack ? e.stack : e.message }`);
                    // behavior not found, always return empty, don't try to load again
                    behaviormodule = { default: undefined };
                }
            } else {
                behaviormodule = { default: undefined };
            }
            _behaviormodule[id] = behaviormodule;
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

    vmQ(fn) {
        if (this.viewModel) {
            fn();
        } else {
            this._vmQ.push(fn);
        }
    }

    doVMQ() {
        let q = this._vmQ;
        this._vmQ = [];
        q.forEach(fn => fn());
    }

    /*
     * View models
     */

    attachViewModel(viewModel) {
        this.viewModel = viewModel;
        this.doVMQ();
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
     * aurora element features
     */

    get isOutput() {
        return false;
    }

    get isInput() {
        return false;
    }

    get isTrigger() {
        return false;
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
        return !!this.auroraname || !!this.auroraaction;
    }

    get level() {
        return this.getAttribute('level');
    }

    set level(level) {
        this.setAttribute('level', level);
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

    get childAuroraElements() {
        return [...this.auroraChildNodes()].filter(element => element.isAuroraElement);
    }

    get allAuroraElements() {
        let elements = this.allChildNodes( [...this.container.children]);
        return elements.filter(element => element.isAuroraElement);
    }

    auroraChildNodes() {
        return this.container.children;
    }

    get expandedChildNodes() {
        return this.allChildNodes( this.container ? [...this.container.children] : []);
    }

    allChildNodes(nodes) {
        let elements = [];
        nodes.forEach(node => {
            if (!node.$isListContext) {
                elements.push(node);
                let children = node.container ? node.container.children : node.children;
                elements = elements.concat(this.allChildNodes([...children]));
            }
        });
        return elements
    }

    get $isListContext() {
        return false;
    }

    attachView(parentelement) {

    }

    detachView(parentelement) {

    }

    clone() {
        let elem = document.createElement(this.elemId);
        this.getAttributeNames().forEach(attr => elem.setAttribute(attr, this.getAttribute(attr)));
        return elem;
    }

    get uirouter() {
        return universe.dorifer.uirouter;
    }

    getWestProperty(name) {
        return this.viewModel ? this.viewModel.getWestProperty(name) : undefined;
    }

    //
    // persistent data
    //

    query(name) {
        const root      = '/' + (this.appelement.ctx.ctxname || '');
        const queryName = name.startsWith('/') ? name : joinPath(root, name);
        const query     = Query.from(queryName);
        return query;
    }

    //
    // routing
    //
    triggerRoute() {
        let route = this.propertiesValues()['route'];
        this.uirouter.routePath(route);
    }

    //
    // resources
    //

    static async _proxy() {
        if (!proxy) {
            proxy   = await ResourceProxy.on(AURORA_ROOT);
            // proxy avalable, replace
            import_ = async (url)      => await proxy.import(url);
            fetch_  = async (url, opt) => await proxy.fetch(url, opt);
        }
        return proxy;
    }

    async exists(path) {
        try {
            return (await this.fetch(path,{ method: 'HEAD' } )).status === 200;
        } catch (ignore) { }
        return false;
    }

    async fetch(path, opt) {
        return this.isAuroraPath(path) ? await fetch_(path, opt) : await this.appFetch(path, opt);
    }

    async import(path) {
        return this.isAuroraPath(path) ? await import_(path) : await this.appImport(path);
    }

    isAuroraPath(path) {
        return path.startsWith(AURORA_ROOT);
    }

    get appelement() {
        if (!this._appelement) this._appelement = this.getAuroraAppElement();
        return this._appelement;
    }

    async appFetch(path, opt) {
        return await this.appelement.appStructure.fetch(path, opt);
    }

    async appImport(path) {
        return await this.appelement.appStructure.import(path);
    }

}

/*
 * Aurora Behavior Polyfills (Extensions) for HTMLElements
 * todo [REFACTOR]: add observation capabilities also to all other nodes. Enable observation of not aurora elements
 */

Object.defineProperties(Node.prototype,{
    isAuroraElement    : { value: false, configurable: true, enumerable: true, writable: true },
    isAuroraFormElement: { value: false, configurable: true, enumerable: true, writable: true },
    isAuroraView       : { value: false, configurable: true, enumerable: true, writable: true },
    isAuroraCollection : { value: false, configurable: true, enumerable: true, writable: true },
    isItemDecorator    : { value: false, configurable: true, enumerable: true, writable: true },
    isCollectionItem   : { value: false, configurable: true, enumerable: true, writable: true },
    tiggerEventName    : { value: 'click', configurable: true, enumerable: true, writable: true },
    valueEventName     : { value: 'change', configurable: true, enumerable: true, writable: true },
    immedValueEventName: { value: 'input', configurable: true, enumerable: true, writable: true },
    app : {
        configurable: false,
        enumerable: false,
        get: function () {
            return this.uibase ? this.uibase.app : this.parentElement ? this.parentElement.app : undefined
        }
    },
    isTrigger       : {
        configurable: false,
        enumerable: false,
        get: function () {    // don't use () => {} because it binds this to undefined!
            return !!this.auroraaction;
        }
    },

    isOutput       : {
        configurable: false,
        enumerable: false,
        get: function () {    // don't use () => {} because it binds this to undefined!
            return !!this.auroraname;
        }
    },

    isInput       : {
        configurable: false,
        enumerable: false,
        get: function () {    // don't use () => {} because it binds this to undefined!
            return !!this.auroraname
                   && (this instanceof HTMLInputElement
                       || this instanceof HTMLSelectElement
                       || this instanceof HTMLTextAreaElement);
        }
    },
    auroraname: {
        configurable: false,
        enumerable: false,
        get: function () {
            return this.getAttribute('aurora-name');
        }
    },
    auroraaction: {
        configurable: false,
        enumerable: false,
        get: function () {
            return this.getAttribute('aurora-action');
        }
    },
    auroraroute: {
        configurable: false,
        enumerable: false,
        get: function () {
            return this.getAttribute('route');
        }
    },
    auroraoptions: {
        configurable: false,
        enumerable: false,
        get: function () {
            return this.getAttribute('aurora-options');
        }
    },
    disposeView: {
        configurable: false,
        enumerable: false,
        writable: true,
        value: function(parentelement) {
            [...this.children].forEach(child => child.disposeView());
        }
    },
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
            return this.expandedChildNodes.filter(child => child.isAuroraView);
        }
    },
    expandedChildNodes: {
        configurable: false,
        enumerable: false,
        get: function () {    // don't use () => {} because it binds this to undefined!
            let elements = [];
            [...this.children].forEach(node => {
                elements = [...elements, node, ...node.expandedChildNodes];
            });
            return elements;
        }
    },
    attachViewItem: {
        configurable: false,
        enumerable: false,
        writable: true,
        value: function(viewitem) {
        }
    },
    parentAuroraElement: {
        configurable: false,
        enumerable: false,
        writable: true,
        value: function(tagname) {
            if (this.uibase) return !tagname ? this.uibase : this.uibase.tagName === tagname ? this.uibase : this.uibase.parentAuroraElement();
            if (this.parentElement) return this.parentElement.parentAuroraElement();
        }
    },
    parentViewModel: {
        configurable: false,
        enumerable: false,
        writable: true,
        value: function() {
            if (this.uibase) return this.uibase.viewModel || this.uibase.parentViewModel();
            if (this.parentElement) return this.parentElement.parentViewModel();
        }
    },
    getAuroraAppElement: {
        configurable: false,
        enumerable: false,
        writable: true,
        value: function() {
            if (this.uibase) return this.uibase.getAuroraAppElement();
            if (this.parentElement) return this.parentElement.getAuroraAppElement();
            return universe.uirouter?.appelement;
        }
    },
    getAuroraBlueprint: {
        configurable: false,
        enumerable: false,
        writable: true,
        value: function() {
            if (this.uibase) return this.uibase.getAuroraBlueprint();
            if (this.parentElement) return this.parentElement.getAuroraBlueprint();
        }
    },
    elementProperties: {
        configurable: false,
        enumerable: false,
        writable: true,
        value: function() {
            let properties = {};
            this.getAttributeNames().forEach( (attr) => properties[attr] = {
                default:        '',
                type:           'string',
                description:    `Element attribute '${attt}`,
                group:          'Attributes',
                example:        ''
            });
            return properties;
        }
    },
    actionTriggered: {
        configurable: false,
        enumerable: false,
        writable: true,
        value: async function() {}
    },
    includeInViewMapping: {
        configurable: false,
        enumerable: false,
        writable: true,
        value: function () { return true }
    },
    untilExist: {
        configurable: false,
        enumerable: false,
        writable: true,
        value: async function() {}
    },
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

class ElementStatus {

    constructor() {
        this._fsm();
    }
}

const ElementState    = StateMachine.factory(ElementStatus, {
    init: 'beforeCreate',
    transitions: [

        //---- the create element phase of the lifecycle ---
        {name: 'create',    from: 'beforeCreate',  to: 'initializing'},
        {name: 'created',   from: 'initializing',  to: 'created'},

        //---- the element get mounted in the DOM ---
        {name: 'mount',     from: 'created',       to: 'beforeMount'},
        {name: 'mounted',   from: 'beforeMount',   to: 'mounted'},

        //---- the element is ready to use and will react on the
        //     attached business object and to the system
        {name: 'ready',     from: 'mounted',       to: 'reactive'},
        {name: 'update',    from: 'reactive',      to: 'beforeUpdate'},
        {name: 'updated',   from: 'beforeUpdate',  to: 'reactive'},

        //---- the destroy phase of the element ---
        {name: 'destroy',   from: 'reactive',      to: 'beforeDestroy'},
        {name: 'destroyed', from: 'beforeDestroy', to: 'destroyed'},

    ]
});


