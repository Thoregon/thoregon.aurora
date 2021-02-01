/**
 *
 *
 * @author: Bernhard Lukassen
 */
import ModelDelegate            from "./modeldelegate.mjs";

export default class ModelAction extends ModelDelegate {

    constructor(parent, property) {
        super();
        Object.assign(this, { parent, property, identifier: property.asIdentifier() });
    }

    get model() {
        return this.parent.model;
    }

    buildMutation(evt) {
        return { identifier: this.identifier, property: this.property };
    }

    current() {
        return { identifier: this.identifier, property: this.property };
    }

    mutate(mutation) {
        let fn = this.model[this.property];
        fn.call(this.model, mutation.event);
        return true;
    }
}
