/*
 * Copyright (c) 2021.
 */

import AuroraBlueprintElement from "./aurorablueprintelement.mjs";

export default class AuroraHeader extends AuroraBlueprintElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-header';
    }

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
                let header = this.container.querySelector('.aurora-header');
                header.classList.add("animate");
                break;
            default:
                return super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    /*
     * Structure
    */

    async renderForMount() {
        this.getAuroraBlueprint().header = this;
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
            component: 'blueprint-header',
            templates: ['header'],
        }
    }

    propertiesDefinitions() {
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            position: {
                default:        'fixed-top',
                type:           'string',
                description:    'How should the header be positioned. ',
                group:          'Behavior',
                example:        'fixed-top | absolute-top'
            },
            separator: {
                default:        'bordered',
                type:           'string',
                description:    'The style of the separator',
                group:          'Behavior',
                example:        'none | bordered | elevated'
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

        if ( blueprint ) {
            let definition = blueprint.definition;
            classes.push( definition.isHeaderFixed()
                        ? 'fixed-top'
                        : 'absolute-top' );

        } else {
            if ( propertiesValues['position'] )  { classes.push( propertiesValues['position'] ); }
        }

        if ( propertiesValues['separator'] )  { classes.push( propertiesValues['separator'] ); }

        return classes;
    }


    adjustToBlueprint( definition ) {
        let blueprint = this.blueprint;
        let style = [];

        if ( definition.isHeaderLeftIndented() &&
             blueprint.drawerLeft ) {
            let width = blueprint.drawerLeft.visibleWidth;
            style.push( 'left: '+ width +'px;' );
        }

        if ( definition.isHeaderRightIndented() &&
            blueprint.drawerRight ) {
            let width = blueprint.drawerRight.visibleWidth;
            style.push( 'right: '+ width +'px;' );
        }

        let header    = this.container.querySelector('.aurora-header');
        header.setAttribute('style', style.join( ' ' ) );
    }


    get offsetHeight() {
        let header = this.container.querySelector('.aurora-header');
        if ( header ) {
            return header.offsetHeight;
        }
        return "0";
    }

    async adjustContent(container) {
        container.classList.add("aurora-header-wrapper");
    }

    get appliedTemplateName() {
        return 'header';
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

AuroraHeader.defineElement();
