/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import AuroraAttribute       from "./auroraattribute.mjs";
import Evaluator             from "./evaluator.mjs";
import AuroraElement         from "../auroraelement.mjs";

const debuglog = (...args) => {}; // {};   // console.log(...args);

const allNumbers = (parts) => !(parts.find(item => isNaN(item)));

export default class AuroraAttributeIntersect extends AuroraAttribute {

    constructor(...args) {
        super(...args);
    }

    //
    // attribute definition
    //

    static get name() {
        return "intersect";
    }

    static get supportsSelector() {
        return true;
    }

    static get supportsMultiple() {
        return true;
    }


    attachViewModel(viewModel) {
        super.attachViewModel(viewModel);
        this.parseAttributeTrigger();
    }

    parseAttributeSelector() {
        setTimeout(() => this.parseAttributeTrigger(), 100);
    }

    parseAttributeTrigger() {
        let name = this.attribute?.name;
        if (!name) return;
        const parts = name.split(':');
        name = parts.shift();
        let def;
        if (parts.length < 1) {
            def = { name, selector: this.useRatioTrigger([0]) };
        } else if (parts[0].startsWith("enter") || parts[0].startsWith("leave")) {
            def = { name, selector: this.useStateTrigger(parts) };
        } else if (allNumbers(parts)) {
            // if all parts are numbers use ratio trigger
            def = { name, selector: this.useRatioTrigger(parts) };
        } else {
            // report error
            console.log("aurora-intersect: can't parse definition: ", this.attribute?.name);
         }

        if (this.element) this.trigger.observe();

        return { name, selector: '' };
    }

    useRatioTrigger(defratios) {
        const ratios = defratios.map(item => parseInt(item)/100);
        if (!!ratios.find(item => item > 1 || item < 0)) {
            console.log("aurora-intersect: ratios must be between 0 and 100 (%)", defratios);
        }
        this.trigger = new RatioTrigger(this, ratios);
        return ratios;
    }

    useStateTrigger(parts) {
        const selector = parts.join();
        const state = parts.shift();
        const enter = state.startsWith("enter");
        const once  = state.indexOf("-once") > -1;
        const i     = state.indexOf('.');
        let   ratio = 0;
        if (i > -1) {
            const when = state.substring(i+1);
            if (when === 'partial') {
                const defratio = parts[0];
                if (defratio) {
                    ratio = parseInt(defratio)/100;
                    if (ratio > 1 || ratio < 0) {
                        console.log("aurora-intersect: ratios must be between 0 and 100 (%)", defratio);
                        return;
                    }
                } else {
                    ratio = 0.5;
                }
            } else if (when === 'full') {
                ratio = enter ? 1 : 0;
            } else {
                console.log("aurora-intersect: can't parse definition: ", this.attribute?.name);
                return;
            }
        }

        this.trigger = new StateTrigger(this, enter, ratio, once);
        return selector;
    }

    //
    // evaluation
    //


    async elementTriggered($intersecting, $ratio) {
        if (this._active) return;
        this._active = true;

        const fn      = this.fn;
        const ev      = this.evaluator;
        const vm      = this.getAttachedViewModel();
        const element = this.element;
        if ( !vm || !fn) {
            delete this._active;
            return;
        }
        const observerParams = { $intersecting, $ratio };
        const params = ev.buildFnParamValues(vm.model, vm, observerParams);

        debuglog("** aurora-intersect > elementTriggered ", this.auroraName, this.attribute.name, this.attribute.value);

        try {
            fn(params);
        } catch (e) {
            console.log("aurora-intersect: eval error > ", e.message);
        }
        delete this._active;
    }

    get fn() {
        if (!this._fn) {
            try {
                const element  = this.element;
                const ev       = new Evaluator();
                const fn       = ev.buildFN(this.attribute.value, ['$intersecting', '$ratio']);
                this._fn       = element ? fn.bind(element) : fn;
                this.evaluator = ev;
            } catch (e) {
                // there was an error creating the function
                console.log("aurora-intersect ERROR in '" + e.expression + "' ->", e.message);
            }
        }
        return this._fn;
    }


    //
    // connected element
    //

    connectElementListeners(element) {
        element = element ?? this.element;
        if (!element) return;  // can't connect
        this.trigger?.observe();
    }

    disconnectElement() {
        this.trigger?.unobserve();
    }

}

class Trigger {

    constructor(attribute) {
        this.attribute = attribute;
        this.ratios    = 0;
    }

    get element() {
        return this.attribute.element;
    }

    async elementTriggered(intersecting, ratio) {
        return await this.attribute.elementTriggered(intersecting, Math.round(ratio*100));
    }

    observe() {
        const options = this.buildObserverOptions();
        const observer = new IntersectionObserver((entries, observer) => this.handleIntersect(entries, observer), options);
        this.observer = observer;
        observer.observe(this.element);
    }

    unobserve() {
        this.observer?.unobserve(this.element);
    }

    //
    // Observer
    //

    buildObserverOptions() {
        const options = {
            // root: <elem>, // if omitted, the bowsers viewport is used
            rootMargin: '0px',
            threshold: this.ratios
        }
        return options;
    }

    handleIntersect(entries, observer) {
        // implement by subclass
        // if (entries.length < 1) return;
        // const entry        = entries[0];
        // const intersecting = entry.isIntersecting;
        // const ratio        = entry.intersectionRatio;
        // console.log(this.constructor.name, intersecting, ratio);
    }
}

class RatioTrigger extends Trigger {

    constructor(attribute, ratios) {
        super(attribute);
        this.ratios    = ratios;
    }

    handleIntersect(entries, observer) {
        if (entries.length < 1) return;
        const entry        = entries[0];
        const intersecting = entry.isIntersecting;
        const ratio        = entry.intersectionRatio;
        this.elementTriggered(intersecting, ratio);
    }

}

class StateTrigger extends Trigger {

    constructor(attribute, enter, ratio, once) {
        super(attribute);
        this.intersecting = false;
        this.enter        = enter;
        this.ratios       = ratio;
        this.once         = once;
    }

    handleIntersect(entries, observer) {
        if (entries.length < 1) return;
        const entry        = entries[0];
        const intersecting = entry.isIntersecting;
        const ratio        = entry.intersectionRatio;
        if (!this.intersecting && ratio >= this.ratios) {
            if (!intersecting) return;
            this.intersecting = true;
            if (this.enter) {
                if (this.once) this.unobserve();
                this.elementTriggered(intersecting, ratio);
            }
        } else if (this.intersecting && ratio <= this.ratios) {
            if (intersecting) return;
            this.intersecting = false;
            if (!this.enter) {
                if (this.once) this.unobserve();
                this.elementTriggered(intersecting, ratio);
            }
        }
    }

}

AuroraElement.useAuroraAttribute(AuroraAttributeIntersect);
