/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import { isFunction, isObject }   from "/evolux.util";

import AuroraElement   from "../auroraelement.mjs";
import AuroraAttribute from "./auroraattribute.mjs";
import Evaluator       from "./evaluator.mjs";

const SHORTCODE = ':';

const debuglog = (...args) => {}; // {};   // console.log(...args);

function optionsFromArray(items) {
    let options = '';
    items.forEach(item => options += `<option value="${item}">${item}</option>\n`);
    return options;
}

function optionsFromObject(items) {
    let options = '';
    Object.entries(items).forEach(([value, text]) => options += `<option value="${value}">${text}</option>\n`);
    return options;
}

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
        return (attrname) => (attrname.startsWith(SHORTCODE) || names.findIndex(name => name === attrname || attrname.startsWith(name+SHORTCODE)) > -1);
    }

/*
    attachViewModel(viewModel) {
        debugger;
        return super.attachViewModel(viewModel);
    }
*/

    adjustName(name) {
        return name === SHORTCODE
               ? this.auroraName
               : super.adjustName(name);
    }

    parseAttributeSelector() {
        let name = this.attribute?.name;
        if (!name || !name.startsWith(SHORTCODE)) return super.parseAttributeSelector();
        let selector = name.substring(1), subselector;
        let parts = selector.split('.');
        if (parts.length > 1) {
            selector = parts[0];
            subselector = parts[1];
        }
        if (selector === '') selector = undefined;
        return { name: this.auroraName, selector, subselector };
    }

    async modelMutated() {
        if (this._active) return;

        const fn      = this.fn;
        const ev      = this.evaluator;
        const vm      = this.getAttachedViewModel();
        const prop    = this.selector ?? 'innerHTML';
        const element = this.element;
        if (!vm || !fn || !prop) return;

        this._active = true;
        const otherparams = this.elementAndAttributeParams();
        const params = ev.buildFnParamValues(vm.model, vm, otherparams);

        debuglog("** aurora-bind > modelMutated ", this.auroraName, this.attribute.name, this.attribute.value);

        try {
            const result = await fn(params);

            if (element.type?.startsWith('select-') && prop === 'innerHTML') {
                this.maintainSelect(element, result);
            } else if (isFunction(element[prop])) {
                // if it is a function invoke it
                element[prop](result);
            } else if (prop in element) {
                // if it is a normal property, set it
                const value = element[prop];
                if (value != result) element[prop] = result;
            } else {
                // set the elements attribute
                const value = element.getAttribute(prop);
                if (value != result) element.setAttribute(prop, result);
            }
        } catch (e) {
            console.log(`aurora-bind: '${this.attribute.value}' eval error >`, e.message);
        }
        delete this._active;
    }

    maintainSelect(element, result) {
        // todo: implement also 'select-multiple'
        const svalue = element.options.length === 0 ? element._modelvalue : element.value ?? element._modelvalue;
        if (Array.isArray(result)) {
            result = optionsFromArray(result);
        } else if (isObject(result)) {
            result = optionsFromObject(result);
        }
        element.innerHTML = result;
        if (svalue && svalue != element.value) element.value = svalue;
    }

    get fn() {
        if (!this._fn) {
            try {
                const element  = this.element;
                const ev       = new Evaluator();
                const fn       = ev.buildFN(this.attribute.value, this.elementAndAttributeParamNamess());
                this._fn       = element ? fn.bind(element) : fn;
                this.evaluator = ev;
            } catch (e) {
                // there was an error creating the function
                console.log("aurora-bind ERROR in '" + e.expression + "' ->", e.message);
            }
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
