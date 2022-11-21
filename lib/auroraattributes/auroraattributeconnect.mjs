/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import AuroraAttribute          from "./auroraattribute.mjs";
import Evaluator                from "./evaluator.mjs";
import AuroraElement            from "../auroraelement.mjs";
import AuroraAttributeIntersect from "./auroraattributeintersect.mjs";

const debuglog = (...args) => {}; // {};   // console.log(...args);

export default class AuroraAttributeConnect extends AuroraAttribute {

    //
    // attribute definition
    //

    static get name() {
        return "connect";
    }

    static get supportsSelector() {
        return false;
    }

    static get supportsMultiple() {
        return false;
    }

    //
    // connect
    //

    connect() {
        if (this._active) return;
        this._active = true;

        const fn       = this.fn;
        const ev       = this.evaluator;
        const vm       = this.getAttachedViewModel();
        const $element = this.element;
        if ( !vm || !fn) {
            delete this._active;
            return;
        }
        const observerParams = { $element };
        const params = ev.buildFnParamValues(vm.model, vm, observerParams); // the model should not be available in this case

        debuglog("** aurora-connect > elementTriggered ", this.auroraName, this.attribute.name, this.attribute.value);

        try {
            fn(params);
        } catch (e) {
            console.log("aurora-connect: eval error > ", e.message);
        }
        delete this._active;
    }

    get fn() {
        if (!this._fn) {
            try {
                const element  = this.element;
                const ev       = new Evaluator();
                const fn       = ev.buildFN(this.attribute.value, ['$element']);
                this._fn       = element ? fn.bind(element) : fn;
                this.evaluator = ev;
            } catch (e) {
                // there was an error creating the function
                console.log("aurora-connect ERROR in '" + e.expression + "' ->", e.message);
            }
        }
        return this._fn;
    }

    doFirstSync() {
        this.connect();
    }

}

AuroraElement.useAuroraAttribute(AuroraAttributeConnect);

