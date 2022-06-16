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

const debuglog = (...args) => {}; // {};   // console.log(...args);

export default class AuroraAttributeBind extends AuroraAttribute {

    constructor(...args) {
        super(...args);
        this.modelListener = () => this.modelMutated();
    }

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

/*
    attachViewModel(viewModel) {
        debugger;
        return super.attachViewModel(viewModel);
    }
*/

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
        const prop    = this.selector ?? 'innerText';
        const element = this.element;
        if (!vm || !fn || !prop) return;
        const params = ev.buildFnParamValues(vm.model, vm);

        debuglog("** aurora-bind > modelMutated ", this.auroraName, this.attribute.name, this.attribute.value);

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
            console.log("aurora-bind: eval error > ", e.message);
        }
    }

    get fn() {
        if (!this._fn) {
            const element = this.element;
            const ev = new Evaluator();
            const fn = ev.buildFN(this.attribute.value);
            this._fn = element ? fn.bind(element) : fn;
            this.evaluator = ev;
        }
        return this._fn;
    }

    firstSyncFnValue() {
        this.modelMutated();
    }

    doFirstSync() {
        // debuglog("**> doFirstSync ", this.auroraName, this.attribute.name, this.attribute.value);
        if (!this.element.addInitFn) {
            this.firstSyncFnValue();
        } else {
            this.element.addInitFn(async () => this.firstSyncFnValue());
        }
    }

    //
    // view model
    //

    connectViewModelListeners(viewModel) {
        // debuglog("**> connectViewModelListeners ", this.auroraName, this.attribute.name, this.attribute.value);
        // Listen to all modifications
        viewModel.addMutationListener(this.modelListener);
    }

}

AuroraElement.useAuroraAttribute(AuroraAttributeBind);
