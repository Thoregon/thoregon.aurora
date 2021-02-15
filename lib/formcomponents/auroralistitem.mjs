/*
 * Copyright (c) 2021. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

/**
 *
 *
 * @author: Bernhard Lukassen
 */

import AuroraFormElement        from "./auroraformelement.mjs";

export default class AuroraListItem extends AuroraFormElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-listitem';
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
            component: 'component-listitem',
            templates: ['listitem'],
        }
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            graphictype: {
                default:        'none',
                type:           'string',
                description:    'select the leading graphic representation',
                group:          'Content',
                example:        'none | icon | icon-avatar | image-avatar | letter-avatar | thumbnail'
            },
            graphicstyle: {
                default:        'square',
                type:           'string',
                description:    'select the leading graphic style',
                group:          'Behavior',
                example:        'round | rounded | square'
            },
            graphiccontent: {
                default:        '',
                type:           'string',
                description:    'select the leading graphic content',
                group:          'Content',
                example:        'https://myimage.jpg'
            },

            primarytext: {
                default:        '',
                type:           'string',
                description:    'The primary text shown in the list item',
                group:          'Content',
                example:        'Martin Neitz'
            },
            secondarytext: {
                default:        '',
                type:           'string',
                description:    'The secondary text shown in the list item',
                group:          'Content',
                example:        'Forest Ranger'
            },
            separator: {
                default:        false,
                type:           'Boolean',
                description:    'Show an separator between the list elements',
                group:          'Behavior',
                example:        'true'
            },
        });
    }

    propertiesAsBooleanRequested() {
        return {
            disabled:     'isdisabled',
            separator:    'useseparator',
        };
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

        if ( propertiesValues['disabled'] ) { classes.push('disabled'); }
        if ( propertiesValues['fullwidth'] ) { classes.push('fullwidth'); }

        return classes;
    }

    async adjustContent(container) {
        container.classList.add("aurora-listitem-wrapper");
    }

    get appliedTemplateName() {
        return 'listitem';
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

AuroraListItem.defineElement();
