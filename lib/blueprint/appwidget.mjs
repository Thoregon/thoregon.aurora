/**
 * Represents a part functionality of an app
 * it can be limited als with parameters (element attributes)
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

export default class appwidget {

    constructor({
                    id
                } = {}) {
        Object.assign(this, { id });
    }

}
