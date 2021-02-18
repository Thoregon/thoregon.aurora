/*
 * Copyright (c) 2021.
 */

import AuroraElement from "../../auroraelement.mjs";

export default class AuroraHeader extends AuroraElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-header';
    }

    /*
     * Structure
    */

    async connect() {
        let blueprint = this.getAuroraBlueprint();
        this.blueprint = blueprint;
        blueprint.header = this;
    }

    /*
     * aurora element features
     */

    get isTrigger() {
        return true;
    }


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

    get templateElements() {
        return {
            theme: 'material',
            component: 'blueprint-header',
            templates: ['header'],
        }
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            position: {
                default:        'top',
                type:           'string',
                description:    'How should the header be positioned. ',
                group:          'Behavior',
                example:        'fixed'
            },
            separator: {
                default:        'bordered',
                type:           'string',
                description:    'The style of the separator',
                group:          'Behavior',
                example:        'none | bordered | elvated'
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

        if ( propertiesValues['position'] )  { classes.push('position-' + propertiesValues['position'] ); }
        if ( propertiesValues['separator'] )  { classes.push( propertiesValues['separator'] ); }

        return classes;
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
