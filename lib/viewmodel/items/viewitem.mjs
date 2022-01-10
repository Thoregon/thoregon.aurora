/**
 *
 *
 * @author: Bernhard Lukassen
 */

import ModelItem        from "./modelitem.mjs";
import ViewPropertyItem from "./viewpropertyitem.mjs";
import ViewActionItem   from "./viewactionitem.mjs";
import ViewOutputItem   from "./viewoutputitem.mjs";
import ViewItemActions  from "./viewitemactions.mjs";
import ViewStateItem    from "./viewstateitem.mjs";

export default class ViewItem extends ModelItem {

    static itemFor(view, viewModel) {
        let vmitem = new this(viewModel);
        return vmitem;
    }

    attachView(view) {
        this.view = view;
        if (view.isInput) {
            this.property = new ViewPropertyItem(this).attachView(view);
        } else if (view.isOutput) {
            this.property = new ViewOutputItem(this).attachView(view);
        }
        if (view.isTrigger) this.action = new ViewActionItem(this).attachView(view);
        if (view.hasItemActions) this.itemActions = new ViewItemActions(this).attachView(view);
        // todo [REFACTOR]: allow multiple state handler
        if (view.auroravisible) this.state = new ViewStateItem(this, 'aurora_visible').attachView(view);
        if (view.auroraenabled) this.state = new ViewStateItem(this, 'aurora_enabled').attachView(view);

        view.attachViewItem(this);
        return this;
    }

    dispose() {
        this.action?.dispose();
        this.property?.dispose();
        this.state?.dispose();
    }

    get name() {
        return this.view.auroraname ?? this.view.auroraaction ?? this.view.auroravisible ?? this.view.auroraenabled;
/*
        let name = this.view.getAttribute('aurora-name');
        return name ? name : this.view.auroraname;
*/
    }

    get identifier() {
        return this.name ? this.name.asIdentifier() : undefined;
    }

    mutate(mutation) {
        if (this.property) this.property.mutate(mutation);
        if (this.state)    this.state.mutate(mutation);
    }

    async mutated(value) {
        let mutation = { vm: this.viewModel, identifier: this.identifier, name: this.name, value };
        return await this.viewModel.toWest(mutation);
    }

    async triggerAction(event, actionitem) {
        let mutation = { vm: this.viewModel, identifier: this.identifier, name: this.name, event };
        return await this.viewModel.toWest(mutation);
    }

    async triggerItemActions(event, itemactions) {
        let mutation = { vm: this.viewModel, identifier: 'itemActions', name: this.name, event };
        return await this.viewModel.toWest(mutation);
    }

}
