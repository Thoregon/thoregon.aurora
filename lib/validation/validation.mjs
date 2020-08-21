/**
 *
 *
 * @author: Martin Neitz
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
    validate() {
        console.log(this.validations);
        let self = this;
        this.validations.forEach(function(validationmethod){
            let isvalid = validationmethod.validate();
            if (  isvalid ) {
                let priority = validationmethod.priority();
                let sequence = self.errors.length + 1;
                let key = priority.concat( '-', sequence.toString() );
                self.errors[key] = validationmethod.defaultErrorMessage();
                console.log(self.errors);
            }
            console.log(isvalid);
        });
    }
}

export class ValidationMethod {
    constructor() {
    }
}
export class ValidationMethodEmpty extends ValidationMethod {
    errorID()             { return 'required'; }
    priority()            { return '00'; }
    defaultErrorMessage() { return 'Alles Gut'; }

    validate() {
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
