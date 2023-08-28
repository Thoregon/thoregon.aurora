/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import AuroraAttribute     from "./auroraattribute.mjs";
import Evaluator           from "./evaluator.mjs";
import AuroraElement       from "../auroraelement.mjs";

const debuglog = (...args) => {}; // {};   // console.log(...args);

export default class AuroraAttributeReadonly extends AuroraAttribute {

    constructor(...args) {
        super(...args);
        this.modelListener = () => this.modelMutated();
        this.setInitialValue();
    }

    static get name() {
        return "readonly";
    }

    //
    //
    //

    setInitialValue() {
        const element = this.element;
        if (!element) return;
        try { element.setAttribute('readonly', '');} catch (e) { }
    }

    async modelMutated() {
        if (this._active) return;

        const fn      = this.fn;
        const ev      = this.evaluator;
        const vm      = this.getAttachedViewModel();
        const element = this.element;
        if (!vm || !fn) return;
        this._active = true;
        const otherparams = this.elementAndAttributeParams();
        const params = ev.buildFnParamValues(vm.model, vm, otherparams);

        debuglog("** aurora-readonly > modelMutated ", this.auroraName, this.attribute.name, this.attribute.value);

        try {
            if (!element) return;
            const result = !( await fn(params) );
            if (result) {
                element.removeAttribute('readonly');
            } else {
                element.setAttribute('readonly', '');
            }
        } catch (e) {
            console.log(`aurora-enabled: '${this.attribute.value}' eval error >`, e.message);
        }
        delete this._active;
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
                console.log("aurora-readonly ERROR in '" + e.expression + "' ->", e.message);
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

AuroraElement.useAuroraAttribute(AuroraAttributeReadonly);
