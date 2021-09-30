/*
 * Copyright (c) 2021.
 */

/**
 *
 * @author: Martin Neitz
 */

import AuroraFormElement        from "../formcomponents/auroraformelement.mjs";

export default class AuroraTabPanelList extends AuroraFormElement {

    constructor() {
        super();
        this.panels = [];
    }

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-tab-panel-list';
    }

    /*
     * aurora element features
     */

    get isTrigger() {
        return true;
    }

    async renderForMount() {

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
            templates: ['tabpanellist'],
        }
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            ':panels' : {
                default    : '',
                type       : 'string',
                description: 'Function which will add the panels to the list',
                group      : 'Content',
                example    : 'myFunction'
            }
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

    async adjustContent(container) {
        container.classList.add("aurora-tabpanellist-wrapper");
    }

    get appliedTemplateName() {
        return 'tabpanellist';
    }

    use(obj, attr) {
        this.input.setAttribute('value', obj[attr]);
    }

    triggerRoute() {
        return true;
    }

    async existsConnect() {
        super.existsConnect();

        let propertiesValues = this.propertiesValues();
        let functionPanels   = propertiesValues[':panels'];

        let panellist  = this.container.querySelectorAll('[aurora-slot="main"]')[0];

        let vm      = this.viewModel || this.parentViewModel();
        let panelsfunction = vm[functionPanels];

        let panelsHTML = '';

        if ( panelsfunction ) {
            panelsHTML = panelsfunction.apply( vm );
            panellist.innerHTML = panelsHTML;
            this.propagateForwardedAttributes();    // check if this could run auto after modifying any content (see MutationObserver)
        }
        
       // this.behavior.attach(this);
    }
}

AuroraTabPanelList.defineElement();
