/**
 *
 *
 * @author: Martin Neitz
 */

/*
 * Behaviour context of validations:
 * - immediately    the validation is evaluated at every keystroke/input, also mouse moves
 *                  the status is displayed in a context to the input, user must be able to see why and where
 * - change         the validation is evaluated when a property of the model (also the view model!) is changed
 *                  the status is displayed in a context to the input, user must be able to see why and where
 *                  validations which includes multiple properties will also be evaluated here
 * - transaction    the validation is evaluated when a modifying transaction starts
 *                  validation which include multiple entities are evaluated here. this may concern
 *                  longer lasting checks caused by complex queries.
 */

/**
 *  create an instance based on the input field
 *  validation::withElement();
 *
 *  validation->add( validationMethod )
 *  validation->isValid( )
 *
 *  validationMethod()
 *      method_id  e.g. empty
 *                      requered     = "please enter something..."
 *                      type_email
 *                      type_url
 *                      function()
 */

import { validationLevel } from "../common.mjs";

export class Validation {
    constructor() {
        this.errors = [];
        this.validations = [];
    }

    flushErrors() {
        this.errors = [];
    }
    add( validationmethod ) {
        this.validations.push(validationmethod);
    }
    validate( level ) {
        let self = this;
        this.validations.forEach(function(validationmethod){
            if ( level == validationmethod.level() ) {
                let isvalid = validationmethod.validate();
                if (!isvalid) {
                    let priority = validationmethod.priority();
                    let sequence = self.errors.length + 1;
                    let key = priority.concat('-', sequence.toString());
                    self.errors[key] = validationmethod.defaultErrorMessage();
                }
            }
        });
    }

    hasErrors() {
        return this.errors && this.errors.length !== 0;
    }
}

export class ValidationMethod {
    constructor() {
    }
}
export class ValidationMethodEmpty extends ValidationMethod {
    errorID()             { return 'required'; }
    level()               { return  validationLevel.change; }
    priority()            { return '00'; }
    defaultErrorMessage() { return 'Alles Gut'; }

    validate() {
        return false;

        if ( true ) {    // value is ok
            return true;
        } else {         // value is not ok
            return false;
        }
    }
}
export class ValidationMethodRequired extends ValidationMethod {
    static get errorID()             { return 'required'; }
    static get defaultErrorMessage() { return 'Field is required'; }

    validate() {
        if ( true ) {    // value is ok
            return true;
        } else {         // value is not ok
            return false;
        }
    }
}
