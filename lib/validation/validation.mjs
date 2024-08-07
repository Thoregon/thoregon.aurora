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


export const validationLevel = {
    "immediate" : ['immediate'],
    "change"    : ['change','immediate'],
    "submit"    : ['submit','change','immediate']
};

const validationRegistry = {};

export class Validation {
    constructor() {
        this.errors = {};
        this.validations = [];
    }

    static registerValidation(name, validator) {
        if (!name || !validator) return;
        validationRegistry[name] = validator;
    }

    static getValidation(name) {
        return validationRegistry[name];
    }

    flushErrors() {
        this.errors = {};
    }

    use(name) {
        const validator = Validation.getValidation(name);
        if (!validator) return;

        this.add(validator);
    }

    add( validationmethod ) {
        this.validations.push(validationmethod);
    }
    validate( value,level ) {

        for (let validationmethod of this.validations) {
            if ( level.includes( validationmethod.level() ) ) {
                let isvalid = validationmethod.validate(value);
                if (!isvalid) {
                    let priority = validationmethod.priority();
                    let sequence = this.errors?.length || 0;
                    sequence++;
                    let key          = priority.concat('-', sequence.toString());
                    this.errors[key] = validationmethod.defaultErrorMessage();
                }
            }
        };
    }

    hasErrors() {
        let keys = Object.keys( this.errors ).length;
        return keys > 0;
    }

    getError() {
        let keys = Object.keys(this.errors);
        keys.sort();
        return this.errors[keys[0]];
    }

}

export class ValidationMethod {
    constructor( auroraFormElement ) {
        console.log("validation method created");
        this._auroraFormElement = auroraFormElement;
    }

    get formElement() {
        return this._auroraFormElement;
    }
}

export class ValidationMethodEmpty extends ValidationMethod {
    errorID()             { return 'required'; }
    level()               { return  'change'; }
    priority()            { return '00'; }
    defaultErrorMessage() { return 'This Field is required! please enter Information'; }

    validate() {
        let length = this.formElement.value.length;
        if (length > 0 ) {
            return true;
        }
        return false;
    }
}

Validation.registerValidation('empty', new ValidationMethodEmpty());

export class ValidationMethodRequired extends ValidationMethod {
    static get errorID()             { return 'required'; }
    static get defaultErrorMessage() { return 'Field is required'; }

    validate( value ) {
        if ( true ) {    // value is ok
            return true;
        } else {         // value is not ok
            return false;
        }
    }
}

Validation.registerValidation('required', new ValidationMethodRequired());
