/**
 *
 *
 * @author: Bernhard Lukassen
 */

import ThemeBehavior            from "../../themebehavior.mjs";
import { validationLevel }      from "../../../lib/common.mjs";

export default class Materialcheckbox extends ThemeBehavior {

    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;
    }

    getValue () {
        let checkbox = this.container.querySelectorAll("input")[0];

        if ( checkbox.multivalue ) {
            let checkboxValue = checkbox.getAttribute('val');
            const valueType   = checkbox.getAttribute('valtype');

            checkboxValue = this._typeConvert( checkboxValue, valueType );

            const values        = checkbox.multivalue;
            if (checkbox.checked) {
                if (! values.includes(checkboxValue)) {
                    values.push(checkboxValue);
                }
            } else {
                const index = values.indexOf(checkboxValue);
                if (index !== -1) {
                    values.splice(index, 1);
                }
            }
            return checkbox.multivalue;
        } else {
            return checkbox.checked;
        }
    }

    valueChanged( value ) {
        let checkbox      = this.container.querySelectorAll("input")[0];

        switch ( typeof value ) {
            case 'object':
                let checkboxValue = checkbox.getAttribute('val');
                const valueType   = checkbox.getAttribute('valtype');

                checkboxValue = this._typeConvert( checkboxValue, valueType );

                if (value.includes(checkboxValue)) {
                    checkbox.checked = true;
                } else {
                    checkbox.checked = false;
                }
                checkbox.multivalue = value;
                break;
            default:
                if ( value ) {
                    checkbox.checked = true;
                } else {
                    checkbox.checked = false;
                }
                checkbox.value = value;
                break;
        }


    }

    _typeConvert( value, convertTo = 'string' ) {

        switch ( convertTo ) {
            case 'number':
                return Number(value);
        }

        return value;
    }

    cleanErrors() {
        this.removeError();
        //--- validation level: immediate
        this.jar.isValid( validationLevel.immediate );
    }

    callbackClicked ( event ) {
        this.parentElement.querySelectorAll("label")[0].classList.add('aurora-floating-label--float-above');
        event.stopPropagation();
    }
    callbackKeyup( event ) {
        let container = event.target.parentElement.parentElement;
        let charactercounter = container.querySelectorAll(".mdc-text-field-character-counter");
        if ( charactercounter.length > 0 ) {
            container.querySelectorAll(".mdc-text-field-character-counter")[0].innerHTML = event.target.value.length;
        }
        event.stopPropagation();
    }

    callbackFocusIn ( event ) {
        console.log('focus event');
    }

    callbackFocusout ( event, container  ) {
        console.log("focus out...");
        if (! (event.target && event.target.value)) {
            event.target.parentElement.querySelectorAll("label")[0].classList.remove('aurora-floating-label--float-above');
        }
        this.container.getElementsByClassName("aurora-text-field")[0].classList.remove('focused');
        event.stopPropagation();
        //--- validation level: CHANGE
        this.jar.isValid( validationLevel.change );
    }

    removeError() {
        this.container.classList.remove('error');
        this.container.getElementsByClassName("aurora-text-field-error-text")[0].innerHTML = "";

    }
    reportError(errormsg) {
        this.container.classList.add('error');
        this.container.getElementsByClassName("aurora-text-field-error-text")[0].innerHTML = errormsg;

        console.log(this.jar);
    }

}
