/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import AuroraElement from "../../auroraelement.mjs";
import doT           from "../../formating/doT.mjs";
import { Q }         from "/evolux.util";

const debuglog = (...args) => {}; // {};   // console.log(...args);

const _tpl      = {};
const _style    = {};

const useAsVariable = (name) => name != 'view' && !(name.startsWith('aurora-') || name.startsWith('a-') || name.startsWith(":") || name.startsWith('@'));

export default class AuroraInclude extends AuroraElement {


    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-include';
    }

    static get observedAttributes() {
        return [...super.observedAttributes, 'view'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name !== 'view') return super.attributeChangedCallback(name, oldValue, newValue);

        if (newValue === oldValue) return;

        // the attribute changed callback is invoked before the element can be initialized
        // copy the 'var's before they will be overwritten
        if (!this.vargs) {
            const vargs = this.vargs = {};
            const args = [...this.querySelectorAll('var')];
            args.forEach((arg) => vargs[arg.getAttribute('name')] = arg.innerHTML);
        }
        // insert the view (process template)
        this.doApplyTemplates();
    }

    get name() {
        return this.view;
    }

    async buildViewElements() {
        // this.initView();
        // if (!await this.initViewModel()) return;
        // build view from template
        if (!this.vargs) this.vargs = {};

        let tplstr  = await this.getTemplate();
        if (!tplstr) return '<span></span>';
        let tempFn  = doT.template(tplstr, undefined, {});
        let properties = { interface: { ...this.app.thoregonApp.interfaceSettings}, ...this.attributeVars(), ...this.vargs }
        let element = tempFn(properties);
        // style
        let style   = await this.getStyle();
        if (style) element = '<style>\n' + style + '\n</style>\n' + element;
        return element;
    }

    attributeVars() {
        const args = {};
        (this.getAttributeNames()).forEach((name) => {
            if (useAsVariable(name)) args[name] = this.getAttribute(name);
        });
        return args;
    }

    async applyTemplates() {
    }

    async doApplyTemplates() {
        debuglog("$$> include elements");
        this.innerHTML = '';
        if (!this.hasView) return;
        const element = await this.buildViewElements();
        const container = this; // document.createElement('div');
        container.classList.add('aurora-include');
        container.innerHTML = element;
        // copy all attributes except 'view'
        // [...this.getAttributeNames()].forEach((name) => {
        //     if (name === 'view') return;
        //     if (name === 'aurora-bind:view' || name === 'a-bind:view' || name === '@view')
        //     const val = this.getAttribute(name);
        //     container.setAttribute(name, val);
        // });
        // import missing aurora elements
        await AuroraElement.dynamicElements(container);

        // const parent = this.parentElement;
        // const before = this.nextSibling;
        // parent.insertBefore(container, before);
        // find aurora attributes
        debuglog("::> rendered elements");
    }

    async elementStyle(templatename) {
        return '';
    }

    async prepare() {
        this._container = this;
    }

    appendChild(element) {
        console.log("aurora-include appendChild", element);
        return super.nodeAppendChild(element);
    }

    removeChild(element) {
        return super.nodeRemoveChild(element);
    }

    async attachBehavior() {
        // no theme behavior to attach
    }

    /*
     * view definition
     */


    get approot() {
        if (!this._approot) {
            this.appelem = this.getAuroraAppElement();
            if (this.appelem) this._approot = this.appelem.getAppViewRoot();
        }
        return this._approot;
    }

    get view() {
        return this.getAttribute("view");
    }

    set view(v) {
        this.setAttribute("view", v);
    }

    get hasView() {
        return !!this.getAttribute('view');
    }

    get vpath() {
        return `${this.approot}/views/${this.name}`;
    }

    get viewpath() {
        return this.view;
    }

    get filename() {
        const parts = this.name.split('/');
        return parts.pop();
    }

    async getTemplate() {
        if (!this.name) return;
        let id = this.viewpath;
        if (_tpl[id]) return _tpl[id];
        return await Q(`${id}/template`, async () => {
            let resourcepath = `${this.vpath}/${this.filename}.jst`;
            try {
                let res = await this.fetch(resourcepath);
                if (res.ok) _tpl[id] = await res.text();
            } catch (ignore) {
                console.log(ignore);
            }
            return _tpl[id];
        });
    }

    async getStyle() {
        if (!this.name) return;
        let id = this.viewpath;
        if (_style[id]) {
            this._cssStyle = _style[id];
            return _style[id];
        }
        return await Q(`${this.viewpath}/style`, async () => {
            let styles    = [];
            let theme = this.templateElements.theme;
            let resourcepath;

            // this is
            // await this.addAllCommonStyles(theme, styles);
            // await this.addAppThemeStyles(theme, styles);
            // await this.addAllComponentStyles({ component: 'blueprint-view', theme, templates: {} }, theme, 'blueprint-view', styles, 'materialview');

            //
            // styles for the view
            //

            resourcepath = `${this.vpath}/${this.filename}.css`;
            try {
                let res = await this.fetch(resourcepath);
                if (res.ok) {
                    const css = this.structCSS(await res.text(), resourcepath, `View '${this.filename}'`);
                    styles.push(css);
                    this._cssStyle = css;
                }
            } catch (ignore) { }
            /*
                        resourcepath = `${this.vpath}/${this.filename}.css`;
                        try {
                            let res = await this.fetch(resourcepath);
                            if (res.ok) styles.push(this.structCSS(await res.text(), resourcepath, `View Kind '${this.filename}'`));
                        } catch (ignore) { }
            */
            _style[id] = styles.join('\n');
            return _style[id];
        });
    }

    get cssStyle() {
        return this._cssStyle ?? '';
    }

    async fetch(path, opt) {
        try {
            return await this.appelem.appStructure.fetch(path, opt);
        } catch (e) {
            if (!e.message.startsWith("40")) throw e;
            return await super.fetch(path, opt);
        }
    }

    get themeRoot() {
        return this.constructor.uiThemeRoot;
    }

    async elementStyle(templatename) {
        return await this.getStyle();
    }

    get appUiRoot() {
        return universe.uirouter?.appelement?.uiRoot;
    }

    get templateElements() {
        return {
            theme: 'material'
        }
    }

}

AuroraInclude.defineElement();

