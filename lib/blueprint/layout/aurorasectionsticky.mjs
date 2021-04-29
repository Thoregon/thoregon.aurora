/*
 * Copyright (c) 2021.
 */

import AuroraElement from "../../auroraelement.mjs";

export default class AuroraSectionSticky extends AuroraElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-section-sticky';
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

    get componentConfiguration() {
        return {
            theme: 'material',
            component: 'blueprint-section-sticky',
            templates: ['section-sticky'],
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
                default:        'bottom-right',
                type:           'string',
                description:    'Page side/corner to stick to',
                group:          'Behavior',
                example:        'top-right | top-left | bottom-right | bottom-left | top | right | bottom | left'
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

        if ( propertiesValues['position'] )  { classes.push( propertiesValues['position'] ); }

        return classes;
    }

    async adjustContent(container) {
        container.classList.add("aurora-section-sticky-wrapper");
    }

    get appliedTemplateName() {
        return 'section-sticky';
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

AuroraSectionSticky.defineElement();
 