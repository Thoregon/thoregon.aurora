/**
 * View Model for Collections
 *
 * @author: Bernhard Lukassen
 */

import ViewModel                from "../viewmodel.mjs";
import ModelDelegate            from "./modeldelegate.mjs";
import ModelProperty            from "./modelproperty.mjs";

export default class ModelObject extends ModelDelegate {

    constructor(viewModel) {
        super(viewModel);
        this.items = {};
    }

    static observes(observable) {
        return typeof observable === 'object';
    }

    attachModel(model) {
        super.attachModel(model);
        model.addEventListener('change', (evt) => this.modelMutated(evt));
    }

    modelMutated(evt) {
        let property = this.items[evt.property];
        if (!property) return;
        let mutation = property.buildMutation(evt);
        this.viewModel.toEast(mutation);
    }

    mutate(mutation) {
        let property = this.items[mutation.identifier];
        if (!property) return;
        property.mutate(mutation);
    }

    current(identifier) {
        let property = this.items[identifier];
        if (!property) return;
        return property.current();
    }

    // todo [OPEN]: nested objects
    attachIdentifier(identifier) {
        let keys = Object.keys(this.model);
        let prop = keys.find(key => key.asIdentifier() === identifier);
        if (prop) {
            let item;
            let val = this.model[prop];
            if (Array.isArray(val)) {
                // todo [OPEN]: viewmodelcollection
                // caution: the model emits no change events for add/remove and not for collection items
                // item = new ViewModelCollection();
                // item.attachModel(val);
            } else {
                item = new ModelProperty(this, prop);
                this.items[identifier] = item;
            }
            return this;
        }
    }

    propertiesWithPath(obj, path = '') {
        let items = [];
        let props = Object.keys(obj);
        props.forEach(prop => {
            let val = obj[prop];
            if (typeof val === 'object') {

            } else if (Array.isArray(val)) {
                // todo
            } else {

            }
        })
    }


}

ViewModel.add2factoryRegister(ModelObject);
