/**
 * Synchronise a UI element with a property of a model
 *
 * todo [OPEN]:
 *  - handle 'focus' event to restore cursor and selection
 *  - support 'aurora-format'
 *  - support 'aurora-options': 'inputOnly'
 *  - support each key type changes?
 *
 * @author: Bernhard Lukassen
 */

import { validationLevel } from "../../common.mjs";
import { Validation }      from "../../validation/validation.mjs";

export default class ViewPropertyItem {

    constructor(vmitem) {
        this.vmitem = vmitem;
    }

    attachView(view) {
        const propertyView = this.vmitem.view;
        let eventname = propertyView.valueEventName || 'change';
        propertyView.addEventListener(eventname, (evt) => this.valueChanged(propertyView.value));
        propertyView.addEventListener('validate', (evt) => this.validate(evt, propertyView));
        return this;
    }

/*
    connect() {
        let observable = this.parent.observed;
        // todo [OPEN]: watch property modifications of the model
        this.value = observable[this.propertypath]; // propertywithpath(observable, this.propertypath);
        let ui = document.querySelector(this.viewselector);
        this.ui = ui;
        ui.addEventListener('value', (val) => this.valueChanged(val));
        ui.viewmodel = this;
        // this.dispatchEvent('value', this.value);
    }
*/

    async valueChanged(value) {
        await this.vmitem.mutated(value);
    }

    mutate(mutation) {
        this.vmitem.view.value = mutation.value;
    }

    /*
     * Validations
     */

    validate(evt, propertyView) {
        // react on validation level 'change'
        if (evt.detail.level === validationLevel.change) {
            // universe.logger.info(`ViewActionItem > 'change' validation; value: '${evt.target.value}'`);
            // todo [OPEN]: do more in-depth and coherent validations. send up to the viewmodel itself
            this.vmitem.validate(evt.detail.level);
        }
    }
}
