/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import AuroraBlueprintElement from "./aurorablueprintelement.mjs";

export default class AuroraContainer extends AuroraBlueprintElement {

    constructor() {
        super();
        if (this.app) this.app.registerBlueprintContainer(this);
    }

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-container';
    }

    /*
     * Structure
    */

    async renderForMount() {
        this.getAuroraBlueprint().uicontainer = this;
    }

    /**
     * template definition
     * @return {{component: string, templates: [string], theme: string}}
     */
    get componentConfiguration() {
        return {
            theme    : 'material',
            component: 'blueprint-container',
            templates: ['container'],
        }
    }

    get appliedTemplateName() {
        return 'container';
    }

    viewContent(content) {
        let target = this.target;
        target.innerHTML = content;
        return target;
    }

    adjustToBlueprint(){
        let style     = this.getContainerAdjustmentAsCSSStyle();
        let container = this.container.querySelector('.aurora-blueprint-container ');
        container.setAttribute('style', style);
    }

    getContainerAdjustmentAsCSSStyle() {
        let blueprint        = this.getAuroraBlueprint();
        if ( blueprint != undefined ) {
            let layoutstyle = '';

            if ( this.blueprint.header != undefined ) {
                let height = this.blueprint.header.offsetHeight;
                if ( height != "" ) {
                    layoutstyle += " padding-top: " + height + 'px;';
                }
            }
            if ( this.blueprint.footer != undefined ) {
                let height = this.blueprint.footer.offsetHeight;
                if ( height != "" ) {
                    layoutstyle += " padding-bottom: " + height + 'px;';
                }
            }
            if ( this.blueprint.drawerLeft != undefined ) {
                let width = this.blueprint.drawerLeft.visibleWidth;

                if ( width != "" ) {
                    layoutstyle += " padding-left: " + width + 'px;';
                }
            }

            return layoutstyle;
        }

        return "";
    }
/*
    viewContentElement(element) {
        let target = this.target;
        target.innerHTML = '';
        target.appendChild(element);
        return target;
    }

    getDefaultWidth() { return '100%'; }

    get containerContent() {
        let target = this.container; // this.target;
        return target ? target.innerHTML : '';
    }

    set containerContent(content) {
        let target = this.container; // this.target;
        if (target) target.innerHTML = content;
    }

    get target() {
        // if (this._target) return this._target;
        this._target = this.container.querySelector('*[aurora-slot="main"]') || this.container;
        return this._target;
    }
/*
    /*
        propertiesDefinitions() {
            let parentPropertiesValues = super.propertiesDefinitions();
            return Object.assign(parentPropertiesValues, {
                title: {
                    default:        '',
                    type:           'string',
                    description:    'the title of the toolbar',
                    group:          'Content',
                    example:        'MyFirstApp'
                }
            });
        }
    */

}

AuroraContainer.defineElement();

