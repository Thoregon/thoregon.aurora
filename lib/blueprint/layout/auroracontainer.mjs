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



    static get observedAttributes() {
        return [...super.observedAttributes, 'animated'];
    }


    attributeChangedCallback(name, oldValue, newValue) {

        switch (name) {
            case 'animated':
                let drawer = this.container.querySelector('.aurora-blueprint-container');
                drawer.classList.add("animate");
                break;
            default:
                return super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

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
            if ( this.blueprint.drawerRight != undefined ) {
                let width = this.blueprint.drawerRight.visibleWidth;

                if ( width != "" ) {
                    layoutstyle += " padding-right: " + width + 'px;';
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

