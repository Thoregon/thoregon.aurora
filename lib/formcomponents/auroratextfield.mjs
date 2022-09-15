/**
 *
 *
 * @author: Bernhard Lukassen
 */

import AuroraFormElement from "./auroraformelement.mjs";
import IconResolver      from "../icons/iconresolver.mjs";

export default class AuroraTextField extends AuroraFormElement {

    constructor() {
        super();
        this._iconresolver = new IconResolver();
        this.resolveIcon = ( icon ) => this._iconresolver.resolveIcon(icon);
    }

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-inputtext';
    }

    // theme ... component... templates

    get componentConfiguration() {
       return {
           theme            : 'material',
           component        : 'form-textfield',
           templates        : ['textfield'],
       }
    }

    getDefaultWidth() { return '300px'; }

    static get observedAttributes() {
        return [...super.observedAttributes, 'label', 'placeholder', 'hint', 'leading_icon', 'trailing_icon' ];
    }

    static forwardedAttributes() {
        return Object.assign(super.forwardedAttributes(), {
            placeholder: { select: 'input' }
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if ( ! this.container ) return;

        switch (name) {
            case 'label' :
                this.propertiesValues()['label'] = newValue;
                let label = this.container.querySelector('.aurora-label');
                label.innerHTML = newValue;
                break;
            case 'hint':
                this.propertiesValues()['hint'] = newValue;
                let hint = this.container.querySelector('.aurora-hint');
                hint.innerHTML = newValue;
                break;
            case 'leading_icon':
                let leading_icon_html = this.resolveIcon( newValue ).icon_html;
                let leading_icon = this.container.querySelector('.aurora-icon.aurora-leading-icon');
                leading_icon.innerHTML = leading_icon_html;
                break;
            case 'trailing_icon':
                let trailing_icon_html = this.resolveIcon( newValue ).icon_html;
                let trailing_icon = this.container.querySelector('.aurora-icon.aurora-trailing-icon');
                trailing_icon.innerHTML = trailing_icon_html;
                break;
        }
        return super.attributeChangedCallback(name, oldValue, newValue);
    }

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
            type: {
                default:        'text',
                type:           'string',
                description:    'Input type',
                group:          'Content',
                example:        'number | password | textarea'
            },
            label: {
                default    : '',
                type       : 'string',
                description: 'A text Label that will describe the Field',
                group      : 'Content',
                example    : 'FirstName'
            },
            placeholder: {
                default    : '',
                type       : 'string',
                description: 'A text which is shown as a placeholder in the Field',
                group      : 'Content',
                example    : 'your first name'
            },
            stack_label: {
                default:        false,
                type:           'boolean',
                description:    'defines the position of the label',
                group:          'Content'
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
            trailing_icon: {
                default:        '',
                type:           'string',
                description:    'Name of the icon to be used after of the field',
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
            character_counter: {
                default:        false,
                type:           'boolean',
                description:    'The field will be readonly, and the user can not enter',
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
            hint: {
                default    : '',
                type       : 'string',
                description: 'A short text describing the purpose of the field',
                group      : 'Content',
                example    : 'Enter your Password',
                i18n       : true
            },

            elevation: {
                default:        '0',
                type:           'string',
                description:    'the elevation level of this component',
                group:          'Styling',
                example:        '0-5'
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
            leading_icon              : 'usesleadingicon',
            trailing_icon             : 'usestrailingicon',
            character_counter         : 'usecharactercounter',
            label                     : 'haslabel',
            required                  : 'isrequired',
            readonly                  : 'isreadonly',
            modifications             : 'change',
            hint                      : 'hashint',
            stack_label               : 'usestackedlabel'
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
        if ( propertiesValues['usestrailingicon'] ) { classes.push('with-trailing-icon'); }

        if ( propertiesValues['required'] ) { classes.push('required'); }
        if ( propertiesValues['disabled'] ) { classes.push('disabled'); }
        if ( propertiesValues['readonly'] ) { classes.push('readonly'); }

        if ( propertiesValues['fullwidth'] ) { classes.push('fullwidth'); }

        return classes;
    }

    calculatedValues() {
        let attributes = {};
        let properties = this.propertiesValues();

        attributes['leading_icon_html'] =   ( properties.usesleadingicon )
                                            ? this.resolveIcon(properties.leading_icon).icon_html
                                            : '';
        attributes['trailing_icon_html'] =  ( properties.usestrailingicon )
                                            ? this.resolveIcon(properties.trailing_icon).icon_html
                                            : '';

        return attributes;
    }

    get appliedTemplateName() {
        return 'textfield';
    }

    async adjustContent(container) {
        container.classList.add("aurora-textfield-wrapper");
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
            },
            keyup: {
                select : 'input'
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
AuroraTextField.defineElement();
