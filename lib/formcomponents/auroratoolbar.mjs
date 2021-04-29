/*
 * Copyright (c) 2021. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

/**
 * @author: Martin Neitz
 */

import AuroraFormElement        from "./auroraformelement.mjs";

export default class AuroraToolbar extends AuroraFormElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-toolbar';
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

    get componentConfiguration() {
        return {
            theme: 'material',
            component: 'toolbar',
            templates: ['toolbar'],
        }
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            title: {
                default:        '',
                type:           'string',
                description:    'the title of the toolbar',
                group:          'Content',
                example:        'MyFirstApp'
            }
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
        //--- 1: first get the classes added from the dom element
        //--- 2: analyse the transferred attributes
        let classes = [];
        let propertiesValues = this.propertiesValues();

        return classes;
    }

    async adjustContent(container) {
        container.classList.add("aurora-toolbar-wrapper");
    }

    get appliedTemplateName() {
        return 'toolbar';
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

AuroraToolbar.defineElement();
