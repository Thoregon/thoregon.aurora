/**
 *
 *
 * @author: blukassen
 */

import { Reporter }           from "/evolux.supervise";
import { forEach, className } from "/evolux.util";
import UIElementBuilder       from "./builder/elementbuilder.mjs";
import { ErrNotImplemented }  from "./errors.mjs";

//
//
//

const builder   = new UIElementBuilder();

const commoncss =
          `       :host {
            display:    block;
            box-sizing: border-box;
            margin:     0;
            padding:    1px;
        /*  border:     1px dotted red; */
            overflow:   auto;
        }
        * {
            box-sizing: border-box;
            padding:    0;
            margin:     0;
        }
`;

export default class UIElement extends Reporter(HTMLElement) {

    constructor() {
        super();
        this._connected = false;
        this._connectQ  = [];
    }

    /**
     * with this tag, the element is available in the html document
     * override by subclass. mandatory!
     */
    static get elementTag() {
        throw ErrNotImplemented(`${className(this)}.elementTag()`);
    }

    /**
     * register this element class in the browser
     * @param {String}  tag - if not supplied the 'elementTag' of the class is used
     */
    static defineElement(tag) {
        tag = tag || this.elementTag;
        if (window.customElements) {
            if (customElements.get(tag)) {
                // debugger;
            } else {
                customElements.define(tag, this);
            }
        } else {
            universe.logger.warn(`customElements not available, can't register '${tag}'`);
        }
    }
    /**
     * init the element
     */
    async prepare() {
        // this._connected = false;
        // this._iinit++;
        // if (this._iinit > 0) console.log(`${this.elemId} was initialized: ${this._iinit}`);
        // Create a shadow root
        let shadow      = this.shadowRoot || this.attachShadow({ mode: 'open' });

        // get the base style and element defintion; implement by subclasses
        let style       = await this.elementStyle();
        let elem        = this.buildElement();
        this._container = elem;
        elem.uibase     = this;

        // now fill the elments style and content
        this.applyCommonStyle(shadow);
        if (style) {
            shadow.appendChild(this.createStyleElement(style));
        }
        shadow.appendChild(elem);
    }

    get container() {
        return this._container;
    }

    /*
        async refreshContainer(fn) {
            let old = this._container;
            try {
                this._container = this.buildElement();
                await fn();
                old.remove();
                this.shadowRoot.appendChild(this._container);
            } catch (e) {
                console.log("Error during container refresh:", e.stack ? e.stack : e.message);
            }
        }
    */

    get builder() {
        return builder;
    }

    // **** behavior

    show() {
        this.style.visibility = 'visible';
        return this;
    }

    hide() {
        this.style.visibility = 'hidden';
        return this;
    }

    /***************************************************************************/
    /* Element creation                                                        */
    /***************************************************************************/

    /**
     * Implement by subclass
     * @return {String} a css style as string
     */
    elementStyle() {
        throw ErrNotImplemented(`${className(this)}.baseStyle()`);
    }

    /**
     * use a div as default element
     * override by subclass
     * @return {HTMLelement} HTML element made with document.createElement(...)
     */
    buildElement() {
        return this.builder.newDiv();
    }

    /*
     * style processing
     */

    // **** handle common style
    // check if a constructed stylesheet can be used or if the style need to be repeated
    applyCommonStyle(shadow) {
        if (shadow.adoptedStyleSheets) {
            this._applyConstructed(shadow);
        } else {
            this._applyRepeated(shadow);
        }
    }

    _applyConstructed(shadow) {
        let css = this._css;
        if (!css) {
            css = new CSSStyleSheet();
            css.replaceSync(commoncss);
            this._css = css;
        }
        shadow.adoptedStyleSheets = [css];
    }

    _applyRepeated(shadow) {
        shadow.appendChild(this.createStyleElement(commoncss));
    }

    /*
     * element creation
     */

    createElement(tag, options) {
        return document.createElement(tag, options);
    }

    createStyleElement(style) {
        let css = document.createElement('style');
        css.textContent = style;
        return css;
    }

