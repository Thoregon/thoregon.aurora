/**
 * Display a property of a model in a UI element as Text Node
 * Works one way, just displays but does not propage chnages of the text node to the model
 *
 * todo [OPEN]:
 *  - handle 'focus' event to restore cursor and selection
 *  - support 'aurora-format'
 *
 * @author: Bernhard Lukassen
 */

import { validationLevel } from "../../common.mjs";
import { Validation }      from "../../validation/validation.mjs";

export default class ViewStateItem {

    constructor(vmitem, stateproperty) {
        this.vmitem        = vmitem;
        this.stateproperty = stateproperty;
    }

    attachView(view) {
        const propertyView = this.vmitem.view;
        return this;
    }

    mutate(mutation) {
        this.vmitem.view[this.stateproperty] = mutation.value;
    }

    dispose() {}
}
