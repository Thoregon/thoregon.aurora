/**
 *
 *
 * @author: Bernhard Lukassen
 */

import { isFunction } from '/evolux.util';
import ModelDelegate  from "./modeldelegate.mjs";

export default class ModelItemActions extends ModelDelegate {

    constructor(parent, property) {
        super();
        Object.assign(this, { parent, property, identifier: property.asIdentifier() });
    }

    get model() {
        return this.parent.model;
    }

    async buildMutation(evt) {
        return { identifier: this.identifier, property: this.property };
    }

    current() {
        return { identifier: this.identifier, property: this.property };
    }

    async mutate(mutation) {
        const { action, items } = mutation.event.detail;
        let fn = this.model[action];
        return isFunction(fn)
               ? await fn.call(this.model, items)
               : fn;
    }
}
