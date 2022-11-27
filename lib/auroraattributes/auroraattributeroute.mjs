/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import AuroraAttribute from "./auroraattribute.mjs";
import Evaluator       from "./evaluator.mjs";
import AuroraElement   from "../auroraelement.mjs";

import { replaceTplString, extractJSFunctions, extractKeyValue } from "/evolux.util/lib/formatutils.mjs";

const debuglog = (...args) => {}; // {};   // console.log(...args);

export default class AuroraAttributeRoute extends AuroraAttribute {

    constructor(...args) {
        super(...args);
        this.elementListener = (evt) => this.elementTriggered(evt);
        this.initRoute();
    }

    static get name() {
        return "route";
    }

    static get supportsSelector() {
        return true;
    }

    //
    // route
    //

    initRoute() {
        const route = this.attribute.value;
        const { definition, fns } = extractJSFunctions(route);
        this.jsfns = fns;
        this.route = definition;
    }

    get hasVariables() {
        return this.jsfns?.length > 0;
    }

    //
    //
    //

    async elementTriggered() {
        if (this.element.hasAttribute("disabled")) return;
        if (this._active) return;
        this._active = true;

        const fns     = this.fns;
        const ev      = this.evaluator;
        const vm      = this.getAttachedViewModel();
        const router  = universe.uirouter;

        debuglog("** aurora-route > triggered ", this.auroraName, this.attribute.name, this.attribute.value);

        if (!this.isEnabled()) return;

        try {
            let route = this.route;
            if (route === '@back') router.back();
            if (!fns.is_empty) {
                const otherparams = this.elementAndAttributeParams();
                const fnparams = ev.buildFnParamValues(vm.model, vm, otherparams);
                const params = await this.evaluateParams(fns, fnparams);
                // replace variables
                route = replaceTplString(route, params);
            }
            if (route) router.routePath(route);
        } catch (e) {
            console.log("aurora-route: eval error > ", e.message);
        }
        delete this._active;
    }

    isEnabled() {
        const element = this.element;
        let val;
        if (val = element.getAttribute("disabled")) return val == undefined || val === "false";
        if (val = element.getAttribute("enabled"))  return val === "true";
        return (element.classList.contains("enabled") || !element.classList.contains("disabled"));
    }

    async evaluateParams(fns, fnparams) {
        if (!this.hasVariables) return;
        const results = [];
        for await (const fn of fns) {
            try {
                const value = await fn(fnparams);
                results.push(value);
            } catch (e) {
                console.log("aurora-route: eval error > ", e.message);
            }
        }
        return results;
    }

    get fns() {
        if (!this._fns) {
            const element = this.element;
            const ev = new Evaluator();
            const fns = [];
            const jsfns = this.jsfns;
            jsfns.forEach(jsfn => {
                try {
                    const fn = ev.buildFN(jsfn, this.elementAndAttributeParamNamess());
                    fns.push(element ? fn.bind(element) : fn);
                } catch (e) {
                    // there was an error creating the function
                    console.log("aurora-route ERROR in '" + e.expression + "' ->", e.message);
                }
            });
            this.evaluator = ev;
            this._fns = fns;
        }
        return this._fns;
    }

    //
    // view model
    //

    connectElementListeners(element) {
        element = element ?? this.element;
        if (!element) return;  // can't connect
        const eventname = this.selector ?? 'click';
        element.addEventListener(eventname, this.elementListener);
    }

}

AuroraElement.useAuroraAttribute(AuroraAttributeRoute);
