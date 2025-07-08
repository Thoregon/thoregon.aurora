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
 *
 *  - load options
 *  - load first time values
 *  - select option
 *  - remove all options
 *  - create new option
 *
 */

import ThemeBehavior            from "../../themebehavior.mjs";
import { validationLevel }      from "../../../lib/common.mjs";

const TRANSLATIONS = {}

const TMPOPTIONS  = ``;

export default class MaterialMultiSelect extends ThemeBehavior {

    rootElement = '';

    constructor() {
        super();
        //--- her are the values and the option data from the aurora field
        this._values     = null;
        this._optionData = null;

        //--- to control that for the first run both values and options are set
        this._optionsLoaded = false;
        this._valuesLoaded  = false;
    }

    attach(jar) {
        this.jar = jar;

        this.container = this.jar.container;

        this._inputField  = this.container.querySelector("#multiSelectInput");
        this._options     = this.container.querySelector("#multiselect-options");
        this._selected    = this.container.querySelector("#selected-values");
        this._inputMirror = this.container.querySelector("#input-mirror");
        this._addNew      = this.container.querySelector("#addNew");

        //--- CLICK - remove all elements
        const triggerRemoveAll = this.container.querySelector("#act-remove-all");
        triggerRemoveAll.addEventListener('click', () => this.removeAll(), false);

        //--- CLICK - menu handle
        const triggerMenu = this.container.querySelector("#act-menu");
        triggerMenu.addEventListener('click', (event) => this.toggleMenu(event), false);

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

        //--- click add new taxonomy
        this._addNew.addEventListener('click', (event) => this.addNewTaxonomy(event), false );

        //--- click outside the input field
        this._inputField.addEventListener('blur', (event) => this.blurInputField(event), false );

        //--- mousover the options container
        this._options.addEventListener('mouseover',  (event) => this.optionsMouseover(event), false );

        //--- click outside the shadow dom
        document.addEventListener('click', (event) => this.clickedOutsideShadow(event), false);
    }

    getValue() {

        debugger;
    }

    set options( options ) {
        this._optionData    = options;
        this._optionsLoaded = true;
        this._maybeBuildMultiselect();
    }

    addNewTaxonomy() {
        alert('....add new taxonomy...');
    }
    removeAll() {
        this._values = [];
        this.buildMultiselect();
        this.jar.valueModified();
    }
    toggleMenu(event) {
        // get dropdown
        event.stopImmediatePropagation();
        const dropdown = this.container.querySelector("#multiselect-options");
        dropdown.classList.toggle('open');
    }
    focusInput() {

        const shouldOpenOptions = this.shouldOpenOptions();

        if (shouldOpenOptions) {
            this.openOptions();
        }
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
        optionsContainer.insertBefore(newOption, this._addNew);
       // optionsContainer.appendChild(newOption);

        //--- check if element is in values


        if (this._values.includes(key)) {
            newOption.classList.add("selected");
        }
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

        this._options.classList.remove('open');
        this._inputField.focus();

        //--- update the the stored values ----

        if (! this._values.includes(key)) {
            this._values.push(key);
            console.log('✅ need to add value to selected values and propagate data');
        }
    }
    removeValue(event) {
        if ( event.target.getAttribute("data-action") != 'actremtri' ) return

        const multivalue = event.target.closest('.multivalue');
        const options    = this.container.querySelector("#multiselect-options");
        const valueID    = multivalue.getAttribute('data-value');

        multivalue.remove();

        this._values = this._values.filter(val => val != valueID);

        const optionSelector = `[data-value="${valueID}"]`;
        const option = options.querySelector(optionSelector);

        option.classList.remove('selected');
        this._options.classList.remove('open');
        this._inputField.focus();
        event.stopPropagation();
        this.jar.valueModified();
    }

