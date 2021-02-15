/*
 * Copyright (c) 2021.
 */

import AuroraElement from "../../auroraelement.mjs";

export default class AuroraBlueprint extends AuroraElement {


    constructor() {
        super();
        this.blueprintParts = [];
    }

    applyChildElements(container) {
        super.applyChildElements(container);
    }

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-blueprint';
    }

    /*
     * aurora element features
     */

    get isTrigger() {
        return true;
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

    get templateElements() {
        return {
            theme: 'material',
            component: 'layout-blueprint',
            templates: ['blueprint'],
        }
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
        });
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
