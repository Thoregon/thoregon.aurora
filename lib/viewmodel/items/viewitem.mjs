/**
 *
 *
 * @author: Bernhard Lukassen
 */

import VmEventEmitter           from "../events/vmeventemitter.mjs";
import ViewPropertyItem         from "./viewpropertyitem.mjs";
import ViewActionItem           from "./viewactionitem.mjs";

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
        return this;
    }

    get name() {
        return this.view.getAttribute('aurora-name');
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

    triggerAction() {
        let mutation = { identifier: this.identifier, name: this.name };
        this.viewModel.toWest(mutation);
    }
}
