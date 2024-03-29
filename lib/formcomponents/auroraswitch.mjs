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

export default class AuroraSwitch extends AuroraFormElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-switch';
    }

    /*
     * aurora element features
     */

    get value() {
        return this.behavior?.value;
    }

    set value( value ) {
        if (this.beforeInit(() => { this.value = value })) return;
        if ( this.behavior ) {
            this.behavior.value = value;
        }
    }

    // theme ... component... templates

    switchToggled() {
        this.dispatchEvent( new Event ('value') );
    }

    get componentConfiguration() {
        return {
            theme: 'material',
            component: 'form-switch',
            templates: ['switch'],
        }
    }

    static get observedAttributes() {
        return [...super.observedAttributes, 'label', 'position' ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if ( ! this.container ) return;

        switch (name) {
            case 'label' :
                this.propertiesValues()['label'] = newValue;
                let label = this.container.querySelector('.aurora-label');
                label.innerHTML = newValue;
                break;
            case 'position':
                this.propertiesValues()['hint'] = newValue;
                let hint = this.container.querySelector('.aurora-hint');
                hint.innerHTML = newValue;
                break;
        }
        return super.attributeChangedCallback(name, oldValue, newValue);
    }

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
                example:        'Show my Avatar'
            },
            position: {
                default:        'right',
                type:           'string',
                description:    'where should the switch be in relation to the text',
                group:          'behavior',
                example:        'right | left'
            },
            hint: {
                default:        '',
                type:           'string',
                description:    'A short text describing the purpose of the field',
                group:          'Content',
                example:        'enable enhanced settings'
            },
        });
    }

    propertiesAsBooleanRequested() {
        return {
            label   : 'haslabel',
            disabled: 'isdisabled',
            hint    : 'hashint',
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
        if ( propertiesValues['position'] ) { classes.push('position-' + propertiesValues['position'] ); }

        return classes;
    }

    async adjustContent(container) {
        container.classList.add("aurora-switch-wrapper");
    }

    get appliedTemplateName() {
        return 'switch';
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

AuroraSwitch.defineElement();
