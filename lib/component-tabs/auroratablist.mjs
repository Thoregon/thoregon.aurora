/*
 * Copyright (c) 2021.
 */

/**
 *
 * @author: Martin Neitz
 */

import AuroraFormElement        from "../formcomponents/auroraformelement.mjs";

export default class AuroraTabList extends AuroraFormElement {

    constructor() {
        super();
        this.tabs = [];
    }

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-tab-list';
    }

    /*
     * aurora element features
     */

    get isTrigger() {
        return true;
    }

    async renderForMount() {

    }

    static get observedAttributes() {
        return [...super.observedAttributes, 'align'];
    }

    static forwardedAttributes() {
        return Object.assign(super.forwardedAttributes(), {
            align: { select: 'aurora-tab' }
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'align':
                this.attributeChangedCallbackForAlign( oldValue, newValue );
            default:
                return super.attributeChangedCallback(name, oldValue, newValue);
                break;
        }

 //       this.adjustTab();
    }

    attributeChangedCallbackForAlign( oldValue, newValue ) {
        if ( ! this.container ) return;
        this.propertiesValues()['align'] = newValue;

        let tablist = this.container.querySelector('.aurora-tab-list');
        this.removeClassesWithPrefix(tablist, 'align-');

        tablist.classList.add('align-' + newValue );
    }

    removeClassesWithPrefix(element, prefix ) {
        let classes = element.className.split(" ").filter(function(c) {
            return c.lastIndexOf(prefix, 0) !== 0;
        });
        element.className = classes.join(" ").trim();
    }

    getAuroraTabContainer() {
        return this.getRootNode().host.getAuroraTabContainer();
    }

    getAuroraTabList() {
        return this;
    }

    registerTab( tab ) {
        this.tabs.push( tab );
    }

    get componentConfiguration() {

        return {
            theme    : 'material',
            component: 'component-tabs',
            templates: ['tablist'],
        }
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            align          : {
                default    : 'center',
                type       : 'string',
                description: 'Horizontal alignment the tabs within the tabs container',
                group      : 'Behavior',
                example    : 'left | center | right | justify'
            },
            orientation : {
                default    : 'horizontal',
                type       : 'string',
                description: 'How the tabs should be oriented.',
                group      : 'Behavior',
                example    : 'horizontal | vertical'
            },
            'inline-label' : {
                default    : false,
                type       : 'boolean',
                description: 'Allows the text to be inline with the icon, should one be used',
                group      : 'Content',
                example    : true
            },

            ':tabs' : {
                default    : '',
                type       : 'string',
                description: 'Function which will add the tabs to the list',
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

        if (propertiesValues['align']) {
            classes.push('align-' + propertiesValues['align'] );
        }

        if (propertiesValues['orientation']) {
            classes.push('orientation-' + propertiesValues['orientation'] );
        }

        return classes;
    }

    async adjustContent(container) {
        container.classList.add("aurora-tablist-wrapper");
    }

    get appliedTemplateName() {
        return 'tablist';
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
        let functionTabs       = propertiesValues[':tabs'];

        let tablist  = this.container.querySelectorAll('[aurora-slot="main"]')[0];

        let vm      = this.viewModel || this.parentViewModel();
        let tabsfunction = vm[functionTabs];

        let tabsHTML = '';

        if ( tabsfunction ) {
            tabsHTML = tabsfunction.apply( vm );
            tablist.innerHTML = tabsHTML;
            this.propagateForwardedAttributes();    // check if this could run auto after modifying any content (see MutationObserver)
        }

       // this.behavior.attach(this);
    }
}

AuroraTabList.defineElement();