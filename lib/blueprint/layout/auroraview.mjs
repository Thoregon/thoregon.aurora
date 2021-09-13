/**
 * a view with
 *
 * todo [OPEN]:
 *  - introduce view selector to select the view for the entity which will be displayed
 *  - add viewtags/types ... to increase the accuracy of selection
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import { forEach, Q }         from "/evolux.util";
import doT                    from "../../formating/doT.mjs";

import View                   from "./view.mjs";
import AuroraElement          from "../../auroraelement.mjs";
import AuroraBlueprintElement from "./aurorablueprintelement.mjs";

// import { doAsync, timeout }   from "/evolux.universe";

const _tpl      = {};
const _style    = {};
const _vmmodule = {};

export default class AuroraView extends View(AuroraBlueprintElement) {

    initView() {
        super.initView();
    }

    async applyTemplates(container) {
        let element = await this.buildViewElements();
        container = container || this.container;
        // show
        container.innerHTML = element;
        // import missing aurora elements
        await AuroraElement.dynamicElements(container);
    }

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-view';
    }

    setAttribute(name, val) {
        super.setAttribute(name, val);
    }

    /*
     * view definition
     */

    get ref() {
        return this.getAttribute("ref");
    }

    set ref(r) {
        this.setAttribute("ref", r);
    }

    get property() {
        return this.getAttribute("property");
    }

    set property(p) {
        this.setAttribute("property", p);
    }

    get view() {
        return this.getAttribute("view");
    }

    set view(v) {
        this.setAttribute("view", v);
    }

    /*
     * Structure
    */

    async connect() {
    }

    async existsConnect() {
        // connect view to viewmodel -> REFACTOR: do when all child elements are rendered
        console.log()
        if (this.viewmodel) this.viewmodel.view = this.container.uibase ? this.container.uibase : this.container;
    }

    propertiesDefinitions() {
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            ref: {
                default:        '',
                type:           'string',
                description:    'Reference to an entity. Either \'ref\' or \'property\' can be used.',
                group:          'Structure',
                example:        ''
            },
            property: {
                default:        '',
                type:           'string',
                description:    "Property of an entity. Either 'ref' or 'property' can be used.",
                group:          'Structure',
                example:        ''
            },
            view: {
                default:        '',
                type:           'string',
                description:    'Reference to a view definition',
                group:          'View',
                example:        ''
            },
        });
    }

    propertiesAsBooleanRequested() {
        return {};
    }

    /*
     * style will be defined by the view definition, not by the element
     */
    elementStyle() {
        return '';
    }

    /*
     * instead of the element behavior, the behavior of the view definition is used
     */
    async attachBehavior() {}

    getDefaultWidth() { return "100%"; }

    async adjustContent(container) {
    }

    dispose() {
        // invoked on top level element of view from UI router when router changes view
        // implement by subclass
        // [...this.container.children].forEach(elem => elem.disposeView());
    }

    destroy() {
        // invoked when element is disconnected from the DOM e.g. view closes
        // implement by subclass
    }

    async modelMutated(mutation) {
        return true;
    }

    get approot() {
        if (!this._approot) {
            this.appelem = this.getAuroraAppElement();
            if (this.appelem) this._approot = this.appelem.getAppViewRoot();
        }
        return this._approot;
    }

    get vpath() {
        return `${this.approot}/views/${this.name}`;
    }

    get kindname() {
        return `${this.name}${this.kind}`;
    }

    get viewpath() {
        return this.view;
    }

    async getTemplate() {
        let id = this.viewpath;
        if (_tpl[id]) return _tpl[id];
        return await Q(`${id}/template`, async () => {
            let resourcepath = `${this.vpath}/${this.kindname}.jst`;
            try {
                let res = await fetch(resourcepath);
                if (res.ok) _tpl[id] = await res.text();
            } catch (ignore) { }
            return _tpl[id];
        });
    }

    get themeRoot() {
        return this.constructor.uiThemeRoot;
    }

    async elementStyle(templatename) {
        return await this.getStyle();
    }

    async getStyle() {
        let id = this.viewpath;
        if (_style[id]) return _style[id];
        return await Q(`${this.viewpath}/style`, async () => {
            let styles    = [];
            let theme = this.templateElements.theme;

            // style for flex rows
            let csspath   = `${this.themeRoot}/${theme}/flex.css`;
            try {
                let res = await fetch(csspath);
                if (res.ok) {
                    let css = await res.text();
                    styles.push(css);
                }
            } catch (ignore) { }

            // style for flex skeleton
            csspath   = `${this.themeRoot}/${theme}/skeleton.css`;
            try {
                let res = await fetch(csspath);
                if (res.ok) {
                    let css = await res.text();
                    styles.push(css);
                }
            } catch (ignore) { }

            //
            // basic theme styles from aurora and app
            //

            let resourcepath = `${this.themeRoot}/${theme}/${theme}.css`;
            try {
                let res = await fetch(resourcepath);
                if (res.ok) styles.push(await res.text());
            } catch (ignore) { }
            let approot = this.appUiRoot;
            if (approot) {
                resourcepath = `${approot}/${theme}/${theme}.css`;
                try {
                    let res = await fetch(resourcepath);
                    if (res.ok) styles.push(await res.text());
                } catch (ignore) { }
            }

            //
            // styles for the view
            //

            resourcepath = `${this.vpath}/${this.name}.css`;
            try {
                let res = await fetch(resourcepath);
                if (res.ok) styles.push(await res.text());
            } catch (ignore) { }
            resourcepath = `${this.vpath}/${this.kindname}.css`;
            try {
                let res = await fetch(resourcepath);
                if (res.ok) styles.push(await res.text());
            } catch (ignore) { }
            _style[id] = `/* view: ${this.viewpath} */\n${styles.join('\n')}`;
            return _style[id];
        });
    }

    async getViewModelClass() {
        let id = this.viewpath;
        if (_vmmodule[id]) return _vmmodule[id].default;
        return await Q(`${this.viewpath}/viewmodel`, async () => {
            let resourcepath = `${this.vpath}/${this.kindname}.mjs`;
            let viewmodelmodule;
            try {
                viewmodelmodule = await import(resourcepath);
            } catch (e) {
                console.log(`Can't load behavior '${resourcepath}': ${e.stack ? e.stack : e.message }`);
                // behavior not found, always return empty, don't try to load again
                viewmodelmodule = { default: undefined };
            }
            _vmmodule[id] = viewmodelmodule;
            return _vmmodule[id].default;
        });
    }

    get appUiRoot() {
        return universe.uirouter?.appelement?.uiRoot;
    }

    get templateElements() {
        return {
            theme: 'material'
        }
    }
/*
    get appliedTemplateName() {
        return 'view';
    }
*/

    connectedCallback() {
        this.initView();
        super.connectedCallback();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }

}

AuroraView.defineElement();
