/**
 *
 *
 * @author: Bernhard Lukassen
 */

import { isFunction } from '/evolux.util';
import ModelDelegate  from "./modeldelegate.mjs";

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

    async mutate(mutation) {
        let fn = this.model[this.property];
        return isFunction(fn)
               ? await fn.call(this.model, mutation.event)
               : fn;
    }
}
