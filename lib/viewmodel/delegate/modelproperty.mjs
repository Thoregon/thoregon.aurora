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

    async buildMutation(evt) {
        return { identifier: this.identifier, property: this.property, value: evt.newValue ?? await evt.obj[evt.property]};
    }

    current() {
        return { identifier: this.identifier, property: this.property, value: this.model[this.property] };
    }

    async mutate(mutation) {
        this.model[this.property] = mutation.value;
        return true;
    }

}
