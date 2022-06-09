/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import { isFunction}   from "/evolux.util";

import AuroraElement   from "../auroraelement.mjs";
import AuroraAttribute from "./auroraattribute.mjs";
import Evaluator       from "./evaluator.mjs";

const SHORTCODE = ':';

export default class AuroraAttributeBind extends AuroraAttribute {

    static get name() {
        return "bind";
    }

    static get supportsSelector() {
        return true;
    }

    static get supportsMultiple() {
        return true;
    }

    static attrCompare() {
        const names = [this.auroraName, this.auroraShortName];
        return (attrname) => (attrname.startsWith(SHORTCODE) || names.findIndex(name => attrname.startsWith(name)) > -1);
    }

    parseAttributeSelector() {
        let name = this.attribute?.name;
        if (!name || !name.startsWith(SHORTCODE)) return super.parseAttributeSelector();
        let selector = name.substr(1), subselector;
        let parts = selector.split('.');
        if (parts.length > 1) {
            selector = parts[0];
            subselector = parts[1];
        }
        return { name: this.auroraName, selector, subselector };
    }

    connectElement() {
        // nothiing to do, bind only reacts on mutations on the west (model/viewmodel) side
    }

    async modelMutated() {
        const fn      = this.fn;
        const ev      = this.evaluator;
        const vm      = this.getAttachedViewModel();
        const prop    = this.selector;
        const element = this.element;
        if (!vm || !fn || !prop) return;
        const params = ev.buildFnParamValues(vm.model, vm);

        try {
            const result = await fn(params);

            if (isFunction(element[prop])) {
                // if it is a function invoke it
                element[prop](result);
            } else if (prop in element) {
                // if it is a normal property, set it
                element[prop] = result;
            } else {
                // set the elements attribute
                element.setAttribute(prop, result);
            }
        } catch (e) {
            console.log(e);
        }
    }

    get fn() {
        if (!this._fn) {
            const ev = new Evaluator();
            const fn = ev.buildFN(this.attribute.value);
            this._fn = fn;
            this.evaluator = ev;
        }
        return this._fn;
    }

    //
    // view model
    //

    connectViewModelListeners(viewModel) {
        // Listen to all modifications
        viewModel.addMutationListener(() => this.modelMutated());
    }

}

AuroraElement.useAuroraAttribute(AuroraAttributeBind);
