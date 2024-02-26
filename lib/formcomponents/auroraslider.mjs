/**
 *
 *
 * @author: Martin Neitz
 */

import AuroraFormElement from "./auroraformelement.mjs";
import IconResolver      from "../icons/iconresolver.mjs";

export default class AuroraSlider extends AuroraFormElement {

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
        return 'aurora-slider';
    }

    // theme ... component... templates

    get componentConfiguration() {
       return {
           theme            : 'material',
           component        : 'form-slider',
           templates        : ['slider'],
       }
    }

    getDefaultWidth() { return '300px'; }

    static get observedAttributes() {
        return [...super.observedAttributes, 'label', 'type','min', 'max', 'hint', 'leading_icon', 'trailing_icon', 'disabled', 'readonly' ];
    }

    static forwardedAttributes() {
        return Object.assign(super.forwardedAttributes(), {
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if ( ! this.container ) return;

        switch (name) {
            case 'label' :
                this.behavior.setLabel( newValue );
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
            min: {
                default:        0,
                type:           'number',
                description:    'specifies the minimum value allowed',
                group:          'Behavior',
                example:        '10'
            },
            max: {
                default    : 100,
                type       : 'number',
                description: 'specifies the maximum value allowed',
                group      : 'Behavior',
                example    : '100'
            },
            step: {
                default    : 0,
                type       : 'number',
                description: 'specifies the legal number intervals',
                group      : 'Behavior',
                example    : '10'
            },
            label: {
                default:        false,
                type:           'boolean',
                description:    'defines the position of the label',
                group:          'Content'
            },
            icon: {
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
            hint: {
                default    : '',
                type       : 'string',
                description: 'A short text describing the purpose of the field',
                group      : 'Content',
                example    : 'Enter your Password',
                i18n       : true
            },
        });
    }

    /**
     *
     * @returns {{leading_icon: string, trailing_icon: string, readonly: string, label: string, requered: string, modifications: string}}
     */
    propertiesAsBooleanRequested() {
        return {
            label                     : 'haslabel',
            required                  : 'isrequired',
            readonly                  : 'isreadonly',
            hint                      : 'hashint',
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

        if ( propertiesValues['required'] ) { classes.push('required'); }
        if ( propertiesValues['readonly'] ) { classes.push('readonly'); }
        if ( propertiesValues['fullwidth'] ) { classes.push('fullwidth'); }

        return classes;
    }

    get appliedTemplateName() {
        return 'slider';
    }

    async adjustContent(container) {
        container.classList.add("aurora-slider-wrapper");
    }


    get value() {
        if (!this.input) return;
        return this.input.value;
    }

    set value(value) {
        if (this.beforeInit()) return this.addInitFn(() => { this.value = value });
        if (!this.input) return;
        this.input.value = value;
        this.behaviorQ(() => this.behavior.valueChanged());
    }

    get input() {
        return this.container ? this.container.querySelector('input') : undefined;
    }

    /*
     * Exposed Events
     */

    exposedEvents() {
        return Object.assign(super.exposedEvents(), {
            change: {
                inner   : 'change',                // todo [OPEN]: handle changes of modification accuracy (change | key | none) -> use/implement 'this.updateExposedEvent()'
                select  : 'input'
            },
            value: {
                inner   : 'change',                // todo [OPEN]: handle changes of modification accuracy (change | key | none) -> use/implement 'this.updateExposedEvent()'
                select  : 'input'
            },
        });
    }

    /*
     * Lifecyle
     */

    connectedCallback() {
        super.connectedCallback();
        this._clickhandler = (evt) => {
            console.log('slider -> click');

        };
        this.addEventListener('click', this._clickhandler);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('click', this._clickhandler);
    }
}

// register as custom element
AuroraSlider.defineElement();
