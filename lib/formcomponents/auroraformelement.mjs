/**
 *
 *
 * @author: Bernhard Lukassen
 */

import AuroraElement        from "../auroraelement.mjs";

import {
    validationLevel,
    Validation,
    ValidationMethod,
    ValidationMethodEmpty
} from "/thoregon.aurora/lib/validation/validation.mjs";

// todo [OPEN]:
//  - default theme from universe e.g. `../themes/${universe.uitheme}.mjs`
//  - theme switchable?
import('../themes/material.mjs');

export default class AuroraFormElement extends AuroraElement {

    /**
     * connect to the viewmodel. add all listeners
     * @param viewmodel
     */
    connectViewModel(viewmodel) {
        viewmodel.addEventListener('value', (event) => this.valueChanged(event.detail));
    }

    valueChanged(value) {
        console.log('Aurora', 'value changed', value);
    }

    get valueEventName() {
        return 'change';
    }

    static get observedAttributes() {
        return ['value'];
    }

    exposedEvents() {
        return { ...super.exposedEvents(),
            value: {},
            change: {}
        }
    }

    /*
     * form element value
     */

    get value() {
        this.getAttribute('value');
    }

    set value(value) {
        if (this.beforeInit()) return this.addInitFn(() => { this.value = value });
        this.setAttribute('value', value);      // will modify the value of the in
    }

    get isAuroraFormElement() {
        return true;
    }

    /*
     * Element properties
     */

    /**
     * This array holds the definitions of the available properties of the element.
     * @returns {Object}
     */
    propertiesDefinitions() {

        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            class: {
                default:        '',
                type:           'string',
                description:    'Classes to be injected',
                group:          'Behavior',
                example:        'myClass'
            },
            id: {
                default:        '',
                type:           'string',
                description:    'ID of the elementt',
                group:          'Behavior',
                example:        'myID'
            },
            name: {
                default:        '',
                type:           'string',
                description:    'The name of the control.',
                group:          'Content',
                example:        'first_name'
            },
            theme: {
                default:        'material',
                type:           'string',
                description:    'This setting determines the appearance of the form element',
                group:          'Behavior',
                example:        'web ios android'
            },
            disabled: {
                default:        false,
                type:           'boolean',
                description:    'The field will be disabled, and the user can not enter',
                group:          'Behavior',
                example:        ''
            },
            fullwidth: {
                default:        false,
                type:           'boolean',
                description:    'Should the field use the full width of the surrounding container.',
                group:          'Behavior',
                example:        ''
            },
            validations: {
                default:        '',
                type:           'string',
                description:    'A list of validations which will be applied on the field, seperated by colon',
                group:          'Behavior',
                example:        'empty,iban'
            },
        });
    }

    transformPropertyAsBooleanValue( property, value ) {
        let booleanvalue = super.transformPropertyAsBooleanValue( property, value  );

        switch (property) {
            case 'disabled':
            case 'fullwidth':
                return true;
                break;
            default:
                return booleanvalue;
                break;
        }
    }

    /**
     * Element validation
     */

    isValid( value, level = validationLevel.change ) {

        let detail       = { level };
        //--- 1: flush errors
        const validation = this.validation;
        let hadErrors = validation.hasErrors();
        validation.flushErrors();
        //--- 2: validate
        validation.validate( value, level );
        //--- 3: if no error recorded -> true
        if ( validation.hasErrors() ) {
            this.behavior.reportError(validation.getError());
            detail.errors = validation.errors;
        } else {
            this.behavior.removeError();
            // send validate event to observers. if errors found so far, they also will be passed in the event object
            this.emit('validate', detail);
        }
        // todo [REFACTOR]: better check: compare which errors had been with current errors to find out if validdate has changed
        /*if (hadErrors !== validation.hasErrors())*/ this.emit('valid-state', { errors: this.errors });
    }

    hasErrors() {
        return this.validation ? this.validation.hasErrors() : false;
    }

    get errors() {
        return (this.validation) ? this.validation.errors : {};
    }

    structuredErrors() {
        let errors = {};
        if (this.validation.hasErrors()) errors[this.auroraname] = this.validation.errors;
        return errors;
    }

    reportErrors(errors) {
        this.behavior.reportError(errors);
    }

    get validation() {
        if ( ! this._validation ) {
            this.buildValidation();
        }
        return this._validation;
    }

    buildValidation() {
       let validation = new Validation();
       if ( this.propertiesValues()['required'] ) {
           validation.add( new ValidationMethodEmpty( this ) );
       }

       let validations = this.propertiesValues()['validations'].trim();
       if ( validations != '' ) {
           validations = validations.split(',').map(item => item.trim());
           for (let validationMethod of validations) {
               validation.use(validationMethod);
           }
       }

       this._validation = validation;
    }

    addValidation(validationClass, message) {

    }

    removeClassesWithPrefix(element, prefix ) {
        let classes = element.className.split(" ").filter(function(c) {
            return c.lastIndexOf(prefix, 0) !== 0;
        });
        element.className = classes.join(" ").trim();
    }

}
