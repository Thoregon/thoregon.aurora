/**
 *
 *
 * @author: Bernhard Lukassen
 */

import ThemeBehavior            from "../../themebehavior.mjs";
import { validationLevel }      from "../../../lib/common.mjs";

export default class MaterialTextField extends ThemeBehavior {

    rootElement = '';

    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;

        //---  CLICK event for the input field wrapper  ----------------------------------------------------------------
        var textfield = this.container.getElementsByClassName("aurora-text-field");
        textfield[0].addEventListener('click', this.callbackClicked, false);

        var inputfield = this.container.getElementsByClassName("aurora-text-field-input");

        //---  KEYUP event for the input field  ------------------------------------------------------------------------
        var typing     = (event) => this.callbackKeyup( event, this.container );
        inputfield[0].addEventListener('keyup', this.callbackKeyup, false);

        var leaving     = (event) => this.callbackFocusout( event, this.container );
        inputfield[0].addEventListener('focusout', leaving, false);

        inputfield[0].addEventListener( 'focus', this.callbackClicked );
        // MDC.MDCRipple.attachTo(inputfield);
    }

    valueChanged( event ) {
        this.container.querySelectorAll("label")[0].classList.add('aurora-floating-label--float-above');
        let charactercounter = this.container.querySelectorAll(".mdc-text-field-character-counter");
        if ( charactercounter.length > 0 ) {
            this.container.querySelectorAll(".mdc-text-field-character-counter")[0].innerHTML = this.jar.value.length;
        }
    }


    callbackClicked ( event ) {
        this.classList.add('focused');
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

    reportError() {
        console.log("ERRORS FOUND AND NEED TO BE DISPLAYED...");
    }

}
