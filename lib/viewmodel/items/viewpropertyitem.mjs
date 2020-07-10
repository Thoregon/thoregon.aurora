/**
 * Synchronise a UI element with a property of a model
 *
 * @author: Bernhard Lukassen
 */

export default class ViewPropertyItem {

    constructor(vmitem) {
        this.vmitem = vmitem;
    }

    attachView(view) {
        this.vmitem.view.addEventListener('value', (evt) => this.valueChanged(evt.target.value));
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

    valueChanged(value) {
        this.vmitem.mutated(value);
    }

    mutate(mutation) {
        this.vmitem.view.value = mutation.value;
    }
}
