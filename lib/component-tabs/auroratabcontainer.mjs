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

    constructor() {
        super();
        this.tabs = {};
        this.panels = {};
    }

    static get observedAttributes() {
        return [...super.observedAttributes, 'orientation'];
    }

    static forwardedAttributes() {
        return Object.assign(super.forwardedAttributes(), {
            orientation: { select: 'aurora-tab-list' }
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'orientation' :
                if ( ! this.container ) return;
                this.propertiesValues()['orientation'] = newValue;

                let tablist = this.container.querySelector('.aurora-tab-container');
                this.removeClassesWithPrefix(tablist, 'orientation-');

                tablist.classList.add('orientation-' + newValue );
                break;
        }
        return super.attributeChangedCallback(name, oldValue, newValue);
    }


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

    getAuroraTabContainer() {
        return this;
    }

    getActiveTab(){
        let activetab = this.tabs[Object.keys(this.tabs)[0]];

        for (let name in this.tabs ) {

            if (this.tabs[name].isActive ) {
                activetab = this.tabs[name];
                break;
            }
        }

        return activetab;
    }

    registerPanel( panel ) {
        let name = panel.propertiesValues().name;
        this.panels[name] = panel;

        if ( (name in this.tabs)
             && this.tabs[name].propertiesValues()['active'] ) {
            panel.setAttribute('active', "");
        }
    }

    registerTab( tab ) {
        let name = tab.propertiesValues().name;
        this.tabs[name] = tab;
        tab.addEventListener('click', () => this.clickCallbackForTab( tab ), false);
    }

    clickCallbackForTab( tab ) {
        for (let name in this.tabs ) {
            if ( ! tab.hasAttribute('disabled') ) {
                if ( tab === this.tabs[name] ) {
                    this.tabs[name].setActive();
                    this.panels[name].setActive();
                } else {
                    this.tabs[name].setInactive();
                    this.panels[name].setInactive();
                }
            }
        }
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
            'orientation'          : {
                default    : 'top',
                type       : 'string',
                description: 'Position of the tablist',
                group      : 'Behavior',
                example    : 'top | left | right | bottom'
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

        classes.push('orientation-' + propertiesValues.orientation);

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
