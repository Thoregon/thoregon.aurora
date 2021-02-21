/*
 * Copyright (c) 2021.
 */

import AuroraElement from "../../auroraelement.mjs";

export default class AuroraSection extends AuroraElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-section';
    }

    /*
     * aurora element features
     */

    // theme ... component... templates

    get templateElements() {
        return {
            theme: 'material',
            component: 'blueprint-section',
            templates: ['section'],
        }
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            center: {
                default:        'false',
                type:           'Boolean',
                description:    'Should the content be centerd',
                group:          'Behavior',
                example:        'true'
            }
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

        if ( propertiesValues['center'] === true )  { classes.push( 'center' ); }

        return classes;
    }

    async adjustContent(container) {
        container.classList.add("aurora-section-wrapper");
    }

    get appliedTemplateName() {
        return 'section';
    }
}

AuroraSection.defineElement();
