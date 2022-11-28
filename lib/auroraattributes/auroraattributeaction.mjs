/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import AuroraElement   from "../auroraelement.mjs";
import AuroraAttribute from "./auroraattribute.mjs";
import Evaluator       from "./evaluator.mjs";

const SHORTCODE = '@';

const debuglog = (...args) => {}; // {};   // console.log(...args);

export default class AuroraAttributeAction extends AuroraAttribute {

    constructor(...args) {
        super(...args);
        this.elementListener = (evt) => this.elementTriggered(evt);
    }


    static get name() {
        return "action";
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

    connectElementListeners(element) {
        element = element ?? this.element;
        if (!element) return;  // can't connect
        const eventname = this.selector ?? 'click';
        element.addEventListener(eventname, this.elementListener);
    }

    async elementTriggered(evt) {
        if (this.element.hasAttribute("disabled")) return;
        if (this._active) return;
        this._active = true;

        const fn      = this.fn;
        const ev      = this.evaluator;
        const vm      = this.getAttachedViewModel();
        const element = this.element;
        if ( !vm    ||
             !fn    ||
             element.getAttribute('disabled') == '' ) {
            delete this._active;
            return;
        }
        const otherparams = this.elementAndAttributeParams({ $event: evt });
        const params = ev.buildFnParamValues(vm.model, vm, otherparams);

        debuglog("** aurora-action > elementTriggered ", this.auroraName, this.attribute.name, this.attribute.value);

        try {
            fn(params);
        } catch (e) {
            console.log("aurora-action: eval error > ", e.message);
        }
        delete this._active;
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
                console.log("aurora-action ERROR in '" + e.expression + "' ->", e.message);
            }
        }
        return this._fn;
    }

    //
    // view model
    //

    connectViewModelListeners(viewModel) {
        // empty because an action is directed (UI -> Function)
    }


}

AuroraElement.useAuroraAttribute(AuroraAttributeAction);
