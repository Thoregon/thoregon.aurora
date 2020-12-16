/**
 *
 *
 * @author: Bernhard Lukassen
 */

import VmEventEmitter   from "../events/vmeventemitter.mjs";
import ViewPropertyItem from "./viewpropertyitem.mjs";
import ViewActionItem   from "./viewactionitem.mjs";
import { Validation }   from "../../validation/validation.mjs";

export default class ViewItem extends VmEventEmitter(Object) {

    constructor(viewModel) {
        super();
        this.viewModel = viewModel;
    }

    static itemFor(view, viewModel) {
        let vmitem = new this(viewModel);
        return vmitem;
    }

    attachView(view) {
        this.view = view;
        if (view.isInput)   this.property   = new ViewPropertyItem(this).attachView(view);
        if (view.isTrigger) this.action     = new ViewActionItem(this).attachView(view);
        view.attachViewItem(this);
        return this;
    }

    get name() {
        let name = this.view.getAttribute('aurora-name');
        return name ? name : this.view.auroraname;
    }

    get identifier() {
        return this.name ? this.name.asIdentifier() : undefined;
    }

    mutate(mutation) {
        if (this.property) this.property.mutate(mutation);
    }

    mutated(value) {
        let mutation = { identifier: this.identifier, name: this.name, value };
        this.viewModel.toWest(mutation);
    }

    triggerAction(event, actionitem) {
        let mutation = { identifier: this.identifier, name: this.name, event };
        this.viewModel.toWest(mutation);
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
