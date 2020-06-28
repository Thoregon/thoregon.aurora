/**
 *
 *
 * @author: Bernhard Lukassen
 */

import ThemeBehavior            from "../../themebehavior.mjs";

export default class AuroraTextField extends ThemeBehavior {

    rootElement = '';

    attach(jar) {
        this.jar = jar;
        this.auroraelement = this.jar.container;
        this.rootElement   = 'martin';

        //---  CLICK event for the input field wrapper  ----------------------------------------------------------------
        var textfield = this.auroraelement.getElementsByClassName("aurora-text-field");
        textfield[0].addEventListener('click', this.textFieldClicked, false);

        //---  KEYUP event for the input field  ------------------------------------------------------------------------
        var inputfield = this.auroraelement.querySelectorAll("input");
        var typing     = (event) => this.inputFieldKeyup(event, this.auroraelement);
        inputfield[0].addEventListener('keyup', typing, false);

        inputfield[0].addEventListener('keyup', this.inputFieldKeyup2, false);
    }

    textFieldClicked () {
        this.classList.add('focused');
        this.parentElement.querySelectorAll("label")[0].classList.add('mdc-floating-label--float-above');
    }
    inputFieldKeyup(event, auroraelement ) {
        console.log(this);
        if (this && this.value) {
            alert("My input has a value!");
        }
    }
    inputFieldKeyup2() {
        console.log(this);
        if (this && this.value) {
            alert("My input has a value!");
        }
    }
}
