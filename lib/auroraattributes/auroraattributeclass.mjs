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

const debuglog = (...args) => {}; // {};   // console.log(...args);

export default class AuroraAttributeClass extends AuroraAttribute {

    constructor(...args) {
        super(...args);
        this.modelListener = () => this.modelMutated();
        this.resolveCssClasses();
    }

    static get name() {
        return "class";
    }

    static get supportsSelector() {
        return true;
    }

    static get supportsMultiple() {
        return true;
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

        debuglog("** aurora-class > modelMutated ", this.auroraName, this.attribute.name, this.attribute.value);

        try {
            if (!element) return;
            const result = !!(await fn(params));
            const cssTrue = this.cssClasses;
            const cssFalse = this.cssClassesFalse;
            if (result) {
                if (cssTrue) element.classList?.add(...cssTrue);
                if (cssFalse) element.classList?.remove(...cssFalse);
            } else {
                if (cssTrue) element.classList?.remove(...cssTrue);
                if (cssFalse) element.classList?.add(...cssFalse);
            }
        } catch (e) {
            console.log(`aurora-class: '${this.attribute.value}' eval error >`, e.message);
        }
        delete this._active;
    }

    resolveCssClasses() {
        let cssclasses = [];
        let selector = this.selector;
        let i = selector.indexOf(':');
        if (i > -1) {
            const parts2 = selector.substring(i + 1).split('.');
            this.cssClassesFalse = parts2;
            selector = selector.substring(0, i);
        }
        if (selector) cssclasses.push(selector);
        let subselector = this.subselector;
        if (subselector) {
            let i = subselector.indexOf(':');
            if (i > -1) {
                const parts2 = subselector.substring(i + 1).split('.');
                this.cssClassesFalse = parts2;
                subselector = subselector.substring(0, i);
            }
            const parts = subselector.split(".");
            cssclasses = [...cssclasses, ...parts];
        }
        this.cssClasses = cssclasses;
        return cssclasses;
    }

    splitClasses(selector) {
        const parts = selector.split(".");
        return parts;
    }

    get fn() {
        if (!this._fn) {
            try {
                const element  = this.element;
                const ev       = new Evaluator();
                const fn       = ev.buildFN(this.attribute.value, this.elementAndAttributeParamNames());
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

AuroraElement.useAuroraAttribute(AuroraAttributeClass);
