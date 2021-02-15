/**
 * a base behavior element for themes
 *
 * @author: Bernhard Lukassen
 */

import { className }                from '/evolux.util';
import { ErrNotImplemented }        from "../lib/errors.mjs";

export default class ThemeBehavior {

    // the 'jar' is the surrounding element in which the specific theme element is represented
    attach(jar) {
        throw ErrNotImplemented(`${className(this)}.attach()`);
    }

    attachValue(selector, handler) {
        let elem = this.getElement(selector);
        if (elem) {}
    }

    attachAction(selector, handler) {

    }

    attachHandle(selector, handler) {

    }

    getElement(selector) {
        let elements = this.container.querySelectorAll(selector);
        return elements.length > 0 ? elements[0] : undefined;
    }

    getAllElements(selector) {
        return this.container.querySelectorAll(selector);
    }

    asColorCSS(colorDefs) {}
}
