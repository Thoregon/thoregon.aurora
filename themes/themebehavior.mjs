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

    switchElementVisibility ( elements, visible, displayValue = 'block' ) {
        elements.forEach( (element) => element.style.display = (visible) ? displayValue: "none" );
    }

    setElementContent ( elements, content ) {
        elements.forEach( (element) => element.innerHTML = content );
    }

    async dynamicContent( slot, templateName, visible) {
        let elements = this.container.querySelectorAll("*[aurora-slot='" + slot + "']");
        if ( ! visible ) {
            elements.forEach( (element) => element.innerHTML = '' );
        } else {
            let content = await this.jar.renderTemplate( templateName );
            elements.forEach( (element) => element.innerHTML = content );
        }
    }

    isSlotRendered ( slot ) {
        return ! this.container.querySelectorAll("*[aurora-slot='" + slot + "']")[0].innerHTML.length == 0;
    }

    triggerClicked(name, evt) {
        // console.log(">>> Trigger", name);
        let fn = this['trigger' + name];
        if (fn /*&& isFunction(fn)*/) fn(evt);
    }

}
