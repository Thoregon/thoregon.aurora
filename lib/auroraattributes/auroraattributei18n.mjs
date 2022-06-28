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

import translate, * as plurals from './i18n/translate.mjs';

const debuglog = (...args) => {}; // {};   // console.log(...args);

export default class AuroraAttributeI18N extends AuroraAttribute {

    constructor(...args) {
        super(...args);
        this.modelListener = () => this.modelMutated();
        this.resolveI18n();
        this.setInitialValue();
    }

    static get name() {
        return "i18n";
    }

    static get supportsSelector() {
        return true;
    }

    //
    // resolveI18n()
    //

    resolveI18n() {
        const string = this.attribute.value;
        let i,j;
        let i18nAttribute = "";
        let token         = "";
        let subkey        = undefined;
        let replacements  = "";

        i = string.lastIndexOf('|');
        let defaultText   = i > -1 ? string.substring(i+1) : "";
        i18nAttribute     = i > -1 ? string.substring(0,i) : string;

        i = string.lastIndexOf('(');

        token = i > -1 ? i18nAttribute.substring(0, i) : i18nAttribute;
        replacements = ii > -1 ? i18nAttribute.substring(i+1) : undefined;

        const parts = token.split('.');
        if (parts.length > 1) {
            token = parts[0];
            subkey = parts[1];
        }
        if (replacements) replacements = this.parseReplacements(replacements);

        this.i18n = {
            defaultText  : defaultText,
            i18nAttribute: i18nAttribute,
            token        : token,
            subkey       : subkey,
            replacements : replacements,
            // i18nSpan     : '<span aurora-i18n="'+ i18nAttribute +'">'+ defaultText +'</span>'
        };

        this.translate =  translate(transl, {
            pluralize: plurals.plural_EN,       // todo: select language
        })
    }

    hasTextVariables() {
        return !! this.i18n.replacements;
    }

    //
    //
    //

    setInitialValue() {
        if (this.hasTextVariables()) return;
        const result = this.i18n.subkey
                       ? this.translate(this.i18n.token, this.i18n.subkey)
                       : this.translate(this.i18n.token);
        if (prop in element) {
            // if it is a normal property, set it
            element[prop] = result;
        } else {
            // set the elements attribute
            element.setAttribute(prop, result);
        }
    }

    async modelMutated() {
        const fn      = this.fn;
        const ev      = this.evaluator;
        const vm      = this.getAttachedViewModel();
        const prop    = this.selector ?? 'innerHTML';
        const element = this.element;
        if (!vm || !fn || !prop) return;
        const params = ev.buildFnParamValues(vm.model, vm);

        debuglog("** aurora-i18n > modelMutated ", this.auroraName, this.attribute.name, this.attribute.value);

        try {
            const params = await this.evaluateParams();
            const result = this.i18n.subkey
                             ? this.translate(this.i18n.token, this.i18n.subkey, params)
                             : this.translate(this.i18n.token, params);
            if (prop in element) {
                // if it is a normal property, set it
                element[prop] = result;
            } else {
                // set the elements attribute
                element.setAttribute(prop, result);
            }
        } catch (e) {
            console.log("aurora-i18n: eval error > ", e.message);
        }
    }

    async evaluateParams() {
        if (!this.hasTextVariables()) return;
        const params = ev.buildFnParamValues(vm.model, vm);
        const results = {}
        const fns = this.i18n.replacements;
        const names = Object.keys(fns);
        for await (const name of names) {
            try {
                const fn    = await fns[name];
                const value = await fn(params);
                results[name] = value;
            } catch (e) {
                console.log("aurora-i18n: eval error > ", e.message);
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
        if (!this.hasTextVariables()) return;
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
        if (!this.hasTextVariables()) return;
        viewModel.addMutationListener(this.modelListener);
    }

}

AuroraElement.useAuroraAttribute(AuroraAttributeI18N);
