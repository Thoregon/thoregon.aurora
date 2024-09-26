/*
 * Copyright (c) 2021.
 */

import AuroraElement from "../../auroraelement.mjs";


const defaultLayoutConfiguration = {
    layout: 'hHh LpR fFf',
    header: {
        enabled   : true,       // Whether the header is in use
        fixed     : true,       // If true, the header is fixed; if false, it scrolls with the content
        minHeight : '30px',     // minimal height of the header even without content
        height    : '50px',     // the actual height of the header calculated according to content and size
        left      : '0px',      // Position from the left edge of the viewport
        right     : '0px',      // Position from the right edge of the viewport
        insetLeft : false,      // If true, the header’s space is adjusted to allow the left drawer to overlap
        insetRight: false,      // If true, the header’s space is adjusted to allow the right drawer to overlap
    },
    footer     : {
        enabled   : true,       // Whether the footer is in use
        fixed     : true,       // If true, the footer is fixed; if false, it scrolls with the content
        minHeight : '30px',     // Minimal height of the footer even without content
        height    : '40px',     // The actual height of the footer calculated according to content and size
        left      : '0px',      // Position from the left edge of the viewport
        right     : '0px',      // Position from the right edge of the viewport
        insetLeft : false,      // If true, the footer’s space is adjusted to allow the left drawer to overlap
        insetRight: false,      // If true, the footer’s space is adjusted to allow the right drawer to overlap
    },
    drawerLeft : {
        enabled       : true,      // Whether the left drawer is in use
        open          : true,      // Whether the left drawer is open
        width         : '250px',   // Width of the left drawer when fully expanded
        collapsedWidth: '60px',    // Width of the left drawer when collapsed (showing only icons)
        collapsed     : false,
    },
    drawerRight: {
        enabled       : true,      // Whether the left drawer is in use
        open          : true,      // Whether the left drawer is open
        width         : '250px',   // Width of the left drawer when fully expanded
        collapsedWidth: '60px',    // Width of the left drawer when collapsed (showing only icons)
        collapsed     : false,     // If true, the drawer is in collapsed mode
    },
    overlay: {
        enabled       : true,
        open          : false,
    },
}

export default class AuroraBlueprintNew extends AuroraElement {

    constructor() {
        super();
        this._layout  = defaultLayoutConfiguration;
        this._default = undefined;
        this.ids      = [];
    }

    async existsConnect() {
        this._layoutHelper = new LayoutHelper(this._layout.layout);
        this.behavior.setLayoutConfiguration(this._layout);
        let app = this.getAuroraAppElement();
        if (app) app.registerBlueprint(this);
        universe.uirouter.blueprintReady();
    }

