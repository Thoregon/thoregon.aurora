/**
 *
 *
 * @author: Bernhard Lukassen
 */

import ThemeBehavior            from "../../themebehavior.mjs";
import { validationLevel }      from "../../../lib/common.mjs";

export default class MaterialChatEntryBox extends ThemeBehavior {
    rootElement = '';

    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;

        var inputfield = this.container.getElementsByClassName("aurora-chat-entrybox-textarea");

        //---  KEYUP event for the input field  ------------------------------------------------------------------------
        var typing     = (event) => this.callbackKeyup( event, this.container );
        inputfield[0].addEventListener('keyup', this.callbackKeyup, false);
//        inputfield[0].addEventListener('keyup', () => this.cleanErrors(), false);

    }

    valueChanged( event ) {
        console.log ( this.jar.value.length );
        return;
        let charactercounter = this.container.querySelectorAll(".mdc-text-field-character-counter");
        if ( charactercounter[0].length > 0 ) {
            this.container.querySelectorAll("label")[0].classList.add('aurora-floating-label--float-above');
            this.container.querySelectorAll(".mdc-text-field-character-counter")[0].innerHTML = this.jar.value.length;
        }
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

        if ( event.target.value.length > 0 ) {
            container.getElementsByClassName("aurora-chat-entrybox-message-types")[0].setAttribute("class", "aurora-chat-entrybox-message-types type-text");
        } else {
            container.getElementsByClassName("aurora-chat-entrybox-message-types")[0].setAttribute("class", "aurora-chat-entrybox-message-types type-audio");
        }

        event.stopPropagation();
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
