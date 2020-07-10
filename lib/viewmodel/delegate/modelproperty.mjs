/**
 *
 *
 * @author: Bernhard Lukassen
 */
import ModelDelegate            from "./modeldelegate.mjs";

export default class ModelProperty extends ModelDelegate {

    constructor(parent, property) {
        super();
        Object.assign(this, { parent, property, identifier: property.asIdentifier() });
    }

    get model() {
        return this.parent.model;
    }

    buildMutation(evt) {
        return { identifier: this.identifier, property: this.property, value: evt.newValue };
    }

    mutate(mutation) {
        this.model[this.property] = mutation.value;
    }

}
