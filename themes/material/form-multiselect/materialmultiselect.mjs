/*
 * Copyright (c) 2023.
 */

/**
 *
 *
 * @author: Martin Neitz
 *
 *  options | value | new items
 *
 */

import ThemeBehavior            from "../../themebehavior.mjs";
import { validationLevel }      from "../../../lib/common.mjs";

const TMPOPTIONS  = ``;

export default class MaterialMultiSelect extends ThemeBehavior {

    rootElement = '';

    attach(jar) {
        this.jar = jar;

        this.container = this.jar.container;

        this._inputField = this.container.querySelector("#multiSelectInput");
        this._options    = this.container.querySelector("#multiselect-options");
        this._selected   = this.container.querySelector("#selected-values");

        //--- CLICK - remove all elements
        const triggerRemoveAll = this.container.querySelector("#act-remove-all");
        triggerRemoveAll.addEventListener('click', () => this.removeAll(), false);

        //--- CLICK - menu handle
        const triggerMenu = this.container.querySelector("#act-menu");
        triggerMenu.addEventListener('click', () => this.toggleMenu(), false);

        //--- CLICK - focus the input field
        const inputWrapper = this.container.querySelector(".selected-input-wrapper");
        inputWrapper.addEventListener('click', () => this.focusInput(), false);

        //--- CLICK - remove single value
        const selectedValues = this.container.querySelector("#selected-values");
        selectedValues.addEventListener('click', (event) => this.removeValue(event), false );

        //--- CLICK - select single option
        const options = this.container.querySelector("#multiselect-options");
        options.addEventListener('click', (event) => this.selectOption(event), false );


        //--- Resize input field on typing
        this._inputField.addEventListener('input', (event) => this.resizeInputField(event), false );
        //--- Filter on typing
        this._inputField.addEventListener('input', (event) => this.filterOptions(event), false );

        /*
        //---  CLICK event for the input field wrapper  ----------------------------------------------------------------
        var textfield = this.container.getElementsByClassName("aurora-select");
        textfield[0].addEventListener('click', this.callbackClicked, false);

        var inputfield = this.container.getElementsByClassName("aurora-select-select");

        //---  KEYUP event for the input field  ------------------------------------------------------------------------
        var typing     = (event) => this.callbackKeyup( event, this.container );
        inputfield[0].addEventListener('keyup', this.callbackKeyup, false);
        inputfield[0].addEventListener('keyup', () => this.cleanErrors(), false);

        var leaving     = (event) => this.callbackFocusout( event, this.container );
        inputfield[0].addEventListener('focusout', leaving, false);

        inputfield[0].addEventListener( 'focus', this.callbackClicked );
        // MDC.MDCRipple.attachTo(inputfield);

         */
    }

    getValue() {
        debugger;
    }

    set options( options ) {
        for (const key in options) {
            const value = options[key];
            this.addOption(key,value);
        }
    }


    removeAll() {debugger;}
    toggleMenu() {
        // get dropdown
        const dropdown = this.container.querySelector("#multiselect-options");
        dropdown.classList.toggle('hidden');
    }
    focusInput() {
        this.container.querySelector("#multiSelectInput").focus();
    }

    addOption(key, value) {
        const search = value.toLowerCase();
        const newElement = `
                <div class="multiselect-option" tabindex="-1" data-value="${key}" data-search="${search}" data-label="${value}">${value}</div>
            `;



        let newOption = document.createElement("div");
        newOption.innerHTML = newElement;
        newOption = newOption.querySelector(".multiselect-option");

        const optionsContainer     = this.container.querySelector("#multiselect-options");
        optionsContainer.appendChild(newOption);

        //--- check if element is in values
        const valueSelector = `[data-value="${key}"]`;
        const selected = this._selected.querySelector(valueSelector);
        if (selected) { newOption.classList.add("selected");}
    }

