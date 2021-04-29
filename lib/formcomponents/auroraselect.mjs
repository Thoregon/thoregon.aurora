/*
 * Copyright (c) 2021.
 */

/**
 *
 *
 * @author: Bernhard Lukassen
 */

import AuroraFormElement from "./auroraformelement.mjs";

export default class AuroraSelect extends AuroraFormElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-select';
    }

    // theme ... component... templates

    get componentConfiguration() {
       return {
           theme            : 'material',
           component        : 'form-select',
           templates        : ['select'],
       }
    }

    getDefaultWidth() { return '300px'; }

    /**
     * This array holds the definitions of the available properties of the element.
     * @returns {{stack_label: {default: boolean, description: string, type: string, group: string, example: string}, leading_icon: {default: string, description: string, type: string, group: string, example: string}, trailing_icon: {default: string, description: string, type: string, group: string, example: string}, readonly: {default: boolean, description: string, type: string, group: string, example: string}, name: {default: string, description: string, type: string, group: string, example: string}, theme: {default: string, description: string, type: string, group: string, example: string}, disabled: {default: boolean, description: string, type: string, group: string, example: string}, label: {default: string, description: string, type: string, group: string, example: string}, requered: {default: boolean, description: string, type: string, group: string, example: string}, value: {default: string, description: string, type: string, group: string, example: string}, modifications: {default: string, description: string, type: string, group: string, example: string}}}
     */
    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            label: {
                default:        '',
                type:           'string',
                description:    'A text Label that will describe the Field',
                group:          'Content',
                example:        'FirstName'
            },
            placeholder: {
                default:        '',
                type:           'string',
                description:    'A text which is shown as a placeholder in the Field',
                group:          'Content',
                example:        'your first name'
            },
            stack_label: {
                default:        false,
                type:           'boolean',
                description:    'defines the position of the label',
                group:          'Content',
                example:        'true'
            },
            value: {
                default:        '',
                type:           'string',
                description:    'The value of the control.',
                group:          'Content',
                example:        ''
            },
            leading_icon: {
                default:        '',
                type:           'string',
                description:    'Name of the icon to be used infront of the field',
                group:          'Content',
                example:        'globe'
            },
            required: {
                default:        false,
                type:           'boolean',
                description:    'The field will be disabled, and the user can not enter',
                group:          'Behavior',
                example:        ''
            },
            readonly: {
                default:        false,
                type:           'boolean',
                description:    'The field will be readonly, and the user can not enter',
                group:          'Behavior',
                example:        ''
            },
            modifications: {
                default:        'none',
                type:           'string',
                description:    'defines the accuracy of modification events; one of [ \'none\' | \'key\' | \'change\' ]',
                group:          'Behavior',
                example:        '',
                /* todo
                                values:         [ 'none' | 'key' | 'change' ],
                                observe:        true
                */
            }
        });
    }

    /**
     *
     * @returns {{leading_icon: string, trailing_icon: string, readonly: string, label: string, requered: string, modifications: string}}
     */
    propertiesAsBooleanRequested() {
        return {
            leading_icon      : 'usesleadingicon',
            label             : 'haslabel',
            required          : 'isrequired',
            readonly          : 'isreadonly',
            modifications     : 'change',
            hint              : 'hashint',
        };
    }

    /**
     *  routine to add all needed classes.
     *  This only can be done on the element level as it will be differ from element to element
    */
    collectClasses() {
        //--- 1: first get the classes added from the dom element
        //--- 2: analyse the transferred attributes
        let classes = [];
        let propertiesValues = this.propertiesValues();

        if ( propertiesValues['usesleadingicon'] )  { classes.push('with-leading-icon'); }

        if ( propertiesValues['required'] ) { classes.push('required'); }
        if ( propertiesValues['disabled'] ) { classes.push('disabled'); }
        if ( propertiesValues['readonly'] ) { classes.push('readonly'); }

        if ( propertiesValues['fullwidth'] ) { classes.push('fullwidth'); }

        return classes;
    }

    get appliedTemplateName() {
        return 'select';
    }

    async adjustContent(container) {
        container.classList.add("aurora-select-wrapper");
    }

    /*
     * Inner Properties
     */
/*
    forwardedProperties() {
        return Object.assign(super.forwardedProperties(), {
            value: { select: 'input' }
        });
    }
*/

    get value() {
        if (!this.input) return;
        return this.input.value;
    }

    set value(value) {
        if (!this.input) return;
        this.input.value = value;
        this.behaviorQ(() => this.behavior.valueChanged());
    }

    get input() {
        return this.container ? this.container.querySelector('input') : undefined;
    }

    /*
     * aurora element features
     */

    get isInput() {
        return true;
    }

    /*
     * Inner Attributes
     */

/*
    forwardedAttributes() {
        return Object.assign(super.exposedEvents(), {
            value: { select: 'input' }
        });
    }
*/

    /*
     * Exposed Events
     */

    exposedEvents() {
        return Object.assign(super.exposedEvents(), {
            value: {
                inner   : 'change',                // todo [OPEN]: handle changes of modification accuracy (change | key | none) -> use/implement 'this.updateExposedEvent()'
                select  : 'input'
            }
        });
    }

    /*
     * Lifecyle
     */

    connectedCallback() {
        super.connectedCallback();
        this._clickhandler = (evt) => {
            console.log('textinput -> click');

        };
        this.addEventListener('click', this._clickhandler);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('click', this._clickhandler);
    }
}

// register as custom element
AuroraSelect.defineElement();