    static get observedAttributes() {
        return [...super.observedAttributes, 'layout'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name != 'layout') return super.attributeChangedCallback(name, oldValue, newValue);

        switch (name) {
            case 'layout':
                // change settings
//                this.attributeChangedCallbackForLayout( oldValue, newValue );
                break;
        }

        //-- if exist
//        this.behavior.adjustBlueprint();
    }


    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-blueprint-new';
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            view: {
                default:        '',
                type:           'string',
                description:    'View to be displays inside this part',
                group:          'Structure',
                example:        ''
            },
            layout: {
                default:        'hhh lpr fff',
                type:           'string',
                description:    'Defines how your layout components (header/footer/drawer) should be placed on screen.',
                group:          'Structure',
                example:        'hHh lpR fFf'
            }
        });
    }


    get componentConfiguration() {
        return {
            theme: 'material',
            component: 'blueprint',
            templates: ['blueprintnew'],
        }
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

        return classes;
    }

    async adjustContent(container) {
        container.classList.add("aurora-blueprintnew-wrapper");
    }

    get appliedTemplateName() {
        return 'blueprintnew';
    }

    registerID( element ) {
        this.behavior.registerID(element);
    }

    positionToElement( elementID, options ) {
        this.behavior.positionToElement(elementID, options);
    }

    registerDrawerToggleTrigger( element ) {
        element.addEventListener('click', () => this.toggleDrawer( element ), false);
    }
    registerDrawerOpenTrigger( element ) {
        element.addEventListener('click', () => this.openDrawer( element ), false);
    }
    registerDrawerCloseTrigger( element ) {
        element.addEventListener('click', () => this.closeDrawer( element ), false);
    }

    registerDrawerCollapseTrigger( element ) {
        element.addEventListener('click', () => this.collapseDrawer( element ), false);
    }
    registerDrawerExpandTrigger(element) {
        element.addEventListener('click', () => this.expandDrawer( element ), false);
    }

    registerOverlayOpenTrigger(element) {
        element.addEventListener('click', () => this.openOverlay( element ), false);
    }
    registerOverlayCloseTrigger(element) {
        element.addEventListener('click', () => this.closeOverlay( element ), false);
    }

    //--- zoe

    toggleDrawer(element) {
        if ( element.isRightDrawerToggleTrigger() ) this.behavior?.toggleDrawerRight();
        if ( element.isLeftDrawerToggleTrigger() )  this.behavior?.toggleDrawerLeft();
    }

    openDrawer(element) {
        if ( element.isLeftDrawerOpenTrigger() ) this.behavior?.openLeftDrawer();
        if ( element.isRightDrawerOpenTrigger()) this.behavior?.openRightDrawer();
    }
    closeDrawer(element) {
        if ( element.isLeftDrawerCloseTrigger() ) this.behavior?.closeLeftDrawer();
        if ( element.isRightDrawerCloseTrigger()) this.behavior?.closeRightDrawer();
    }

    expandDrawer(element) {}
    collapseDrawer(element) {}

    openOverlay(element) {
        this.behavior?.openOverlay();
    }
    closeOverlay(element) {
        this.behavior?.closeOverlay();
    }


    contentChanged() {
        this.behavior.adjustBlueprint();
    }

    setDefaultConfiguration(defaultConfig) {

        this._default = defaultConfig;

        this.initializeDefaultConfiguration();
        this.behavior.setLayoutConfiguration(this._layout);
    }
    setConfiguration( config ) {
        this.initializeDefaultConfiguration();
        this.initializeConfiguration(config);
        this.behavior.setLayoutConfiguration(this._layout);
    }

    initializeDefaultConfiguration() {
        const layout  = this._layout;
        const config  = this._default;

        if ( config.layout ) {

            layout.layout = config.layout;
            this._layoutHelper.initializeDefinition(config.layout);

            layout.header.fixed      = this._layoutHelper.isHeaderFixed();
            layout.header.insetLeft  = this._layoutHelper.isHeaderAccomLeftDrawer();
            layout.header.insetRight = this._layoutHelper.isHeaderAccomRightDrawer();

            layout.footer.fixed      = this._layoutHelper.isFooterFixed();
            layout.footer.insetLeft  = this._layoutHelper.isFooterAccomLeftDrawer();
            layout.footer.insetRight = this._layoutHelper.isFooterAccomRightDrawer();
        }

        if (config.drawerLeft) {
            layout.drawerLeft.open  = config.drawerLeft.state === "open";
            layout.drawerLeft.width = layout.drawerLeft.width || config.drawerLeft.width;
        }
        if (config.drawerRight) {
            layout.drawerRight.open  = config.drawerRight.state === "open";
            layout.drawerRight.width = layout.drawerRight.width || config.drawerRight.width;
        }
    }
    initializeConfiguration (config) {
        const layout  = this._layout;

        let drawerWidth;

        if (config.drawerLeft) {
            drawerWidth = config.drawerLeft.width
            if (drawerWidth &&
                drawerWidth.endsWith('%')) {
                const percentageValue = parseFloat(drawerWidth);
                drawerWidth           = (percentageValue / 100) * window.innerWidth + 'px';
            }

            layout.drawerLeft.open  = config.drawerLeft.state === "open";
            layout.drawerLeft.width = drawerWidth || layout.drawerLeft.width;
        }
        if (config.drawerRight) {

            drawerWidth = config.drawerRight.width
            if (drawerWidth &&
                drawerWidth.endsWith('%')) {
                const percentageValue = parseFloat(drawerWidth);
                drawerWidth           = (percentageValue / 100) * window.innerWidth + 'px';
            }

            layout.drawerRight.open  = config.drawerRight.state === "open";
            layout.drawerRight.width = drawerWidth || layout.drawerRight.width;
        }

        if (config.overlay) {
            layout.overlay.open = config.overlay.state === "open";
        }
    }

    getBlueprintElementWithName(name) {
        return this.behavior.getElementWithName(name);
    }
    async renderViewInTarget( target, viewElement, ref, fragmentid) {
        const targetElement = this.getBlueprintElementWithName(target);
        await viewElement.render(targetElement, ref);
//        viewElement.addRenderFn(() => this.getBlueprint().contentChanged());
        this.behavior.resetTarget(target);
    }


    analyzeElementPlacement( element ) {
        return this.behavior.analyzeElementPlacement( element );
    }
};

class LayoutHelper {
    constructor( layout ) {
        this.initializeDefinition( layout );
    }

    initializeDefinition(layout) {
        this.definition  = layout.split(/\s+/);

        this.header = this.definition[0];
        this.footer = this.definition[2];

        this.drawerLeft  =  this.definition[0].substring(0, 1) +
            this.definition[1].substring(0, 1) +
            this.definition[2].substring(0, 1);

        this.drawerRight =  this.definition[0].substring(2, 3) +
            this.definition[1].substring(2, 3) +
            this.definition[2].substring(2, 3);
    }

    isHeaderFixed () { return this.header.substring(1, 2) === 'H'; }
    isHeaderAccomLeftDrawer () { return this.header.substring(0, 1) === 'l'; }
    isHeaderAccomRightDrawer() { return this.header.substring(2, 3) === 'r'; }

    isFooterFixed() { return this.footer.substring(1, 2) === 'F';  }
    isFooterAccomLeftDrawer () { return this.footer.substring(0, 1) === 'l'; }
    isFooterAccomRightDrawer () { return this.footer.substring(2, 3) === 'r'; }

    isDrawerBelowHeader( position ) {
        if ( position == 'left' ) {
            return ! this.isHeaderAccomLeftDrawer ();
        } else {
            return ! this.isHeaderAccomRightDrawer ();
        }
    }
    isDrawerAboveFooter( position ) {
        if ( position == 'left' ) {
            return ! this.isFooterAccomLeftDrawer ();
        } else {
            return ! this.isFooterAccomRightDrawer ();
        }
    }
}


AuroraBlueprintNew.defineElement();
