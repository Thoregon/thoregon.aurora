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

import View                   from "./view.mjs";
import AuroraElement          from "../../auroraelement.mjs";
import AuroraBlueprintElement from "./aurorablueprintelement.mjs";

import { doAsync, timeout }   from "/evolux.universe";

const _tpl      = {};
const _style    = {};
const _vmmodule = {};

const debuglog = (...args) => {}; // console.log(...args);

export default class AuroraView extends View(AuroraBlueprintElement) {


    initView() {
        super.initView();
        this.appelem = this.getAuroraAppElement();
    }

    async applyTemplates(container) {
        debuglog("$$> init Element:", this.tagName);
        let element = await this.buildViewElements();
        container = container || this.container;
        // todo [OPEN]: allow delayed visibility (intermediate skeleton display) if the view needs to be synced with model and viewmodel
        // show
        container.innerHTML = element;
        // import missing aurora elements
        await AuroraElement.dynamicElements(container);
        // find aurora attributes
        await this.initViewModel();
        this.connectAuroraAttributes(container);
        debuglog("::> rendered Element:", this.tagName);
    }

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-view';
    }

    static get observedAttributes() {
        return [...super.observedAttributes, 'view'];
    }

    setAttribute(name, val) {
        super.setAttribute(name, val);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name != 'view') return super.attributeChangedCallback(name, oldValue, newValue);

        switch (name) {
            case 'view':
                if (this.name !== newValue) {
                    if (newValue === 'undefined') newValue = undefined;
                    this.name = newValue;
                    this.refresh();
                }
                break;
        }
    }

    /*
     * view definition
     */

    get view() {
        return this.getAttribute("view");
    }

    set view(v) {
        this.setAttribute("view", v);
    }

    get viewModel() {
        return this._vm;
    }

    set viewModel(vm) {
        this._vm = vm;
    }

    async useParentViewModel() {
        return !!this.getAttribute("set-parent-viewmodel") /*|| (await this.getViewModelClass()) == undefined*/;
    }

    async getModelProperty() {
        const submodel = this.parentViewModel()?.getValueModelPath(this.modelProperty);
        return submodel;
    }

    async getViewModelProperty() {
        const submodel = this.parentViewModel()?.getValueViewModelPath(this.viewModelProperty);
        return submodel;
    }

    /*
     * Structure
    */

/*
    async connect() {
    }
*/

    async existsConnect() {
        // connect view to viewmodel
        if (this.viewmodel) this.viewmodel.view = this.container.uibase ? this.container.uibase : this.container;
    }

    propertiesDefinitions() {
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            gridelement: {
                default:        false,
                type:           'boolean',
                description:    'if set it will set properties to work as grid element in a lit',
                group:          'Behavior',
                example:        'true | false'
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

    propertiesAsBooleanRequested() { return {} }

    /*
     * instead of the element behavior, the behavior of the view definition is used
     */
    async attachBehavior() {}

    getDefaultWidth() { return "100%"; }

    async adjustContent(container) {
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
            // this.appelem = this.getAuroraAppElement();
            if (this.appelem) this._approot = this.appelem.getAppViewRoot();
        }
        return this._approot;
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
            } catch (ignore) { }
            return _tpl[id];
        });
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
/*
    get appliedTemplateName() {
        return 'view';
    }
*/
    async adjustContent(container) {
        let propertiesValues = this.propertiesValues();
        if ( propertiesValues['gridelement'] ) {
            container.classList.add("aurora-grid-element-view");
        }
    }


    connectedCallback() {
        this.initView();
        super.connectedCallback();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }

}

AuroraView.defineElement();