    setAttributes(attrs) {
        if (!attrs) return;
        Object.entries(attrs).forEach(([name, value]) => this.setAttribute(name, value) );
    }

    /*
     * content nodes handling
     */

    applyChildElements(container) {
        if (!this.applyChildNodes) return;
        let elem = container.querySelector('*[aurora-slot="main"]') /*?? container*/;   // don't move child elements when to container does not define a 'slot'
        if (elem) this.doApplyChildNodes(elem);
    }

    /**
     * should child nodes from the document be utilized
     * override by subclass
     *
     * @return {boolean}
     */
    get applyChildNodes() {
        return true;
    }

    /**
     * filter out some child nodes which should not be transferred
     * override by subclass
     *
     * @param childnode
     * @return {boolean}
     */
    applyChildNode(childnode) {
        return childnode.tagName !== 'VAR';
    }

    doApplyChildNodes(container) {
        // wrap text nodes with 'span'
        [...this.children].forEach(child => this.doApplyChildNode(child, container))
    }

    doApplyChildNode(child, container) {
        if (this.applyChildNode(child)) {
            const item = this.alterChild(child);
            if (item) container.appendChild(child);
        } else {
            container.removeChild(child);
        }
    }

    alterChild(child) {
        return child;
    }

    clear() {
        let container = this.container;
        while (container.childNodes.length) {
            container.removeChild(container.firstChild);
        }
    }

    /**
     * initially config this element
     * @return {Promise<void>}
     */
    async config() {
    }

    /**
     * Implement by subclass
     * Fill the container with content for this UI Element
     * @param {HTMLElement} container - the base element for this UI element
     */
    async applyContent(container) {
        // implement by subclass
    }

    /**
     * element is now initialized, process all fns waiting for init
     * @return {Promise<void>}
     */
    async processInitQ() {
        // implement by subclass
    }

    /**
     * called after applyContent
     * now all event handlers can be updated
     */
    async refinish() {
        // implement by subclass
    }

    parentAddListenert() {
        // implement by subclass
    }

    /**
     * called after the element is fully initialized
     * use to connect inner structure
     */
    async connect() {
        // implement by subclasses
    }

    /**
     * called after all elements inside are fully initialized
     * use to connect inner structure
     */

    // todo [REFACTOR] $$@ALLCHILDREN
    async childrenAvailiable(){}

    async existsConnect() {
        // implement by subclasses
    }

    enqueueConnect(fn) {
        this._connectQ.push(fn);
    }

    async execConnectQ() {
        await forEach(this._connectQ, async (fn) => await fn(this));
    }

    /*
     * Event support
     */

    /**
     * emit an event on all possible listener channels.
     *  - exec event handlers attached with 'addEventListener'. event.detail contains the parameter you passed
     *      e.g. element.addEventListener('event', (evt) => console.log(evt.detail));
     *  - exec event handler attached with 'elem.on<eventname> = fn', no param but 'this' is the element. Make the result or the reason available
     *      e.g. element.onevent = () => { console.log(this.eventresult); }
     *  - if no 'elem.on<eventname>' handler get on<event> attribute from the element and exec it, 'this' is the element
     *      &lt;element onevent="console.log(this.eventresult);"&gt;
     *
     * @param {String}  evtname - name of the event. Don't use spacial chars, because the name will be used also for the 'on<eventname>' register
     * @param {Any}     detail  - an arbitrary object as event parameter.
     */
    emit(evtname, detail) {
        let evt = detail ? new CustomEvent(evtname, { detail }) : new Event(evtname);
        this.emitEvent(evtname, evt);
    }

    /**
     * emit an event on all possible listener channels.
     *
     * @param {String}  evtname - name of the event. Don't use spacial chars, because the name will be used also for the 'on<eventname>' register
     * @param {Event}   evt     - event object
     */
    emitEvent(evtname, evt) {
        try {
            this.dispatchEvent(evt);       // all attached with 'addEventListener'
            let evton = `on${evtname}`;
            let onhandler = this[evton];
            if (onhandler) {
                onhandler.apply(this);    // sorry no param, but 'this' is the current element. same as with the attribute 'on' handler
            } else {
                // the programmed handler overrides the handler from the attribute
                let onattr = this.getAttribute(evton);
                // don't use 'eval'. the context can't be set to the element!
                // evaluates the content from the attribute in the context of this element, no param
                if (onattr) new Function(onattr).call(this);
            }
        } catch (e) {
            this.logger.error("can't emit event", e);
        }
    }

