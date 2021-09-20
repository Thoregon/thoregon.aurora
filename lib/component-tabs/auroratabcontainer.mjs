/*
 * Copyright (c) 2021.
 */

/**
 *
 * @author: Martin Neitz
 */

import AuroraFormElement        from "../formcomponents/auroraformelement.mjs";

export default class AuroraTabContainer extends AuroraFormElement {
// AuroraList

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-tab-container';
    }

    /*
     * aurora element features
     */

    get isTrigger() {
        return true;
    }

    constructor() {
        super();
        this.tabs = [];
        this.panels = [];
    }

    getAuroraTabContainer() {
        return this;
    }

    registerTab( tab ) {
        this.tabs.push( tab );
    }


    get componentConfiguration() {

        return {
            theme    : 'material',
            component: 'component-tabs',
            templates: ['tabcontainer'],
        }
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            'mode'          : {
                default    : 'table',
                type       : 'string',
                description: 'Type of representation',
                group      : 'Behavior',
                example    : 'table | grid'
            }
        });
    }

    propertiesAsBooleanRequested() {
        return {};
    }

    getDefaultWidth() {
        return false;
    }

    /**
     *  routine to add all needed classes.
     *  This only can be done on the element level as it will be differ from element to element
     */
    collectClasses() {
        let classes          = [];
        let propertiesValues = this.propertiesValues();

        if (propertiesValues['fullwidth']) {
            classes.push('fullwidth');
        }

        return classes;
    }

    async adjustContent(container) {
        container.classList.add("aurora-tab-container-wrapper");
    }

    get appliedTemplateName() {
        return 'tabcontainer';
    }

    use(obj, attr) {
        this.input.setAttribute('value', obj[attr]);
    }

    triggerRoute() {
        return true;
    }
}

AuroraTabContainer.defineElement();
