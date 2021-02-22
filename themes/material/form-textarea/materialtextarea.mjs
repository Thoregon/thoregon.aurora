/**
 *
 *
 * @author: Bernhard Lukassen
 */

import ThemeBehavior            from "../../themebehavior.mjs";
import { validationLevel }      from "../../../lib/common.mjs";

export default class MaterialTextarea extends ThemeBehavior {

    rootElement = '';

    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;

        //---  CLICK event for the input field wrapper  ----------------------------------------------------------------
        var textfield = this.container.getElementsByClassName("aurora-textarea");
        textfield[0].addEventListener('click', this.callbackClicked, false);

        var inputfield = this.container.getElementsByClassName("aurora-textarea-input");

        //---  KEYUP event for the input field  ------------------------------------------------------------------------
        var typing     = (event) => this.callbackKeyup( event, this.container );
        inputfield[0].addEventListener('keyup', this.callbackKeyup, false);
        inputfield[0].addEventListener('keyup', () => this.cleanErrors(), false);

        var leaving     = (event) => this.callbackFocusout( event, this.container );
        inputfield[0].addEventListener('focusout', leaving, false);

        inputfield[0].addEventListener( 'focus', this.callbackClicked );
        // MDC.MDCRipple.attachTo(inputfield);
    }

    valueChanged( event ) {
        let charactercounter = this.container.querySelectorAll(".mdc-textarea-field-character-counter");
        let value            = this.container.getElementsByClassName("aurora-textarea-input")[0].value

        if (charactercounter.length > 0 && charactercounter[0].length > 0 ) {
            this.container.querySelectorAll(".mdc-textarea-field-character-counter")[0].innerHTML = this.jar.value.length;
        }
        if ( value.length > 0 ) {
            this.container.querySelectorAll("label")[0].classList.add('aurora-floating-label--float-above');
        }
    }

    cleanErrors() {
        this.removeError();
        //--- validation level: immediate
        this.jar.isValid( validationLevel.immediate );
    }

    callbackClicked ( event ) {
        this.parentElement.querySelectorAll("label")[0].classList.add('aurora-floating-label--float-above');
        this.parentElement.querySelectorAll(".aurora-textarea")[0].classList.add('focused');
        event.stopPropagation();
    }
    callbackKeyup( event ) {
        let container = event.target.parentElement.parentElement;
        let charactercounter = container.querySelectorAll(".mdc-textarea-character-counter");
        if ( charactercounter.length > 0 ) {
            container.querySelectorAll(".mdc-textarea-character-counter")[0].innerHTML = event.target.value.length;
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
        this.container.getElementsByClassName("aurora-textarea")[0].classList.remove('focused');
        event.stopPropagation();
        //--- validation level: CHANGE
        this.jar.isValid( validationLevel.change );
    }

    removeError() {
        this.container.classList.remove('error');
        this.container.getElementsByClassName("aurora-textarea-error-text")[0].innerHTML = "";

    }
    reportError(errormsg) {
        this.container.classList.add('error');
        this.container.getElementsByClassName("aurora-textarea-error-text")[0].innerHTML = errormsg;

        console.log(this.jar);
    }

}
