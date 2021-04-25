/**
 * is a helper class to build views for items in a collection
 * is not an AuroraElement!
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

export default class ItemView {

    constructor({
                    id
                } = {}) {
        Object.assign(this, { id });
    }

}
