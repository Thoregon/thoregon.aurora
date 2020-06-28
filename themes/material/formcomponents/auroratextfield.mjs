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

        //--- Variante 1: Die 'fat arrow' Funktionen binden this an das aktuelle Object in dem die Funktion definiert ist.
        // mit event.target bekommst du das richtige element
        var typing     = (event) => this.inputFieldKeyup(event, event.target);
        inputfield[0].addEventListener('keyup', typing, false);

        //--- Variante 3: Die standard Funktionen können an andere objekte gebunden sein. In diesem Fall ist es das target (input feld)
        typing = function(event) {
            console.log(this);
        }
        inputfield[0].addEventListener('keyup', typing, false);

        //--- Variante 2: der Klasiker
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
