/**
 * use this as base class for all aurora elements!
 *
 * @author: Bernhard Lukassen
 */

import { forEach, className, parseIni, joinPath, missing, Q } from '/evolux.util';
// import { doAsync }             from "/evolux.universe";

import ResourceProxy          from "/thoregon.truCloud/lib/resource/resourceproxy.mjs";
import Query                  from "/thoregon.truCloud/lib/query.mjs";
import UIElement              from './uielement.mjs';
import doT                    from "./formating/doT.mjs";
import { ErrNotImplemented }  from "./errors.mjs";

import translate, * as plurals from '/evolux.util/lib/i18n/translate.mjs';
import { ar }                  from "../ext/chunks/helpers.segment.js";

//
// resources
//
let proxy;
let import_ = async (url)      => await import(url);
let fetch_  = async (url, opt) => await fetch(url, opt);

/*
const observeOptions     = {
    childList            : true,
    subtree              : true,
    attributes           : true,
    attributeOldValue    : true,
    characterData        : true,
    characterDataOldValue: true
};
*/

//
// caches for required (imported) modules
//

let _behaviormodule      = {};
let _defaultValues       = {};
let _styles              = {};
let _cssparts            = {};
let _i18n                = {};
let _config              = {};
let _templates           = {};
let _colors              = {};
let _appstyle            = {};

//
//
//

const auroraelements    = {};

const appelements       = {};

const auroraattributes  = {};

// define the root for built in components
const AURORA_ROOT = '/thoregon.aurora';

const debuglog = (...args) => {}; // {};   // console.log(...args);

// todo [REFACTOR]: this is the name convention app structure. may be changed by the appication -> use app path definition
export const UISTRUCT = {
    ui        : {
        path: 'ui'
    },
    blueprint : {
        path: 'ui/blueprint'
    },
    views     : {
        path: 'ui/views'
    },
    components: {
        path: 'ui/components'
    },
    i18n      : {
        path: 'i18n'
    },
    schemas   : {
        path: 'lib/schemas'
    },
};

export default class AuroraElement extends UIElement {

    constructor() {
        super();
        this._behaviorQ  = [];
        this._initQ      = [];
        this._validation = undefined;

        // this._state = new ElementStatus();
        // this._state.create();
        this.emit('create', { element: this });
        // this._state.created();

        this._visible = true;
        this._enabled = true;
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
        // debuglog("&&> 1 start dynamicElements");
        const elements = [...root.querySelectorAll('*')].reverse();
        for await (const element of elements) {
            const tag = element.tagName.toLowerCase();
            const src = auroraelements[tag];
            if (src) {
                delete auroraelements[tag];
                // debuglog("&&> * dynamicElements import", tag);
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
        // debuglog("&&> 2 end dynamicElements");
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

    get visible() {
        return this._visible;
    }
    set visible(state) {
        this._visible = state;
        this.emitEvent(new Event('visible'));
    }

    get enabled() {
        return this._enabled;
    }
    set enabled(state) {
        this._enabled = state;
        this.emitEvent(new Event('enabled'));
    }

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
            const innerName = forwarded.inner ?? name;
            const currentValue = element.getAttribute(innerName);
            if (currentValue !== newValue) {
                if ( newValue == undefined || newValue == null ) {
                    element.removeAttribute(innerName);
                } else {
                    element.setAttribute(innerName, newValue);
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

    // todo [REFACTOR]: change to event model -> react to changes inside the container
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
            } else {
                this.logger.warn("forwardedAttributes: selection returns no element");
            }
        });

        // expose events
        let exposedEvents = this.exposedEvents();
        this._exposedEvents = {};       // memorize which events are now exposed with its listeners to be able to modify it
        Object.entries(exposedEvents).forEach(([eventname, definition]) => {
            let evtdef = Object.assign({ inner: eventname, edit: (auroraEvent, originalEvent) => true }, definition, { exposed: eventname } );
            let elements = evtdef.select ? [...this.container.querySelectorAll(evtdef.select)] : [this.container];
            if (elements.is_empty) {
                this.logger.warn("exposedEvents: selection returns no element");
            } else {
                evtdef.listener = (evt) => this.dispatchExposedEvent(evtdef, evt);
                evtdef.elements = elements;
                elements.forEach((element) => element.addEventListener(evtdef.inner, evtdef.listener));
                this._exposedEvents[eventname] = evtdef;
            }
        });

        // route
        let route = this.propertiesValues()['route'];
        if (route) {
            this.addEventListener('click', (evt) => this.triggerRoute());
        }
    }

    // todo [REFACTOR]: change to event model -> react to changes inside the container
    async childrenAvailiable(){
        this.propagateForwardedAttributes();
    }

    async connect() {
        // implement by subclasses
    }

    // todo [REFACTOR]: change to event model -> react to changes inside the container
    async existsConnect() {
        // implement by subclasses
    }

    /*
     * child element trigger
     */

    // todo [REFACTOR]: change to event model -> react to changes inside the container
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

    // aurora attribute definition

    static useAuroraAttribute(auroraattribute) {
        const attributename = auroraattribute.auroraName;
        if (missing(attributename in auroraattributes, `aurora attribute ${attributename} already registered`)) return;
        auroraattributes[attributename] = auroraattribute;
    }

    static get definedAuroraAttributes() {
        return auroraattributes;
    }

    //
    // UI rendering
    //

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
        // todo: need to be removed
        // todo [OPEN]: the material class "material-theme" -> because the split of css from app.css to material.css caused the issue
        container.classList.add("material-theme", "light-theme");

        this.skeletonOn(container);
        this.propagateViewContext(container);
        await this.applyTemplates(container);
        await this.adjustContent(container);
        await this.applyChildElements(container);
        await this.attachBehavior();
        this.observeContentChanges(container);
        this.skeletonOff(container);
    }

