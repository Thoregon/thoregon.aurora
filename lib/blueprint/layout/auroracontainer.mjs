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

    getMyBlueprintElement() {
        return this;
    }

    //
    //
    //

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

    propertiesDefinitions() {
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            dense: {
                default:        false,
                type:           'boolean',
                description:    'will remove the left and right padding of the drawer',
                group:          'Behavior',
                example:        'true'
            },
        });
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
        this.addInitFn(() => {
            let style     = this.getContainerAdjustmentAsCSSStyle();
            let container = this.container.querySelector('.aurora-blueprint-container ');
            container.setAttribute('style', style);
            this.resizeBlueprint();
        });
    }

    resizeBlueprint() {
        let style     = this.getContainerResizeAsCSSStyle();
        let main = this.container.querySelector('.aurora-blueprint-container-main');
        main.setAttribute('style', style);
    }

    getContainerResizeAsCSSStyle() {
        let layoutstyle = '';
        let blueprintheight = this.blueprint.height;
        let headerheight = 0;
        let footerheight = 0;

        const maincontainer = this.container.querySelector('.aurora-blueprint-container-main');

        const computedStyle = window.getComputedStyle(maincontainer);
        const marginTop     = parseInt(computedStyle.marginTop, 10);
        const marginBottom  = parseInt(computedStyle.marginBottom, 10);

        if ( this.blueprint.header != undefined ) {
            headerheight = this.blueprint.header.offsetHeight;
            headerheight =  ( headerheight != "" )
                            ? headerheight
                            : 0;
        }

        if ( this.blueprint.footer != undefined ) {
            footerheight = this.blueprint.footer.offsetHeight;
            footerheight =  ( footerheight != "" )
                ? footerheight
                : 0;
        }

        layoutstyle += ' min-height: '+ ( blueprintheight - headerheight - footerheight - marginTop - marginBottom ) +'px;';
        return layoutstyle;
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

                if ( width != "" &&
                    ! this.blueprint.drawerLeft.isOverlaid()) {
                    layoutstyle += " padding-left: " + width + 'px;';
                }
            }
            if ( this.blueprint.drawerRight != undefined ) {
                let width = this.blueprint.drawerRight.visibleWidth;

                if ( width != ""  &&
                     ! this.blueprint.drawerRight.isOverlaid()  ) {
                    layoutstyle += " padding-right: " + width + 'px;';
                }
            }
            return layoutstyle;
        }

        return "";
    }

    /****************************************************/

    applyChildElements(container) {
        return super.applyChildElements(container);
    }

    async applyTemplates(container) {
        return await super.applyTemplates(container);
    }

    /*
    viewContentElement(element) {
        let target = this.target;
        target.innerHTML = '';
        target.appendChild(element);
        return target;
    }

    getDefaultWidth() { return '100%'; }

     */

}

AuroraContainer.defineElement();

