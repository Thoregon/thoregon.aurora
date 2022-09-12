
/*
 * Copyright (c) 2021.
 */

/**
 * @author: Martin Neitz
 */

import AuroraFormElement        from "./auroraformelement.mjs";

export default class AuroraEmptyLine extends AuroraFormElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-emptyline';
    }



    // theme ... component... templates

    get componentConfiguration() {
        return {
            theme: 'material',
            component: 'form-emptyline',
            templates: ['emptyline'],
        }
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            height: {
                default:        '20px',
                type:           'string',
                description:    'Include a Row with given height to separate elements',
                group:          'Behavior',
                example:        '42px'
            },
        });
    }

    propertiesAsBooleanRequested() {
        //--- check if icon or image url ----
        return {};
    }

    getDefaultWidth() { return false; }

    /**
     *  routine to add all needed classes.
     *  This only can be done on the element level as it will be differ from element to element
     */
    collectClasses() {
        //--- 1: first get the classes added from the dom element
        //--- 2: analyse the transferred attributes
        let classes = super.collectClasses();
        let propertiesValues = this.propertiesValues();

        return classes;
    }

    async adjustContent(container) {
        container.classList.add("aurora-emptyline-wrapper");
    }

    get appliedTemplateName() {
        return 'emptyline';
    }

}

AuroraEmptyLine.defineElement();
