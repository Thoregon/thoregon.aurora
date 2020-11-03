/**
 * Specifies a View of any complexity
 *
 * A viewspec can be defined as UI entry point for an app
 *
 * @author: Bernhard Lukassen
 */

export default class ViewSpec {

    constructor({
                    id
                } = {}) {
        Object.assign(this, { id });
    }

}
