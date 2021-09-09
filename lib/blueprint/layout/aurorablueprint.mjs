/*
 * Copyright (c) 2021.
 */

import AuroraElement from "../../auroraelement.mjs";

export default class AuroraBlueprint extends AuroraElement {

    async existsConnect() {
        //--- find all drawer triggers
        this.adjustBlueprint();
    }

    static get observedAttributes() {
        return [...super.observedAttributes, 'layout'];
    }

    static forwardedAttributes() {
        return Object.assign(super.forwardedAttributes(), {
            animated: { select: 'aurora-drawer, aurora-header, aurora-footer, aurora-container' }
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name != 'layout') return super.attributeChangedCallback(name, oldValue, newValue);

        switch (name) {
            case 'layout':
                this.attributeChangedCallbackForLayout( oldValue, newValue );
                break;
        }

        this.adjustBlueprint();
    }

    attributeChangedCallbackForLayout( oldValue, newValue ) {
        this.propertiesValues()['layout'] = newValue;
        this.definition  = new BlueprintDefinition( this, this.propertiesValues()['layout'] );
    }

    adjustBlueprint() {
        if (this.uicontainer) this.uicontainer.adjustToBlueprint();
        if (this.header)      this.header.adjustToBlueprint( this.definition );
        if (this.drawerLeft)  this.drawerLeft.adjustToBlueprint( this.definition );
        if (this.drawerRight) this.drawerRight.adjustToBlueprint( this.definition );
        if (this.footer)      this.footer.adjustToBlueprint( this.definition );
    }


    constructor() {
        super();
        this.blueprintParts = [];
        let app = this.getAuroraAppElement();
        if (app) app.registerBlueprint(this);

        // slots for blueprint elements. a blueprint has fixed slots which can be used ba an app, but not all needs to be set
        this.header      = undefined;
        this.drawerLeft  = undefined;
        this.drawerRight = undefined;
        this.uicontainer = undefined;
        this.footer      = undefined;

        //--- build the definitions based on the layout of the blueprint
        this.definition  = new BlueprintDefinition( this, this.propertiesValues()['layout'] );
    }

    applyChildElements(container) {
        super.applyChildElements(container);
    }

    getAuroraBlueprint() {
        return this;
    }

    registerDrawerToggle( element ) {
        element.addEventListener('click', () => this.toggleDrawer( element ), false);
    }
    registerDrawerOpener( element ) {
        element.addEventListener('click', () => this.openDrawer( element ), false);
    }

    openDrawer( element ) {
        if ( element.isRightDrawerOpener() ) {
            if ( this.drawerRight ) this.drawerRight.open();
        }
        if ( element.isLeftDrawerOpener() ) {
            if ( this.drawerLeft ) this.drawerLeft.open();
        }
        this.adjustBlueprint();
    }

    toggleDrawer( element ) {
        if ( element.isRightDrawerToggle() ) this.drawerRight?.toggle();
        if ( element.isLeftDrawerToggle() )  this.drawerLeft?.toggle();

        this.adjustBlueprint();
    }

    getBlueprintElementWithName(name) {

        if (this.header      && this.header.auroraname === name)      return this.header;
        if (this.drawerLeft  && this.drawerLeft.auroraname === name)  return this.drawerLeft;
        if (this.drawerRight && this.drawerRight.auroraname === name) return this.drawerRight;
        if (this.uicontainer && this.uicontainer.auroraname === name) return this.uicontainer;
        if (this.footer      && this.footer.auroraname === name)      return this.footer;
    }

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-blueprint';
    }


