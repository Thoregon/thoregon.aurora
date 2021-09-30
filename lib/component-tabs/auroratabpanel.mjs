/*
 * Copyright (c) 2021.
 */

/**
 *
 * @author: Martin Neitz
 */

import AuroraFormElement        from "../formcomponents/auroraformelement.mjs";

export default class AuroraTabPanel extends AuroraFormElement {

    constructor() {
        super();
        this.panels = [];
    }

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-tab-panel';
    }

    /*
     * aurora element features
     */

    get isTrigger() {
        return false;
    }

    setActive() {
        let tab = this.container.querySelector('.aurora-tab-panel');
        tab.classList.remove('inactive');
        tab.classList.add('active');
    }
    setInactive() {
        let tab = this.container.querySelector('.aurora-tab-panel');
        tab.classList.remove('active');
        tab.classList.add('inactive');
    }

    async renderForMount() {
    }

    async connect() {
        let tabcontainer = this.getAuroraTabContainer();
        tabcontainer.registerPanel(this);
        this.dispatchEvent(new CustomEvent('paneladded', {
            bubbles: true,
            composed: true,
            detail: this
        }));
    }

    static get observedAttributes() {
        return [...super.observedAttributes, 'active'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'active':
                this.attributeChangedCallbackForActive( oldValue, newValue );
            default:
                return super.attributeChangedCallback(name, oldValue, newValue);
                break;
        }

        //       this.adjustTab();
    }

    attributeChangedCallbackForActive(oldValue, newValue) {
        if (newValue != undefined) {
            this.setActive();
        } else {
            this.setInactive();
        }
    }


    getAuroraTabContainer() {
        return this.getRootNode().host.getAuroraTabContainer();
    }

    getAuroraTabPanelList() {
        return this;
    }

    registerTabPanel( panel ) {
        this.panels.push( panel );
    }

    get componentConfiguration() {

        return {
            theme    : 'material',
            component: 'component-tabs',
            templates: ['tabpanel'],
        }
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            name          : {
                default    : '',
                type       : 'string',
                description: 'Identification of the panel which is corresponding with the tab',
                group      : 'Behavior',
                example    : 'mytab'
            },
            active: {
                default:        false,
                type:           'boolean',
                description:    'by setting an panel active, it will be marked as open',
                group:          'Behavior',
                example:        'true'
            },
        });
    }

    propertiesAsBooleanRequested() {
        return {};
    }

    getDefaultWidth() {
        return false;
    }

    /*
     *  routine to add all needed classes.
     *  This only can be done on the element level as it will be differ from element to element
     */
    collectClasses() {
        let classes          = [];
        let propertiesValues = this.propertiesValues();

        return classes;
    }

    getCalculatedProperties() {
        let propertiesValues = this.propertiesValues();
        let activeClass      = '';

        if ( propertiesValues['active'] ) {
            activeClass = 'active';
        }

        return {
            activeclass: activeClass,
        }
    }

    async adjustContent(container) {
        container.classList.add("aurora-tabpanel-wrapper");
    }

    get appliedTemplateName() {
        return 'tabpanel';
    }

    use(obj, attr) {
        this.input.setAttribute('value', obj[attr]);
    }

    triggerRoute() {
        return true;
    }

    async existsConnect() {
        super.existsConnect();
    }
}

AuroraTabPanel.defineElement();
