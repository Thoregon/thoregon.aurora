/*
 * Copyright (c) 2021.
 */

import AuroraElement from "../../auroraelement.mjs";

export default class AuroraBlueprint extends AuroraElement {

    async existsConnect() {
        let style = this.uicontainer.adjustContainerContentAsStyle();
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

        this.layoutHeader = undefined;
        this.layoutFooter = undefined;
    }

    applyChildElements(container) {
        super.applyChildElements(container);
    }

    getAuroraBlueprint() {
        return this;
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

    /*
    *  Header behavior
     */

    getLayoutForHeader() {
        if ( this.layoutHeader === undefined ) {
            let propertiesValues = this.propertiesValues();
            this.layoutHeader = propertiesValues['layout'].substring(0,3);
        }
        return this.layoutHeader;
    }
    isHeaderFixed() {
        return this.getLayoutForHeader().substring(1,2) === 'H';
    }
    isHeaderAbsolute() {
        return ! this.isHeaderFixed();
    }

    /*
    *  Footer behavior
    */

    getLayoutForFooter() {
        if ( this.layoutFooter === undefined ) {
            let propertiesValues = this.propertiesValues();
            this.layoutFooter = propertiesValues['layout'].substring(8,11);
        }
        return this.layoutFooter;
    }
    isFooterFixed() {
        return this.getLayoutForFooter().substring(1,2) === 'F';
    }
    isFooterAbsolute() {
        return ! this.isFooterFixed();
    }

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

AuroraBlueprint.defineElement();
