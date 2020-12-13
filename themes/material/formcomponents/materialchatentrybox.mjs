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

        let textarea = this.container.getElementsByClassName("aurora-chat-entrybox-textarea");
        let actions  = this.container.querySelector ( ".aurora-chat-entrybox-action");

        //---  Actions clicked  ------------------------------------------------------------------------
        this.container.querySelectorAll('.aurora-chat-entrybox-action').forEach(item => {
            item.addEventListener('click', this.callbackClicked, false);
        })

        //---  KEYUP event for the message field  ------------------------------------------------------------------------
        textarea[0].addEventListener('keyup', this.callbackKeyup, false);


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
        //--- Send Text Message
        if ( event.target.classList.contains('type-text') ) {
            alert("Message sent...");
        }
        event.stopPropagation();
    }
    callbackKeyup( event ) {
        let container = event.target.parentElement.parentElement;
        let enteredText = event.target.value;

        if ( event.keyCode === 13 && !event.shiftKey )  {
            // fire event to submit new message to the backend
            if ( enteredText.length > 1 ) {
                alert("message sent...");
            }
            event.target.value = "";
            enteredText = "";
        }
        event.target.parentNode.dataset.value = enteredText;

        if ( event.target.value.length > 0 ) {
            container.getElementsByClassName("aurora-chat-entrybox-action switcher")[0].setAttribute("class", "aurora-chat-entrybox-action switcher type-text");
        } else {
            container.getElementsByClassName("aurora-chat-entrybox-action switcher")[0].setAttribute("class", "aurora-chat-entrybox-action switcher type-audio");
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
