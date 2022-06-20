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

export default class AuroraAttributeEnabled extends AuroraAttribute {

    constructor(...args) {
        super(...args);
        this.modelListener = () => this.modelMutated();
        this.setInitialValue();
    }

    static get name() {
        return "enabled";
    }

    //
    //
    //

    setInitialValue() {
        const element = this.element;
        if (!element) return;
        element.setAttribute('disabled', '');
    }

    async modelMutated() {
        const fn      = this.fn;
        const ev      = this.evaluator;
        const vm      = this.getAttachedViewModel();
        const element = this.element;
        if (!vm || !fn) return;
        const params = ev.buildFnParamValues(vm.model, vm);

        debuglog("** aurora-enabled > modelMutated ", this.auroraName, this.attribute.name, this.attribute.value);

        try {
            if (!element) return;
            const result = !!(await fn(params));
            if (result) {
                element.removeAttribute('disabled');
            } else {
                element.setAttribute('disabled', '');
            }
        } catch (e) {
            console.log("aurora-enabled: eval error > ", e.message);
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

AuroraElement.useAuroraAttribute(AuroraAttributeEnabled);
