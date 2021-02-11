/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

export default class View {

    constructor({
                    id
                } = {}) {
        Object.assign(this, { id });
    }

    static with(templatename) {
        let view = new this();
        view.templateName = templatename;
        return view;
    }
}
