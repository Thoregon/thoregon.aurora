/*
 * Copyright (c) 2021.
 */

/**
 *
 *
 * @author: Bernhard Lukassen
 */

import AuroraFormElement      from "./auroraformelement.mjs";
import AuroraAttributeSupport from "../auroraattributes/auroraattributesupport.mjs";

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

    set optionsdata(optionsData) {
        if (this._optionsdata == optionsData) return;

        this.addInitFn((async () => {

            let current = this.value;
            let select  = this.select;

            const format = this.detectOptionsDataFormat(optionsData);

            let result = '';

            switch (format) {
                case 'key-value' :
                    result = this.prepareOptionsDataKeyValue(current, optionsData);
                    break;
                case 'array' :
                    result = this.prepareOptionsDataArray(current, optionsData);
                    break;
                case 'grouped' :
                    result = this.prepareOptionsDataGrouped(current, optionsData);
                    break;
            }

            if (!result.valueInOptions) {
                this.value = result.firstValue;
                this.emit("change", {element: this});
            }

            select.innerHTML = result.options;
            return result.options;
        }));

        this._optionsdata = optionsData;
    }

    prepareOptionsDataKeyValue(current,optionsData) {
        /*
            { afg: 'Afghanistan',
              alb: 'Albania'
            };
        */

        let valueFoundInOptions = false;
        let firstValue          = '';
        let firstElement        = true;
        let options             = '';

        for (const [key, value] of Object.entries(optionsData)) {

            if (firstElement) {
                firstValue   = value;
                firstElement = false;
            }

            const selected = ( current && current == key ) ? 'selected' : '';
            valueFoundInOptions = !!selected || valueFoundInOptions;
            options += `<option value ="${key}" ${selected} >${value}</option>`;
        }
        return {
            options       : options,
            firstValue    : firstValue,
            valueInOptions: valueFoundInOptions
        };
    }
    prepareOptionsDataArray(current, optionsData) {
        /*
            [
                { code: 'afg', name: 'Afghanistan' },
                { code: 'alb', name: 'Albania' }
            ]
        */

        let valueFoundInOptions = false;
        let firstValue          = '';
        let firstElement        = true;
        let options             = '';

        for (const option of optionsData) {

            if (firstElement) {
                firstValue   = option.code;
                firstElement = false;
            }

            const selected = ( current && current == option.code ) ? 'selected' : '';
            valueFoundInOptions = !!selected || valueFoundInOptions;
            options += `<option value ="${option.code}" ${selected} >${option.name}</option>`;
        }

        return {
            options       : options,
            firstValue    : firstValue,
            valueInOptions: valueFoundInOptions
        };
    }
    prepareOptionsDataGrouped(current, optionsData) {
        /*
          {
           European: [
                { code: 'de', name: 'Germany' },
                { code: 'fr', name: 'France' }
            ],
            Asian: [
                { code: 'jp', name: 'Japan' },
                { code: 'cn', name: 'China' }
            ]
          }
        */

        let valueFoundInOptions = false;
        let firstValue          = '';
        let firstElement        = true;
        let options             = '';

        for (const group in optionsData) {
            if (optionsData.hasOwnProperty(group)) { // Check if the property belongs to the object itself

                if ( group != 'Other') {
                    options += `<optgroup label="${group}">`;
                }

                // Loop over the array of objects within the current group
                optionsData[group].forEach(option => {

                    if (firstElement) {
                        firstValue   = option.code;
                        firstElement = false;
                    }

                    const selected = ( current && current == option.code ) ? 'selected' : '';
                    valueFoundInOptions = !!selected || valueFoundInOptions;
                    options += `<option value ="${option.code}" ${selected} >${option.name}</option>`;
                });

                if ( group != 'Other') {
                    options += `</optgroup>`;
                }
            }
        }
        return {
            options       : options,
            firstValue    : firstValue,
            valueInOptions: valueFoundInOptions
        };
    }

    detectOptionsDataFormat(optionData) {
        if (Array.isArray(optionData)) {
            // Check if it's an array of objects with 'code' and 'name' properties
            if (optionData.every(item => typeof item === 'object' && 'code' in item && 'name' in item)) {
                return "array";
            }
        } else if (typeof optionData === 'object' && optionData !== null) {
            // Check if it's an object with key-value pairs where the value is a string
            const values = Object.values(optionData);
            if (values.every(value => typeof value === 'string')) {
                return "key-value";
            }

            // Check if it's an object with key-value pairs where the value is an array of objects with 'code' and 'name' properties
            if (values.every(value =>
                Array.isArray(value) && value.every(item => typeof item === 'object' && 'code' in item && 'name' in item)
            )) {
                return "grouped";
            }
        }

        return "Unknown format";
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
            elevation: {
                default:        '2',
                type:           'string',
                description:    'the elevation level of this component',
                group:          'Styling',
                example:        '0-5'
            },

            optionsdata : {
                default    : '',
                type       : 'string',
                description: 'define the function of the ViewModel which is responsible to return the used options',
                group      : 'Content',
                example    : 'myOptions'
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

    async existsConnect() {
        await super.existsConnect();

        let options = this.extractOptions();
/*
        if ( Object.keys(options).length > 0 ) {
            this.options(options);
        }
*/
        this.behavior.attach(this);
    }

    extractOptions() {

        const propertiesValues = this.propertiesValues();
        const optionFunction = propertiesValues['optionsdata'];

        this._optionDefinitionType = 'html';

        switch (this._optionDefinitionType) {
            case 'function' :
                this._functionOptions = this.extractFunctionOptions();
            case 'html':
                this.extractHTMLOptions();
                break;
        }
    }
    extractHTMLOptions() {
        if (this._optionsHTML) return;

        let current = this.value;
        let select  = this.select;

        const options = this.children;

        if (options) {
            const firstOptionValue = options[0].value;

            const optionsArray = Array.from(options);
            // Check if any option's value matches myValue
            const valueInOptions = optionsArray.some(option => option.value == current);

            select.innerHTML = '';
            [...options].forEach((option) => select.appendChild(option));
            this._optionsHTML = true;

            const validate = options;

            if (!valueInOptions) {
                this.value = firstOptionValue;
                this.emit("change", {element: this});
            }

            //--- select the value again
            if (current) this.value = current;
        }

    }
    extractFunctionOptions() {
        const options = "<option value=''>function based options are not implemented yet</option>";
        if (this._optionsFunction == options ) return;

        this._optionsFunction = options;
    }

    options(options) {

        options = options ?? {}     // always nnt undefined
        // check if options has changed
        if (this.sameOptions(options)) return;

        let current = this.value;
        let select  = this.select;
        this._options = options;
        select.innerHTML = "";
        return;
        const trans = globalThis.app?.getTranslator() ?? this.i18n;

        for ( const [key, value] of Object.entries( options ) ) {

            let result = this.resolveI18n( value );
            let text   = result.defaultText;
            if (result.token) {
                text = result.subtoken ? trans(result.token, result.subtoken) : trans(result.token);
            }

            let newOption = new Option(text, key);
            // if ( result.i18nAttribute != '' ) {
            //     newOption.setAttribute("aurora-i18n", result.i18nAttribute );
            // }
            select.add(newOption,undefined);
        }
        // select the value again
        if (current) this.value = current;
    }

    sameOptions(options) {
        // JSON stringify does consider the order of the keys. If the order changes, the objects are not equal anymore which is the expected behavior (change order of options)
        return (options === this._options) || (JSON.stringify(options) === JSON.stringify(this._options ?? {}));
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
        if (!this.select) return;
        return  (this.select.value != '' &&
                 this.select.value != undefined)
                ?this.select.value
                :this._value;

    }

    set value(value) {
        if (this.beforeInit()) return this.addInitFn(() => { this.value = value });
        this._value = value;
        if (!this.select) return;
        this.select.value = value;
        this.behaviorQ(() => this.behavior.valueChanged(value));
    }

    get select() {
        return this.container?.querySelector('select');
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
                select  : 'select'
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
