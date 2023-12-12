/*
 * Copyright (c) 2023.
 */

/**
 *
 *
 * @author: Bernhard Lukassen
 */

import AuroraFormElement from "./auroraformelement.mjs";
import {AuroraListHandlerGrid, AuroraListHandlerTable} from "../component-list/auroralist.mjs";

export default class AuroraMultiSelect extends AuroraFormElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-multiselect';
    }

    // theme ... component... templates

    get componentConfiguration() {
       return {
           theme            : 'material',
           component        : 'form-multiselect',
           templates        : ['multiselect'],
       }
    }

    getDefaultWidth() { return '300px'; }

    set optionsdata(optionsData) {
        if (this._optionsdata == optionsData) return;

        this.addInitFn((async () => {

            let current = this.value;
            let select  = this.select;

            let options = '';
            for (const [key, value] of Object.entries(optionsData)) {
                options += '<option value ="';
                options += key + '"';

                if ( current && current == key ) {
                    options += ' selected';
                }

                options += '>';
                options += value;
                options += '</option>';
            }
            select.innerHTML = options;
            return options;
        }));

        this._optionsdata = optionsData;
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
            taxonomy: {
                default:        '',
                type:           'string',
                description:    'Name ( Slug ) of the taxonomy used',
                group:          'Content',
                example:        'productcategories'
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
        return 'multiselect';
    }

    async adjustContent(container) {
        container.classList.add("aurora-multiselect-wrapper");
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

//        this._optionDefinitionType = 'html';
        this._optionDefinitionType = 'taxonomy';

        switch (this._optionDefinitionType) {
            case 'function' :
                this._functionOptions = this.extractFunctionOptions();
            case 'taxonomy' :
                this.extractTaxonomyOptions();
                break;
            case 'html':
                this.extractHTMLOptions();
                break;
        }
    }
    extractHTMLOptions() {

        const options = this.querySelectorAll('option');

        if (options.length === 0)          return;
        if (this._optionsHTML == options ) return;

        const optionElements = [...options];

        let optionValues = {};
        optionElements.forEach((optionElement) => {

            const value =  optionElement.innerHTML;
            const key   =  optionElement.getAttribute('value') ?? value;

            optionValues[key] = value;
        });

        this.behavior.options = optionValues;
        this._optionsHTML = options;
    }

    extractFunctionOptions() {
        const options = "<option value=''>function based options are not implemented yet</option>";
        if (this._optionsFunction == options ) return;

        this._optionsFunction = options;
    }

    extractTaxonomyOptions() {
        this.behavior.options = {  martin: "MARTIN NEITZ" };
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
        return this.behavior?.getValue();
    }

    set value(value) {
        if (this.beforeInit()) return this.addInitFn(() => { this.value = value });
        this.behavior.valueChanged( value );
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
AuroraMultiSelect.defineElement();
