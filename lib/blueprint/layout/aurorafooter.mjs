/*
 * Copyright (c) 2021.
 */

import AuroraBlueprintElement from "./aurorablueprintelement.mjs";

export default class AuroraFooter extends AuroraBlueprintElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-footer';
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
                let footer = this.container.querySelector('.aurora-footer');
                footer.classList.add("animate");
                break;
            default:
                return super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    async renderForMount() {
        this.getAuroraBlueprint().footer = this;
    }

    /*
     * aurora element features
     */


    /*
     * Exposed Events
     */

    /*
        exposedEvents() {
            return Object.assign(super.exposedEvents(), {
                click: {
                    select  : 'button'
                }
            });
        }
    */

    // theme ... component... templates

    get componentConfiguration() {
        return {
            theme: 'material',
            component: 'blueprint-footer',
            templates: ['footer'],
        }
    }

    propertiesDefinitions() {
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            position: {
                default:        'fixed-bottom',
                type:           'string',
                description:    'How should the header be positioned. ',
                group:          'Behavior',
                example:        'fixed-bottom | absolute-bottom'
            },
        });
    }

    propertiesAsBooleanRequested() {
        return {};
    }

    getDefaultWidth() { return false; }

    /**
     *  routine to add all needed classes.
     *  This only can be done on the element level as it will be differ from element to element
     */
    collectClasses() {
        let classes = [];
        let propertiesValues = this.propertiesValues();
        let blueprint        = this.getAuroraBlueprint();

        if ( blueprint != undefined ) {
            if (blueprint.isFooterFixed()) {
                classes.push('fixed-bottom');
            } else {
                classes.push('absolute-bottom');
            }
        } else {
            if ( propertiesValues['position'] )  { classes.push( propertiesValues['position'] ); }
        }


        return classes;
    }

    adjustToBlueprint( definition ) {
        let blueprint = this.blueprint;
        let style = [];

        if ( definition.isFooterLeftIndented() &&
            blueprint.drawerLeft ) {
            let width = blueprint.drawerLeft.visibleWidth;
            style.push( 'left: '+ width +'px;' );
        }

        if ( definition.isFooterRightIndented() &&
            blueprint.drawerRight ) {
            let width = blueprint.drawerRight.visibleWidth;
            style.push( 'right: '+ width +'px;' );
        }

        let footer    = this.container.querySelector('.aurora-footer');
        footer.setAttribute('style', style.join( ' ' ) );
    }


    get offsetHeight() {
        let footer = this.container.querySelector('.aurora-footer');
        if ( footer ) {
            return footer.offsetHeight;
        }
        return "0";
    }

    async adjustContent(container) {
        container.classList.add("aurora-footer-wrapper");
    }

    get appliedTemplateName() {
        return 'footer';
    }

    use(obj, attr) {
        this.input.setAttribute('value', obj[attr]);
    }

    connectedCallback() {
        super.connectedCallback();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('click', this._clickhandler);
    }
}

AuroraFooter.defineElement();
