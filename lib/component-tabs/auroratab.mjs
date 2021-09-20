/*
 * Copyright (c) 2021.
 */

/**
 *
 * @author: Martin Neitz
 */

import AuroraFormElement        from "../formcomponents/auroraformelement.mjs";

export default class AuroraTab extends AuroraFormElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-tab';
    }

    /*
     * aurora element features
     */

    get isTrigger() {
        return true;
    }

    getAuroraTabContainer() {
        this.tabcontainer = this.getRootNode().host.getAuroraTabContainer();
        return this.tabcontainer;
    }

    getAuroraTabList() {
        this.tablist = this.getRootNode().host.getAuroraTabList();
        return this.tablist;
    }

    async renderForMount() {
        let tabcontainer = this.getAuroraTabContainer();
        let tablist = this.getAuroraTabList();
        tabcontainer.registerTab(this);
        tablist.registerTab(this);
       // debugger;
    }

    get componentConfiguration() {

        return {
            theme    : 'material',
            component: 'component-tabs',
            templates: ['tab'],
        }
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            //--- label
            //--- name
            //--- icon
            //--- disabled
            label          : {
                default    : '',
                type       : 'string',
                description: 'Text to be shown on the tab',
                group      : 'Content',
                example    : 'myTab'
            },
            name          : {
                default    : '',
                type       : 'string',
                description: 'Identification of the tab which is corresponding with the tab-pad',
                group      : 'Behavior',
                example    : 'mytab'
            },
            icon: {
                default:        '',
                type:           'string',
                description:    'Icon name following Aurora convention; Make sure you have the icon library installed unless you are using \'img:\' prefix\n',
                group:          'Behavior',
                example:        'settings | img:https://thatsme.plus/wp-content/uploads/2020/12/logo.png'
            },
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
    getCalculatedProperties() {
        let propertiesValues = this.propertiesValues();
        let iconOrURL        = propertiesValues['icon'];
        let useIconURL       = false;

        if ( iconOrURL.startsWith('img:') ) {
            iconOrURL = iconOrURL.substring(4);
            useIconURL = true;
        }

        return {
            icon: iconOrURL,
            useiconurl: useIconURL,
        }
    }
    async adjustContent(container) {
        container.classList.add("aurora-tab-wrapper");
    }

    get appliedTemplateName() {
        return 'tab';
    }

    use(obj, attr) {
        this.input.setAttribute('value', obj[attr]);
    }

    triggerRoute() {
        return true;
    }
}

AuroraTab.defineElement();
