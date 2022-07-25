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

export default class AuroraAttributeI18N extends AuroraAttribute {

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
        const fns     = this.fns;
        const ev      = this.evaluator;
        const vm      = this.getAttachedViewModel();
        const prop    = this.selector ?? 'innerHTML';
        const element = this.element;
        if (!vm || !prop) return;

        debuglog("** aurora-route > triggered ", this.auroraName, this.attribute.name, this.attribute.value);

        try {
            let route = this.route;
            if (this.hasVariables) {
                const fnparams = ev.buildFnParamValues(vm.model, vm);
                const params = await this.evaluateParams(fns, fnparams);
                // replace variables
                route = this.replaceParams(params);
            }
            if (route) universe.uirouter.routePath(route);
        } catch (e) {
            console.log("aurora-route: eval error > ", e.message);
        }
    }

    replaceParams(params) {
        let route = this.attribute.value;
        route = replaceTplString(route, params);
        return route;
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

    buildFnParamValues(model, viewmodel) {
        // [...WRAPPED, ...CONTEXT_VARS];
        const fnparams = {
            'indexedDB' : WRAPPED_GLOBALS.indexedDB,
            'localStore': WRAPPED_GLOBALS.localStore,
            '$'         : model,
            '$model'    : model,
            '$meta'     : model?.metaClass,
            '$vm'       : viewmodel,
            '$viewmodel': viewmodel,
            '$viewmeta' : viewmodel?.metaClass,
            // '$view' : this.element,
            '$interface': universe.uirouter.app.interfaceSettings,
            '$i'        : universe.uirouter.app.interfaceSettings,
        };
        return fnparams;
    }

    get fns() {
        if (!this._fns) {
            const element = this.element;
            const ev = new Evaluator();
            const fns = [];
            const jsfns = this.jsfns;
            jsfns.forEach(jsfn => {
                try {
                    const fn = ev.buildFN(jsfn);
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

AuroraElement.useAuroraAttribute(AuroraAttributeI18N);