    async processInitQ() {
        for await (const fn of this._initQ) {
            await fn();
        }
        delete this._initQ;
    }

    addInitFn(fn) {
        if (!this._initQ) {
            fn();
            return;
        }
        this._initQ.push(fn);
    }

    //
    // skeleton
    //

    skeletonOn(container) {
        container.style.visibility = 'hidden';
        // container.classList.add('aurora-skeleton');
    }

    skeletonOff(container) {
        container.style.visibility = 'inherit';
        // container.classList.add('aurora-skeleton');
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

    collectedProperties() {
        let properties = {
            ...this.propertiesValues(),
            ...this.globalProperties(),
            ...this.getCalculatedProperties()
        }
        return properties;
    }

    async renderTemplate( templateName ) {
        let tplsrc            = await this.templates();
        let properties = this.collectedProperties();
        let calcValues = await this.calculatedValues();
        Object.assign(properties, calcValues);
        properties['classes'] = this.collectClasses().join(' ');
        let tplstr            = tplsrc[ templateName ];
        if (!tplsrc) {
            throw ErrTemplateNotFound(`${this.elemId} - ${templateName}`);
        }
        let tempFn            = doT.template(tplstr, undefined, {});
        this.tplVars          = tempFn.vars;
        return tempFn(properties);
    }

    propagateViewContext(container) {
        const ctx = this.viewContext();
        if (!ctx) return;
        container.setAttribute('view-context', ctx);
    }

    async applyTemplates(container) {
        debuglog("$$> init Element:", this.tagName);
        let element = await this.renderTemplate( this.appliedTemplateName);

        container.innerHTML   = element;
        container.style.width = this.getStyleWidth();
        // import missing aurora elements
        await AuroraElement.dynamicElements(container);

        this.observeTriggers(container);
        debuglog("::> rendered Element:", this.tagName);
    }

    observeTriggers(container) {
        // connect with outside triggers if embedded in a website of in a meshup
    }

    observeContentChanges(container) {
        // listen for content changes
    }

    /**
     * components internal only
     * will be fired if the user clicks somewhere on the UI
     * if the element specifies the 'aurora-trigger' attribute, it will be invoked
     * invokes a method on the behavior with the name 'trigger<evt-name>' if available
     * @param evt
     */
    triggerClicked(evt) {
        // todo [OPEN]: introduce a name mapping to handle triggers with other names
        let elem = evt.path[0];
        let trigger;
        while(!trigger && elem) {
            trigger = elem.getAttribute("aurora-trigger");
            if (!trigger) elem = elem.parentAuroraElement();
        }
        if (!trigger) return;
        this.behavior?.triggerClicked?.(trigger, evt);
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

    getAppViewRoot() {
        return this.getAuroraAppElement()?.uiBase
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

    resolveI18n ( string ) {
        let defaultText   = string;
        let i18nAttribute = "";
        let token         = "";
        let replacements  = "";

        if ( string.startsWith("i18n:") ) {
            let elements = string.split('|');
            i18nAttribute = elements[0].slice(5);

            token = i18nAttribute.replace(/ *\{[^)]*\} */g, "");
            replacements = i18nAttribute.slice( token.length );
            defaultText =   ( elements.length > 1)
                ? elements[1]
                : token;
        }

        return {
            defaultText  : defaultText,
            i18nAttribute: i18nAttribute,
            token        : token,
            replacements : replacements,
            i18nSpan     : '<span aurora-i18n="'+ i18nAttribute +'">'+ defaultText +'</span>'
        };
    }

    collectParentViewStyles(styles) {
        styles = styles ?? [];
        const aparent = this.parentAuroraElement();
        if (!aparent) return styles.join('\n');
        if (aparent.hasOwnStyle) styles.unshift(aparent.cssStyle);
        return aparent.collectParentViewStyles(styles);
        }


    // todo [REFACTOR]:
    //  - review the CSS hierarchy
    //  - simpler caching
    //  - use constructed stylesheet (only Chromium based browsers)
    //      -> https://developers.google.com/web/updates/2019/02/constructable-stylesheets
    //      -> CSSStyleSheet (https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet)
    async elementStyle(templatename) {
        let cacheid = `${this.elemId}/${this.appliedTemplateName}`;
        if (_styles[cacheid]) {
            const viewStyles = this.collectParentViewStyles();
            return _styles[cacheid] + '\n' + viewStyles;
        }
        // console.log("> elementStyle", cacheid);
        return await Q(`${cacheid}/style`, async () => {
            let tplelem = this.componentConfiguration;
            if (!tplelem) {
                _styles[cacheid] = '';
                return '';
            }
            templatename  = templatename ? `${tplelem.theme || 'material'}${templatename}` : `${tplelem.theme || 'material'}${this.appliedTemplateName}`
            let styles    = [];
            let theme     = tplelem.theme || 'material';
            let component = tplelem.component;
            await this.addAllCommonStyles(theme, styles);
            await this.addAppThemeStyles(theme, styles);
            await this.addAllComponentStyles(tplelem, theme, component, styles, templatename);
            _styles[cacheid] = styles.join('\n');
            const viewStyles = this.collectParentViewStyles();
            return _styles[cacheid] + '\n' + viewStyles;
        });
    }

    async addAllCommonStyles(theme, styles) {
        await this.addColors(theme, styles);
        await this.addAppStyles(theme, styles);
        await this.addFlexStyles(theme, styles);
        await this.addSkeletonStyles(theme, styles);
        await this.addThemeStyles(theme, styles);
        // add app theme styles
    }

    async addAllComponentStyles(tplelem, theme, component, styles, templatename) {
        let uiroot    = this.uiRoot;
        let style   = tplelem.style;
        let pathary = [];
        pathary.push(uiroot);
        if (this.isAppElement()) pathary.push('themes');
        pathary.push(theme);
        if (component) pathary.push(component);
        if (style) pathary.push(style);

        let componentPath = pathary.join('/');
        await this.addComponentStyles(uiroot, componentPath, component, styles);

        const appelement = this.getAuroraAppElement();
        if (appelement?.appstyle) {
            styles.push(this.structCSS(appelement.appstyle, 'appelement.appstyle'));
        }
        await this.addTemplateStyles(componentPath, templatename, styles);
    }

    async addTemplateStyles(componentPath, templatename, styles) {
        // style for template
        const csspath = `${componentPath}/${templatename}.css`;
        if (_cssparts[csspath]) {
            styles.push(_cssparts[csspath]);
        } else {
            try {
                let res = await this.fetch(csspath);
                if (res.ok) {
                    let css            = this.structCSS(await res.text(), csspath, `Template '${templatename}'`);
                    _cssparts[csspath] = css;
                    styles.push(css);
                }
            } catch (ignore) { }
        }
    }

    async addComponentStyles(uiroot, componentPath, component, styles) {
        // style for component
        const csspath = this.isAppElement() ? `${uiroot}/${this.appElementSpec.name}.css` : `${componentPath}/${component}.css`;
        if (_cssparts[csspath]) {
            styles.push(_cssparts[csspath]);
        } else {
            try {
                let res = await this.fetch(csspath);
                if (res.ok) {
                    let css            = this.structCSS(await res.text(), csspath, `Component '${component}'`);
                    _cssparts[csspath] = css;
                    styles.push(css);
                }
            } catch (ignore) { }
        }
    }

    async addAppThemeStyles(theme, styles) {
        let appuiroot    = this.getAppViewRoot();
        if (!appuiroot || appuiroot === this.uiRoot) return;

        // style for theme in app
        let csspath = `${appuiroot}/${theme}/${theme}.css`;
        if (_cssparts[csspath]) {
            styles.push(_cssparts[csspath]);
        } else {
            try {
                let res = await this.fetch(csspath);
                if (res.ok) {
                    let css            = this.structCSS(await res.text(), csspath, 'App Theme');
                    _cssparts[csspath] = css;
                    styles.push(css);
                }
            } catch (ignore) { }
        }
        //
        // style from blueprint
        //

        // styles for app
        let appStyles = [ 'material.css', 'app.css' ];
        for await (const style of appStyles) {
            csspath = `${appuiroot}/blueprint/${style}`;
            try {
                let res = await this.fetch(csspath);
                if (res.ok) styles.push(this.structCSS(await res.text(), csspath, `App Styles ${style}`));
            } catch (ignore) {}
        }
    }

    async addThemeStyles(theme, styles) {
        // style for general theme
        const csspath = `${this.themeRoot}/${theme}/${theme}.css`;
        if (_cssparts[csspath]) {
            styles.push(_cssparts[csspath]);
        } else {
            try {
                let res = await this.fetch(csspath);
                if (res.ok) {
                    let css            = this.structCSS(await res.text(), csspath, `Theme '${theme}'`);
                    _cssparts[csspath] = css;
                    styles.push(css);
                }
            } catch (ignore) { }
        }
    }

    async addSkeletonStyles(theme, styles) {
        // style for flex skeleton
        if (this.elemHasSkeleton) {
            const csspath = `${this.themeRoot}/${theme}/skeleton.css`;
            if (_cssparts[csspath]) {
                styles.push(_cssparts[csspath]);
            } else {
                try {
                    let res = await this.fetch(csspath);
                    if (res.ok) {
                        let css            = this.structCSS(await res.text(), csspath, 'Skeleton');
                        _cssparts[csspath] = css;
                        styles.push(css);
                    }
                } catch (ignore) { }
            }
        }
    }

    async addFlexStyles(theme, styles) {
        // style for flex rows
        if (this.elemHasFlex) {
            const csspath = `${this.themeRoot}/${theme}/flex.css`;
            if (_cssparts[csspath]) {
                styles.push(_cssparts[csspath]);
            } else {
                try {
                    let res = await this.fetch(csspath);
                    if (res.ok) {
                        let css            = this.structCSS(await res.text(), csspath, 'Flex');
                        _cssparts[csspath] = css;
                        styles.push(css);
                    }
                } catch (ignore) { }
            }
        }
    }

    async addAppStyles(theme, styles) {
        let uiroot    = this.uiRoot;
        // style for app
        if (!_appstyle[uiroot]) {
            const csspath = `${uiroot}/${theme}/app/app.css`;
            try {
                let res = await this.fetch(csspath);
                if (res.ok) {
                    _appstyle[uiroot] = this.structCSS(await res.text(), csspath, 'App Styles');
                    styles.push(_appstyle[uiroot]);
                }
            } catch (ignore) { }
        } else {
            styles.push(_appstyle[uiroot]);
        }
    }

    async addColors(theme, styles) {
        let uiroot    = this.uiRoot;
        // get color definition if any
        if (!_colors[uiroot]) {
            try {
                let csspath = `${uiroot}/${theme}/app/material.css`;
                let res = await this.fetch(csspath);
                if (res.ok) {
                    let xml         = await res.text();
//                    let colorDefs   = asColorDefinitions(xml);
//                    let colorCSS    = this.asColorCSS(colorDefs);
//                    _colors[uiroot] = colorCSS ? this.structCSS(colorCSS, csspath, 'Colors') : '/* no colors.xml */\n';
//                    styles.push(_colors[uiroot]);
                }
            } catch (ignore) { }
        } else {
//            styles.push(_colors[uiroot]);
        }
    }

    structCSS(css, origin, title) {
        const des = title ? `${title}: ` : '';
        return `
/**** START ${des}${origin}  ****/
${css}
/**** END ${des}                      ****/
`
    }

    /*
     * Structure
     */

    appendChild(element) {
        if (!element instanceof HTMLElement) throw ErrNoHTMLElement(element.constructor.name);
        this.container.appendChild(element);
    }

    nodeAppendChild(element) {
        return super.appendChild(element);
    }

    removeChild(element) {
        this.container.removeChild(element);
    }

    nodeRemoveChild(element) {
        return super.removeChild(element);
    }

    // todo [REFACTOR]: $$remove_candidate
    domRemoveChild(element) {
        super.removeChild(element);
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

        let defaults         = this.propertiesDefaultValues();
        let attributes       = this.transferredAttributes();
        let asBoolean        = this.propertiesAsBooleanRequested();

        for (let prop of Object.keys( defaults ) ) {
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
        let props = { loggedin: !!globalThis.me };
        if (universe.uirouter?.app) Object.assign(props, { interface: universe.uirouter.app.interfaceSettings });
        return props;
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

    /*
     * View models
     */

    /*
     * Aurora sub elements
     */

    get auroraname() {
        return this.getAttribute('aurora-name');
    }

    get isAuroraElement() {
        return true;
    }

    get level() {
        return this.getAttribute('level');
    }

    set level(level) {
        this.setAttribute('level', level);
    }

    clone() {
        let elem = document.createElement(this.elemId);
        this.getAttributeNames().forEach(attr => elem.setAttribute(attr, this.getAttribute(attr)));
        return elem;
    }

    get uirouter() {
        return universe.dorifer.uirouter;
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
            // if (universe.DEV) {
                proxy   = await ResourceProxy.on(AURORA_ROOT);
                // proxy avalable, replace
                import_ = async (url)      => await proxy.import(url);
                fetch_  = async (url, opt) => await proxy.fetch(url, opt);
            // }
            // import_ = async (url)      => await import(url);
            // fetch_  = async (url, opt) => await fetch(url, opt);
        }
        // return proxy;
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
    addInitFn    : {
        configurable: false,
        enumerable: false,
        get: function (fn) {     // standard elements invokes fn immediate
            fn?.();
        }
    },
    auroraname: {
        configurable: false,
        enumerable: false,
        get: function () {
            return this.getAttribute('aurora-name');
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
    parentViewModel: {  // todo [$$@AURORACLEANUP]: no viewmodel available
        configurable: false,
        enumerable: false,
        writable: true,
        value: function() {
            if (this.viewModel) return this.viewModel;
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
            return this.uibase?.getAuroraBlueprint() ?? this.parentElement?.getAuroraBlueprint();
        }
    },
    getMyBlueprintElement: {
        configurable: false,
        enumerable: false,
        writable: true,
        value: function() {
            if (this.uibase) return this.uibase.getMyBlueprintElement();
            if (this.parentElement) return this.parentElement.getMyBlueprintElement();
        }
    },
    viewContext: {
        configurable: false,
        enumerable: false,
        writable: true,
        value: function() {
            const ctx = this.getAttribute("view-context");
            if (ctx) return ctx;
            if (this.parentElement) return this.parentElement.viewContext();
            if (this.uibase) return this.uibase.viewContext();
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
    untilExist: {       // todo [$$@AURORACLEANUP]: get rid of it
        configurable: false,
        enumerable: false,
        writable: true,
        value: async function() {}
    },
    aurora_visible: {
        configurable: false,
        enumerable: false,
        get: function () {    // don't use () => {} because it binds this to undefined!
            !this.classList.contains('hidden');
        },
        set: function (state) {
            if (!state) {
                this.classList.add('hidden');
            } else {
                this.classList.remove('hidden');
            }
        }
    },
    aurora_enabled: {
        configurable: false,
        enumerable: false,
        get: function () {    // don't use () => {} because it binds this to undefined!
            !this.classList.contains('enabled');
        },
        set: function (state) {
            if (!state) {
                this.classList.add('enabled');
            } else {
                this.classList.remove('enabled');
            }
        }
    }
});

/*
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
*/


