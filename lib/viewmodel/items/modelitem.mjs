/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import VmEventEmitter        from "../events/vmeventemitter.mjs";
import { Validation }        from "../../validation/validation.mjs";

import { ErrNotImplemented } from "../../errors.mjs";

export default class ModelItem extends VmEventEmitter(Object) {

    constructor(viewModel) {
        super();
        this.viewModel = viewModel;
    }

    attachView(view, attribute) {
        // implement by subclass
        throw ErrNotImplemented('attachView');
    }

    get name() {
        // implement by subclass
        throw ErrNotImplemented('name');
    }

    /**
     * to east: west (model) was mutated -> update view
     * @param mutation
     * */

    mutate(mutation) {
        // implement by subclass
        throw ErrNotImplemented('mutate');
    }

    /**
     * to west: east (view) was mutated -> update model
     * @param value
     */
    mutated(value) {
        // implement by subclass
        throw ErrNotImplemented('mutated');
    }

    get identifier() {
        return this.name ? this.name.asIdentifier() : undefined;
    }

    /*
     * validations
     */

    validate(level) {
        let validation = this.validation;
        if (!validation) return;
        validation.flushErrors();
        validation.validate(level);
        if (validation.hasErrors()) {
            this.view.reportErrors(validation.getError());
        }
        this.reportErrors(validation.errors);
    }

    addValidation(validationMethod) {
        if (!this.valdation) this.validation = new Validation();
        validationMethod.vmitem = this;
        this.validation.add(validationMethod);
    }

    hasErrors() {
        return this.validation ? this.validation.hasErrors() : false;
    }

    get errors() {
        return (this.validation)
               ? { ...this.validation.errors }
               : {};
    }

    reportErrors(errors) {
        this.dispatchEvent('valid-state', { errors });
        this.viewModel.reportErrors(this, errors);
    }
}
