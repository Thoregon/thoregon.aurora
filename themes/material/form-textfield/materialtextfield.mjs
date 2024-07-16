/**
 *
 *
 * @author: Bernhard Lukassen
 */

import ThemeBehavior            from "../../themebehavior.mjs";
import { validationLevel }      from "/thoregon.aurora/lib/validation/validation.mjs";

export default class MaterialTextField extends ThemeBehavior {

    rootElement = '';

    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;

        let leadingIcon = this.container.querySelector('.aurora-leading-icon');
        if (leadingIcon) {
            leadingIcon.addEventListener('click', (event) => this.callbackLeadingIconClicked(event));
        }

        let trailingIcon = this.container.querySelector('.aurora-trailing-icon');
        if (trailingIcon) {
            trailingIcon.addEventListener('click', (event) => this.callbacktrailingIconClicked(event));
        }

        //---  CLICK event for the input field wrapper  ----------------------------------------------------------------
        this._textfield = this.container.querySelector('.aurora-text-field');
        this._textfield.addEventListener('click', (event) => this.callbackClicked(event), false);


        //---  KEYUP event for the input field  ------------------------------------------------------------------------

        this._inputfield = this.container.querySelector(".aurora-text-field-input");

        // var typing     = (event) => this.callbackKeyup( event, this.container );

        this._inputfield.addEventListener('keyup', (event)=> this.callbackKeyup(event), false);
        this._inputfield.addEventListener('keyup', (event) => this.cleanErrors(event), false);

        let leaving     = (event) => this.callbackFocusout( event, this.container );
        this._inputfield.addEventListener('focusout',  leaving, false);

        this._inputfield.addEventListener( 'focus', (event)=>this.callbackClicked(event) );
        // MDC.MDCRipple.attachTo(inputfield);
    }

    valueChanged( event ) {
        let charactercounter = this.container.querySelectorAll(".mdc-text-field-character-counter");
        let value            = this.container.getElementsByClassName("aurora-text-field-input")[0].value
        if (charactercounter.length > 0 && charactercounter[0].length > 0 ) {
            this.container.querySelectorAll(".mdc-text-field-character-counter")[0].innerHTML = this.jar.value.length;
        }
        if ( value.length > 0 ) {
            this.container.querySelectorAll("label")[0].classList.add('aurora-floating-label--float-above');
        }
    }


    cleanErrors( event ) {
        this.removeError();
        //--- validation level: immediate
        this.jar.isValid(event.target.value, validationLevel.immediate );
    }

    callbackClicked ( event ) {
        const element = event.target;
        // if (element !== this._textfield) return;

        const textfield = this._textfield;
        let label = textfield.querySelector("label");
        if (label && label) label.classList.add('aurora-floating-label--float-above');
        if (textfield && textfield) textfield.classList.add('focused');

        //event.stopPropagation();
    }

    callbackLeadingIconClicked( event ) {
        this.jar.leadingIconClicked();
    }
    callbacktrailingIconClicked( event ) {
        this.jar.trailingIconClicked();
    }

    callbackKeyup( event ) {
        let container = event.target.parentElement.parentElement;
        let charactercounter = container.querySelectorAll(".mdc-text-field-character-counter");
        if ( charactercounter.length > 0 ) {
            container.querySelectorAll(".mdc-text-field-character-counter")[0].innerHTML = event.target.value.length;
        }
        // event.stopPropagation();
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
  //      event.stopPropagation();
        //--- validation level: CHANGE
        this.jar.isValid( event.target.value, validationLevel.change );
    }

    removeError( event ) {
        this.container.classList.remove('in-error');
        this.container.getElementsByClassName("aurora-text-field-error-text")[0].innerHTML = "";

    }

    reportError(errormsg) {
        this.container.classList.add('in-error');
        this.container.getElementsByClassName("aurora-text-field-error-text")[0].innerHTML = errormsg;

        console.log(this.jar);
    }

}
