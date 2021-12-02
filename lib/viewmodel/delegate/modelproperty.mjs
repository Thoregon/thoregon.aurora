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

    async current() {
        const value = await this.model[this.property] ?? '';
        return { identifier: this.identifier, property: this.property, value };
    }

    async mutate(mutation) {
        this.model[this.property] = mutation.value;
        return true;
    }

}
