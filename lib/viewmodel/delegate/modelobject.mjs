/**
 * View Model for Collections
 *
 * @author: Bernhard Lukassen
 */

import { isFunction }           from "/evolux.util";

import ViewModel     from "../viewmodel.mjs";
import ModelDelegate from "./modeldelegate.mjs";
import ModelProperty from "./modelproperty.mjs";
import ModelAction   from "./modelaction.mjs";

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

    async modelMutated(evt) {
        let property = this.items[evt.property];
        if (!property) return;
        let mutation = property.buildMutation(evt);
        await this.viewModel.toEast(mutation);
    }

    async mutate(mutation) {
        let property = this.items[mutation.identifier];
        if (!property) return;
        return await property.mutate(mutation);
    }

    current(identifier) {
        let property = this.items[identifier];
        if (!property) return;
        return property.current();
    }

    // todo [OPEN]: nested objects
    attachIdentifier(identifier) {
        let keys = [...Object.keys(this.model), ...this.getMethodNames(this.model)];
        let prop = keys.find(key => key.asIdentifier() === identifier);
        if (prop) {
            let item;
            let val = this.model[prop];
            if (Array.isArray(val)) {
                // todo [OPEN]: viewmodelcollection
                // caution: the model emits no change events for add/remove and not for collection items
                // item = new ViewModelCollection();
                // item.attachModel(val);
            } else if (isFunction(val)) {
                item = new ModelAction(this, prop);
                this.items[identifier] = item;
            } else {
                item = new ModelProperty(this, prop);
                this.items[identifier] = item;
            }
            return this;
        }
    }

    getMethodNames(model) {
        let proto = Object.getPrototypeOf(model);
        return proto
               ? [...Object.getOwnPropertyNames(proto), ...this.getMethodNames(proto)].filter(name => !name.startsWith('_'))
               : [];
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