    getLayoutDefinitionFor( $name ) {

        if ( ! this.definition ) {
            this.definition = new BlueprintDefinition( this, this.propertiesValues()['layout'] );
            debugger;
        }

        if ( this.layoutDefinition === undefined ) {
            this.layoutDefinition  = this.propertiesValues()['layout'].split(/\s+/);
            this.layoutDrawerLeft =    this.layoutDefinition[0].substring(0,1) +
                                        this.layoutDefinition[1].substring(0,1) +
                                        this.layoutDefinition[2].substring(0,1);
            this.layoutDrawerRight =   this.layoutDefinition[0].substring(2,3) +
                                        this.layoutDefinition[1].substring(2,3) +
                                        this.layoutDefinition[2].substring(2,3);
        }
        switch ($name) {
            case 'header':
                return this.layoutDefinition[0];
            case 'content':
                return this.layoutDefinition[1];
            case 'footer':
                return this.layoutDefinition[2];
            case 'left-drawer':
                return this.layoutDrawerLeft;
            case 'right-drawer':
                return this.layoutDrawerRight;
        }
    }

    getHeaderAdjustmentStyle() {
        let style = '';
        let drawerLeftWidth = 0;

        if ( this.drawerLeft &&
             this.getLayoutDefinitionFor('header').substring(0, 1) === 'l' &&
             true // check if drawer is open
        ) {
            drawerLeftWidth = this.drawerLeft.visibleWidth;
        }

        return "padding-left: "+ drawerLeftWidth + "px;";
    }


    isLeftDrawerFixed() {
        return this.getLayoutDefinitionFor('content').substring(0,1) === 'L';
    }
    isRightDrawerFixed() {
        return this.getLayoutDefinitionFor('content').substring(2,3) === 'R';
    }

    isFooterFixed() { return this.getLayoutDefinitionFor('footer').substring(1,2) === 'F'; }
    isFooterAbsolute() { return ! this.isFooterFixed(); }

    /*
     * aurora element features
     */

    get isTrigger() {
        return true;
    }

    /*
     * Views
     */

    getWelcomeView() {
        return this.getAttribute("welcome");
    }

    getDefaultView() {
        return this.getAttribute("view");
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

    /*
     * Exposed Events
     */

    /*
        exposedEvents() {
            return Object.assign(super.exposedEvents(), {
                click: {
                    select  : 'button'
                }
            });
        }
    */

    // theme ... component... templates

    get componentConfiguration() {
        return {
            theme: 'material',
            component: 'blueprint',
            templates: ['blueprint'],
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
        container.classList.add("aurora-blueprint-wrapper");
    }

    get appliedTemplateName() {
        return 'blueprint';
    }

    use(obj, attr) {
        this.input.setAttribute('value', obj[attr]);
    }

    connectedCallback() {
        super.connectedCallback();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('click', this._clickhandler);
    }
}

class BlueprintDefinition {
    constructor( blueprint, definition ) {
        this.blueprint = blueprint;
        this.initializeDefinition( definition );
    }

    initializeDefinition(definition) {
        this.definition  = definition.split(/\s+/);

        this.header      = this.definition[0];
        this.footer      = this.definition[2];

        this.drawerLeft  =  this.definition[0].substring(0, 1) +
                            this.definition[1].substring(0, 1) +
                            this.definition[2].substring(0, 1);

        this.drawerRight =  this.definition[0].substring(2, 3) +
                            this.definition[1].substring(2, 3) +
                            this.definition[2].substring(2, 3);
    }

    isHeaderFixed () { return this.header.substring(1, 2) === 'H'; }
    isHeaderLeftIndented () { return this.header.substring(0, 1) === 'l'; }
    isHeaderRightIndented () { return this.header.substring(2, 3) === 'r'; }

    isFooterFixed() { return this.footer.substring(1, 2) === 'F';  }
    isFooterLeftIndented () { return this.footer.substring(0, 1) === 'l'; }
    isFooterRightIndented () { return this.footer.substring(2, 3) === 'r'; }

    isDrawerBelowHeader( position ) {
        if ( position == 'left' ) {
            return ! this.isHeaderLeftIndented ();
        } else {
            return ! this.isHeaderRightIndented ();
        }
    }
    isDrawerAboveFooter( position ) {
        if ( position == 'left' ) {
            return ! this.isFooterLeftIndented ();
        } else {
            return ! this.isFooterRightIndented ();
        }
    }
}

AuroraBlueprint.defineElement();
