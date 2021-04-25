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
import AuroraBlueprintElement from "./aurorablueprintelement.mjs";

// import { doAsync, timeout }   from "/evolux.universe";

const _tpl      = {};
const _style    = {};
const _vmmodule = {};

export default class AuroraView extends View(AuroraBlueprintElement) {

    initView() {
        if (!this.approot) {
            this.appelem = this.getAuroraAppElement();
            if (this.appelem) this.approot = this.appelem.getAppViewRoot();
        }
        super.initView();
    }

    async applyTemplates(container) {
        let element = await this.buildViewElements();
        // show
        (container || this.container).innerHTML = element;
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
        super.connectedCallback();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }

}

AuroraView.defineElement();