    /**
     * name of the defining element library
     * override by subclasses
     * @return {string}
     */
    static get libraryId() {
        return 'evoluxui';
    }

    eventName(event) {
        return `${this.constructor.libraryId}-element-${event}`
    }

    eventElementName(event) {
        return `${this.constructor.elementTag}-${event}`
    }

    // todo [REFACTOR] $$@ALLCHILDREN
    /*async*/ untilExist() {
        return new Promise(((resolve, reject) => {
            if (this._elementExists) {
                resolve()
            } else {
                this.addEventListener('exists', resolve);
            }
        }));
    }

    destroy() {
        // invoked when element is disconnected from the DOM e.g. view closes
        // implement by subclass
    }

    /**
     * support element added event:
     *   <library>-<element>-added  ... event detail contains the element
     *   <library>-element-added    ... event detail contains { event: 'added', tag: '<elements tag name>', element: <this element>}
     *
     * called when the element is attached to the DOM
     *
     * todo [REFACTOR]:
     *  - replace all hook methods with event handlers at state transitions
     *  - define all state transitions also for mutations in the 'container' (see MutationObserver)
     *
     */
    async connectedCallback() {
        if (this._connected) return; // console.log(`${this.elemId} was connected`);

        //--------
        this.emit('mount',{ element: this });
        // this._state.mount();
        //--------

        this._connected = true;
        await this.config();   // maybe moved to constructor

        // this.renderForMount();
        await this.prepare();

        //--------
        await this.renderForMount();
        // this._state.mounted();
        //--- TODO: this.mounted() { this._state.mounted() + emit

        this.emit('mounted',{ element: this });
        // this._state.ready();
        this.emit('ready',{ element: this });
        //--------

        //--- applyTemplate()
        await this.applyContent(this.container);
        await this.processInitQ();

        await this.refinish();

        await this.connect();

        // todo [REFACTOR] $$@ALLCHILDREN
        this._elementExists = true;
        await this.emit('exists', { element: this });

        // hook after all elements exists
        await this.childrenAvailiable();
        await this.existsConnect();
        await this.execConnectQ();
        this.parentAddListenert();

        const eventtype = 'added';
        let evt;
        evt = new CustomEvent(this.eventName(eventtype), { detail: { event: eventtype, tag: this.constructor.elementTag, element: this} });
        document.dispatchEvent(evt);
        evt = new CustomEvent(this.eventElementName(eventtype), { detail: this});
        document.dispatchEvent(evt);
    }

    async renderForMount() {

    }

    /**
     * support aurora-element-removed events on document.
     * called when the element is disconnected from the DOM
     */
    disconnectedCallback() {
        try { this.destroy();} catch (e) { console.log("UI Error on destroy", e) }
        const eventtype = 'removed';
        let evt;
        evt = new CustomEvent(this.eventName(eventtype), { detail: { event: eventtype, tag: this.constructor.elementTag, element: this} });
        document.dispatchEvent(evt);
        evt = new CustomEvent(this.eventElementName(eventtype), { detail: this});
        document.dispatchEvent(evt);
    }

    /**
     * Invoked when the custom element is moved to a new document.
     */
    adoptedCallback() {
    }

    /**
     * subclass override don't forget to get observedAttributes() from super
     *  return [...super.observedAttributes, 'my-attr'];
     * @return {string[]}
     */
    static get observedAttributes() {
        return ['width', 'height'];
    }

    /**
     * Invoked when one of the custom element's attributes is added, removed, or changed.
     */
    attributeChangedCallback(name, oldValue, newValue) {
        // implement by subclass
    }
}
