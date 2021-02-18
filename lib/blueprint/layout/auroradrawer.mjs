/*
 * Copyright (c) 2021.
 */

import AuroraElement from "../../auroraelement.mjs";

export default class AuroraDrawer extends AuroraElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-drawer';
    }

    /*
     * aurora element features
     */

    get isTrigger() {
        return true;
    }

    /*
     * Structure
    */

    connect() {
        let blueprint = this.getAuroraBlueprint();
        this.blueprint = blueprint;
        blueprint[this.isLeft() ? 'drawerLeft' : 'drawerRight'] = this;
    }

    isLeft() {
        return this.getAttribute('pos') !== 'right';
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
            component: 'blueprint-drawer',
            templates: ['drawer'],
        }
    }



    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            width: {
                default:        '25%',
                type:           'text',
                description:    'How much Space will be used for the drawer',
                group:          'Behavior',
                example:        '250px'
            },
            dense: {
                default:        false,
                type:           'boolean',
                description:    'will remove the left and right padding of the drawer',
                group:          'Behavior',
                example:        'true'
            },
            pos: {
                default:        'left',
                type:           'text',
                description:    'left or right position of the drawer',
                group:          'Behavior',
                example:        'left'
            },
        });
    }

    propertiesAsBooleanRequested() {
        return {
        };
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
        container.classList.add("aurora-drawer-wrapper");
    }

    get appliedTemplateName() {
        return 'drawer';
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

AuroraDrawer.defineElement();