    addValue(key, value) {
        const search = value.toLowerCase();

        //--- check if value is already selected
        const valueContainer = this.container.querySelector("#selected-values");
        let   selector       = `.multivalue[data-value='${key}']`;

        const isAlreadyIncluded  = valueContainer.querySelector(selector);
        if (isAlreadyIncluded) return;

        const newElement = `
                <span class="multivalue"
                      data-value="${key}">
                    <span class="multival-label" data-label="${value}"></span>
                    <span class="multival-remove" 
                          data-action="actremtri">
                          <i class="multival-trigger material-icons" 
                             data-action="actremtri">close
                          </i>
                    </span>
                </span>
            `;

        let newValue = document.createElement("div");
        newValue.innerHTML = newElement;
        newValue = newValue.querySelector(".multivalue");
        valueContainer.appendChild(newValue);

        //--- mark option as selected ----
        const optionsContainer = this.container.querySelector("#multiselect-options");
        selector = `.multiselect-option[data-value="${key}"]`;
        const option = optionsContainer.querySelector(selector);

        if ( option ) { option.classList.add('selected'); }

    }

    selectOption(event) {
        //element.classList.contains(className)
        if ( ! event.target.classList.contains('multiselect-option')) return;
        const option = event.target;
        const key    = option.getAttribute('data-value');
        const value  = option.getAttribute('data-label');
        this.addValue(key,value);
    }

    removeValue(event) {
        if ( event.target.getAttribute("data-action") != 'actremtri' ) return

        const multivalue = event.target.closest('.multivalue');
        const options    = this.container.querySelector("#multiselect-options");
        const valueID    = multivalue.getAttribute('data-value');

        multivalue.remove();

        const optionSelector = `[data-value="${valueID}"]`;
        const option = options.querySelector(optionSelector);

        option.classList.remove('selected');
    }

    resizeInputField() {
        this._inputField.style.width = (this._inputField.value.length + 1) + 'ch'; // Set width based on content length
    }

    filterOptions() {
        //--- Filter
        const value       = this._inputField.value;
        const search      = value.toLowerCase();
        const emptySearch = search.length === 0;

        const select  = `.multiselect-option[data-search*='${search}']`;
        const options = this._options.querySelectorAll('.multiselect-option');
        const result  = this._options.querySelectorAll(select);

        const newOption = this.container.querySelector('#addNew');

        const resultArray = [...result];
        const noResult = ( resultArray.length === 0 );


        options.forEach((option) => {
            if(resultArray.includes(option) || emptySearch) {
                option.classList.remove('filtered-out');
            } else {
                option.classList.add('filtered-out');
            }
        });

        //--- Add new element ----

        const addNewTemplate = `<div class="newElement" data-value="${value}">Kategorie ${value} erstellen...</div>`;
        newOption.innerHTML = addNewTemplate;

        if (search.length > 0 && (
            (resultArray.length === 1 && search != resultArray[0].getAttribute('data-search')) ||
            (resultArray.length === 0 || resultArray.length > 1))) {

            newOption.classList.add('showNewOption');
        } else {
            newOption.classList.remove('showNewOption');
        }

        //--- If search is in options but not already selected -> can not be added again + can not created

    }

    valueChanged( value ) {
        let label = this.container.querySelector(".aurora-floating-label");
        label.classList.add("aurora-floating-label--float-above");
    }


    cleanErrors() {
        this.removeError();
        //--- validation level: immediate
        this.jar.isValid( validationLevel.immediate );
    }

    callbackClicked ( event ) {
        this.parentElement.querySelectorAll("label")[0]?.classList.add('aurora-floating-label--float-above');
        this.parentElement.querySelectorAll(".aurora-select")[0]?.classList.add('focused');

        event.stopPropagation();
    }
    callbackKeyup( event ) {
        let container = event.target.parentElement.parentElement;
        let charactercounter = container.querySelectorAll(".mdc-select-character-counter");
        if ( charactercounter.length > 0 ) {
            container.querySelectorAll(".mdc-select-character-counter")[0].innerHTML = event.target.value.length;
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
        this.container.getElementsByClassName("aurora-select")[0].classList.remove('focused');
        event.stopPropagation();
        //--- validation level: CHANGE
        this.jar.isValid( validationLevel.change );
    }

    removeError() {
        this.container.classList.remove('error');
        this.container.getElementsByClassName("aurora-select-error-text")[0].innerHTML = "";

    }
    reportError(errormsg) {
        this.container.classList.add('error');
        this.container.getElementsByClassName("aurora-select-error-text")[0].innerHTML = errormsg;

        console.log(this.jar);
    }

}