    selectOption(event) {
        //element.classList.contains(className)
        if ( ! event.target.classList.contains('multiselect-option')) return;
        const option = event.target;
        const key    = option.getAttribute('data-value');
        const value  = option.getAttribute('data-label');
        this.addValue(key,value);

        this._inputField.value = '';                // clear content
        this._inputField.style.width = '1px';       // set width to 1px
        this._inputField.focus();                   // focus input field
    }


    resizeInputField() {
        const mirror     = this._inputMirror;
        mirror.innerHTML = this._inputField.value;
        const width      = mirror.offsetWidth || 1;
        this._inputField.style.width = width + 'px'; // Set width based on content length
    }

    blurInputField(event) {

        const clickedElement = event.relatedTarget;

        if (clickedElement && clickedElement.id === 'addNew') return;
        if (clickedElement && clickedElement.classList.contains('multiselect-option')) return;

        this._inputField.value = '';
        this._inputMirror.value = '';
        this.resizeInputField();
        this.filterOptions();
        // this._options.classList.remove('open');
    }

    optionsMouseover(event) {
        const options = this._options;
        let   option  = event.target;
        if (option.classList.contains('newElement')) {
            option = option.closest('.multiselect-new-option');
        }
        if (options) {
            const focusedOptions = options.querySelectorAll('.multiselect-option.focused, .multiselect-new-option.focused');
            focusedOptions.forEach(opt => opt.classList.remove('focused'));
            option.classList.add('focused');
        }
    }

    clickedOutsideShadow(event) {
        const path = event.composedPath();
        const shadowRoot = this.container; // your Shadow DOM root reference

        if (!path.includes(shadowRoot)) {
            this.closeOptions();
        }
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

        const shouldOpenOptions = this.shouldOpenOptions();
        if (shouldOpenOptions) {
            this.openOptions();
        } else {
            this.closeOptions();
        }

        //--- If search is in options but not already selected -> can not be added again + can not created

    }

    shouldOpenOptions() {
        const children = Array.from(this._options.children);

        return children.some(option => {
            // Check for '.multiselect-option'
            if (option.classList.contains('multiselect-option')) {
                return !option.classList.contains('selected') &&
                    !option.classList.contains('filtered-out');
            }

            // Check for '#addNew' with 'showNewOption' class
            if (option.id === 'addNew') {
                return option.classList.contains('showNewOption');
            }

            // Default: skip any other elements
            return false;
        });
    }

    openOptions() {
        const children = Array.from(this._options.children);

        // Clear any existing focused elements
        children.forEach(child => child.classList.remove('focused'));

        // Set the first matching child as focused
        for (let child of children) {
            if (child.classList.contains('multiselect-option')) {
                if (!child.classList.contains('selected') && !child.classList.contains('filtered-out')) {
                    child.classList.add('focused');
                    break;
                }
            } else if (child.classList.contains('multiselect-new-option')) {
                if (child.classList.contains('showNewOption')) {
                    child.classList.add('focused');
                    break;
                }
            }
        }



        this._options.classList.add('open');
    }
    closeOptions() {
        this._options.classList.remove('open');
    }

    getValue() {
        return this._values;
    }

    valueChanged( values ) {
        debugger;
        this._values       = values;
        this._valuesLoaded = true;
        this._maybeBuildMultiselect();
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


    _maybeBuildMultiselect() {
        if (this._optionsLoaded && this._valuesLoaded) {
            this.buildMultiselect();
        }
    }

    buildMultiselect() {

        const optionsToRemove = this._options.querySelectorAll('.multiselect-option ');
        optionsToRemove.forEach(el => el.remove());

        const options = this._optionData;
        for (const key in options) {
            const value = options[key];
            this.addOption(key,value);
        }

        const selectedValuesToRemove = this._selected.querySelectorAll('.multivalue');
        selectedValuesToRemove.forEach(el => el.remove());

        const values = this._values;
        values.forEach(key => {
            const value = options[key];
            this.addValue(key,value);
        });
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
