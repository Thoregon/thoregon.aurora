/**
 * a view with
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import { Q }                  from "/evolux.util";
import doT                    from "/dot";
import AuroraBlueprintElement from "./aurorablueprintelement.mjs";

import { doAsync, timeout }   from "/evolux.universe";

const _tpl      = {};
const _style    = {};
const _vmmodule = {};

export default class AuroraView extends AuroraBlueprintElement {

    initView() {
        if (!this.approot) this.approot = this.getAuroraAppElement().getAppViewRoot();
        let view = this.view;
        if (!view) return;
        let parts = view.split('/').filter(part => !!part);
        if (parts.length > 0) this.name = parts[0];
        if (parts.length > 1) this.kind = parts[1]; else this.kind = '';
    }

    async initViewModel() {
        // get viewmodel with referenced entity
        let vmc = await this.getViewModelClass();
        if (vmc) {
            if (this.ref) {
                this.viewmodel = await vmc.with({ modelRef: this.ref });
                this.viewmodel.intercept2East(async (mutation) => await this.modelMutated(mutation));   // refresh view if properties has changed
            } else {
                this.viewmodel = await vmc.with({ model: this.getParentModel() });
                this.viewmodel.intercept2East(async (mutation) => await this.modelMutated(mutation));   // refresh view if properties has changed
            }
        }
    }

    getParentModel() {
        let parent = this.uibase || this.parentElement;
        let model;
        while (parent && !model) {
            model = parent.viewmodel?.model;
            parent = parent.uibase || parent.parentElement;
        }
        return model;
    }

    getModelProperties() {
        return this.viewmodel?.getWestProperties() || {};
    }

    async applyTemplates(container) {
        this.initView();
        await this.initViewModel();
        // build view from template
        let tplstr  = await this.getTemplate();
        let tempFn  = doT.template(tplstr, undefined, {});
        let element = tempFn(this.getModelProperties());
        // style
        let style   = await this.getStyle();
        if (style) element = '<style>\n' + style + '\n</style>\n' + element;
        // show
        this.container.innerHTML = element;
    }

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-view';
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

    /*
        get templateElements() {
            return {
                theme: 'material',
                component: 'blueprint-view',
                templates: ['view'],
            }
        }
    */

    propertiesDefinitions() {
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            ref: {
                default:        '',
                type:           'string',
                description:    'Reference to an entity',
                group:          'Behavior',
                example:        ''
            },
            view: {
                default:        '',
                type:           'string',
                description:    'Reference to a view definition',
                group:          'Behavior',
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

    async getStyle() {
        let id = this.viewpath;
        if (_style[id]) return _style[id];
        return await Q(`${this.viewpath}/style`, async () => {
            let styles    = [];
            let resourcepath = `${this.vpath}/${this.name}.css`;
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

/*
    get appliedTemplateName() {
        return 'view';
    }
*/

    connectedCallback() {
        super.connectedCallback();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }

}

AuroraView.defineElement();
