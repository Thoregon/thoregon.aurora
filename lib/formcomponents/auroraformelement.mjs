/**
 *
 *
 * @author: Bernhard Lukassen
 */

import AuroraElement        from "../auroraelement.mjs";
import { validationLevel }  from "../common.mjs";
import { Validation ,
         ValidationMethod,
         ValidationMethodEmpty
       } from "../validation/validation.mjs";

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

    static get observedAttributes() {
        return ['value'];
    }

    /*
     * aurora element features
     */

    get isInput() {
        return false;
    }

    get isTrigger() {
        return false;
    }

    /*
     * form element value
     */

    get value() {
        this.getAttribute('value');
    }

    set value(value) {
        this.setAttribute('value', value);      // will modify the value of the in
    }

    /**
     *  todo: cascade of field definitions
     *  todo: counter
     *  todo: model  -> View Model Design
     *  todo: validations and errors
     *  todo: make own CSS for text Field
     *  todo: add text type
     *
     */

    /**
     * Will return all attributes which are filled on the aurora element
     * @returns {{}}
     */
    transferredAttributes() {
        let attributesTransferred = {};
        [...this.attributes].forEach(attribute => attributesTransferred[attribute.name] = attribute.nodeValue);
        return attributesTransferred;
    }

    /**
     * Will return the width of the element
     * TODO: need to include the width attribute
     * @returns {string}
     */
    getStyleWidth() {
        let size = this.getDefaultWidth();

        let propertiesValues = this.propertiesValues();
        if ( propertiesValues['fullwidth'] ) {
            size = '100%';
        }
        return size;
    }


    /**
     * Will return all defined variables with the transferred/default values.
     * It will also include additional attributes defined as BooleanRequest from the calling
     * aurora element.
     * @returns {{}}
     */
    propertiesValues() {
        var propertiesValues = {};
        var defaults   = this.propertiesDefaultValues();
        var attributes = this.transferredAttributes();
        var asBoolean  = this.propertiesAsBooleanRequested();

        for (var prop of Object.keys( defaults ) ) {
            if ( attributes.hasOwnProperty( prop ) ) {
                if ( attributes[prop] === '' ) {
                    propertiesValues[prop] = true;
                } else {
                    propertiesValues[prop] = attributes[prop];
                }
            } else {
                propertiesValues[prop] = defaults[prop];
            }
            if ( asBoolean.hasOwnProperty( prop ) ) {
                if ( propertiesValues[prop] &&
                     propertiesValues[prop] != '' ) {
                    propertiesValues[ asBoolean[prop] ] = true;
                } else {
                    propertiesValues[ asBoolean[prop] ] = false;
                }
            }
        }
        return propertiesValues;
    }

    /**
     * This array describes addtional attributes which most time are used in the themplate engine
     *
     * @returns {{attribute: booleanrepresentation,}}
     */
    propertiesAsBooleanRequested() { return {};}

    /**
     * Returns an array with all the defined default values.
     * @returns {{}}
     */
    propertiesDefaultValues() {
        var defaultValues = {};
        for ( var i in this.propertiesDefinitions() ) {
            defaultValues[i] = this.propertiesDefinitions()[i]['default'];
        }
        return defaultValues;
    }

    /**
     * This array holds the definitions of the available properties of the element.
     * @returns {{stack_label: {default: boolean, description: string, type: string, group: string, example: string}, leading_icon: {default: string, description: string, type: string, group: string, example: string}, trailing_icon: {default: string, description: string, type: string, group: string, example: string}, readonly: {default: boolean, description: string, type: string, group: string, example: string}, name: {default: string, description: string, type: string, group: string, example: string}, theme: {default: string, description: string, type: string, group: string, example: string}, disabled: {default: boolean, description: string, type: string, group: string, example: string}, label: {default: string, description: string, type: string, group: string, example: string}, requered: {default: boolean, description: string, type: string, group: string, example: string}, value: {default: string, description: string, type: string, group: string, example: string}, modifications: {default: string, description: string, type: string, group: string, example: string}}}
     */
    propertiesDefinitions() {

        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        return {
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
        };
    }

    get isAuroraFormElement() {
        return true;
    }

    /**
     * Element validation
     */

    isValid( level = validationLevel.change ) {
        let detail       = { level };
        //--- 1: flush errors
        const validation = this.validation;
        let hadErrors = validation.hasErrors();
        validation.flushErrors();
        //--- 2: validate
        validation.validate( level );
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
       this._validation = validation;
    }
}
