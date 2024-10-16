/*
 * Copyright (c) 2021.
 */

import AuroraElement                from "../../auroraelement.mjs";
import { deepdiff, baredeepcopy }   from "/evolux.util/lib/objutils.mjs"

const defaultLayoutConfiguration = {
    layout     : 'hHh LpR fFf',
    header     : {
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
    overlay    : {
        enabled: true,
        open   : false,
    },
}

export default class AuroraBlueprintNew extends AuroraElement {

    constructor() {
        super();
        this._layoutHelper = new LayoutHelper();
        this._layout       = defaultLayoutConfiguration;
        this._defaults     = defaultLayoutConfiguration;
        this.ids           = [];
    }

    async existsConnect() {
        // The behavior will be loaded with a default configuration if none is provided.
        this.behavior.setDefaultLayoutConfiguration(this._layout);
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

    //---  Triggers -----------------------------

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

    //--- handle configuration change

    setDefaultConfiguration(config) {
        //--- convert convenience methods in the definition
        this.convertLayoutProperties(config);

        //--- merge the existing layout with the new config
        const layout = baredeepcopy(this._layout);
        deepdiff(layout, config, {merge: true});
        this._defaults = layout;

        this.initializeConfiguration(layout);
        this.behavior.setDefaultLayoutConfiguration(layout);
    }

    setConfiguration(config) {

        //--- convert convenience methods in the definition
        this.convertLayoutProperties(config);

        //--- merge the existing layout with the new config
        const layout = baredeepcopy(this._defaults);
        deepdiff(layout, config, {merge: true});
        this._layout = layout;

        this.initializeConfiguration(layout);
        this.behavior.setLayoutConfiguration(this._layout);
    }

    convertLayoutProperties(config) {

        if (config.drawerLeft) {
            if (config.drawerLeft.width &&
                config.drawerLeft.width.endsWith('%')) {
                config.drawerLeft.width = (parseFloat(config.drawerLeft.width) / 100) * window.innerWidth + 'px';
            }
        }
        if (config.drawerRight) {
            if (config.drawerRight.width &&
                config.drawerRight.width.endsWith('%')) {
                config.drawerRight.width = (parseFloat(config.drawerRight.width) / 100) * window.innerWidth + 'px';
            }
        }
    }

    initializeConfiguration(layout) {

        //--- will handle the ""hHh lpR fFf" settings
        this._layoutHelper.initializeDefinition(layout.layout);

        layout.header.enabled    = this._layoutHelper.isHeaderEnabled();
        layout.header.fixed      = this._layoutHelper.isHeaderFixed();
        layout.header.insetLeft  = this._layoutHelper.isHeaderAccomLeftDrawer();
        layout.header.insetRight = this._layoutHelper.isHeaderAccomRightDrawer();

        layout.footer.enabled   =  this._layoutHelper.isFooterEnabled();
        layout.footer.fixed      = this._layoutHelper.isFooterFixed();
        layout.footer.insetLeft  = this._layoutHelper.isFooterAccomLeftDrawer();
        layout.footer.insetRight = this._layoutHelper.isFooterAccomRightDrawer();
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

    isHeaderEnabled()          { return this.header.substring(1, 2) !== 'p'; }
    isHeaderFixed()            { return this.header.substring(1, 2) === 'H'; }
    isHeaderAccomLeftDrawer()  { return this.header.substring(0, 1) === 'l'; }
    isHeaderAccomRightDrawer() { return this.header.substring(2, 3) === 'r'; }

    isFooterEnabled()          { return this.header.substring(1, 2) !== 'p'; }
    isFooterFixed()            { return this.footer.substring(1, 2) === 'F'; }
    isFooterAccomLeftDrawer()  { return this.footer.substring(0, 1) === 'l'; }
    isFooterAccomRightDrawer() { return this.footer.substring(2, 3) === 'r'; }

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
