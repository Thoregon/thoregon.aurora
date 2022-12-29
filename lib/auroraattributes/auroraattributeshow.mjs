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

export default class AuroraAttributeShow extends AuroraAttribute {

    constructor(...args) {
        super(...args);
        this.modelListener = () => this.modelMutated();
        this.setInitialValue();
        this._display;
    }

    static get name() {
        return "show";
    }

    //
    //
    //

    setInitialValue() {
        const element = this.element;
        if (!element) return;
        this._display = element.style.display;
        if (this._display === 'none') this._display = 'block';
        element.style.display = 'none';
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

        debuglog("** aurora-show > modelMutated ", this.auroraName, this.attribute.name, this.attribute.value);

        try {
            if (!element) return;
            const result = await this.evaluate(params);
            if (result) {
                element.style.display = this._display ?? 'block';
            } else {
                element.style.display = 'none';
            }
        } catch (e) {
            console.log(`aurora-show: '${this.attribute.value}' eval error >`, e.message);
        }
        delete this._active;
    }

    async evaluate(params) {
        return !!(await this.fn(params));
    }

    get fn() {
        if (!this._fn) {
            try {
                try {
                    const element  = this.element;
                    const ev       = new Evaluator();
                    const fn       = ev.buildFN(this.attribute.value, this.elementAndAttributeParamNamess());
                    this._fn       = element ? fn.bind(element) : fn;
                    this.evaluator = ev;
                } catch (e) {
                    // there was an error creating the function
                    console.log("aurora-show ERROR in '" + e.expression + "' ->", e.message);
                }
            } catch (e) {

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

AuroraElement.useAuroraAttribute(AuroraAttributeShow);
