/**
 *
 *
 * @author: Bernhard Lukassen
 */

import ThemeBehavior            from "../../themebehavior.mjs";

import MDC                      from '/@material/ripple';

export default class AuroraTextField extends ThemeBehavior {

    rootElement = '';

    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;

        //---  CLICK event for the input field wrapper  ----------------------------------------------------------------
        var textfield = this.container.getElementsByClassName("aurora-text-field");
        textfield[0].addEventListener('click', this.callbackClicked, false);


        var inputfield = this.container.querySelector("input");
        //---  KEYUP event for the input field  ------------------------------------------------------------------------
        var typing     = (event) => this.callbackKeyup( event, this.container );
        inputfield.addEventListener('keyup', typing, false);

        var leaving     = (event) => this.callbackFocusout( event, this.container );
        inputfield.addEventListener('focusout', leaving, false);

        MDC.MDCRipple.attachTo(inputfield);
    }

    callbackClicked ( event ) {
        this.classList.add('focused');
        this.parentElement.querySelectorAll("label")[0].classList.add('aurora-floating-label--float-above');
        event.stopPropagation();
    }
    callbackKeyup( event, container ) {
        event.stopPropagation();
    }
    callbackFocusout ( event, container  ) {
        if (! (event.target && event.target.value)) {
            event.target.parentElement.querySelectorAll("label")[0].classList.remove('aurora-floating-label--float-above');
        }
        this.container.getElementsByClassName("aurora-text-field")[0].classList.remove('focused');
        event.stopPropagation();
    }

}
