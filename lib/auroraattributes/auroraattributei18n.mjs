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

import { replaceTplString, parseTplString, parseI18N, extractKeyValue } from "/evolux.util/lib/formatutils.mjs";

// import translate, * as plurals from './i18n/translate.mjs';

const debuglog = (...args) => {}; // {};   // console.log(...args);

var I18N_NOPTIONS = {
    // These are the defaults:
    debug: false,  //[Boolean]: Logs missing translations to console and add "@@" around output, if `true`.
    array: false,  //[Boolean]: Returns translations with placeholder-replacements as Arrays, if `true`.
    resolveAliases: false,  //[Boolean]: Parses all translations for aliases and replaces them, if `true`.
    pluralize: function(n){ return Math.abs(n) },  //[Function(count)]: Provides a custom pluralization mapping function, should return a string (or number)
    useKeyForMissingTranslation: true //[Boolean]: If there is no translation found for given key, the key is used as translation, when set to false, it returns undefiend in this case
}

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
        this.i18n = parseI18N(string);

        let allfns;



        this.hasTextVariables = !this.i18n.fns.is_empty; // string.indexOf('${') > -1;
/*
        this.translate =  translate(transl, {
            ...I18N_NOPTIONS,
            pluralize: plurals.plural_EN,       // todo: select language
        });
*/
        this.translate = (...args) => `${args.join(',')}`;

    }

    //
    //
    //

    setInitialValue() {
        if (this.hasTextVariables) return;
        const prop    = this.selector ?? 'innerHTML';
        const element = this.element;
        // in tis case no variables need to be replaced, translated text is static
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
        const fns     = this.fns;
        const ev      = this.evaluator;
        const vm      = this.getAttachedViewModel();
        const prop    = this.selector ?? 'innerHTML';
        const element = this.element;
        if (!vm || !prop) return;
        const fnparams = ev.buildFnParamValues(vm.model, vm);

        debuglog("** aurora-i18n > modelMutated ", this.auroraName, this.attribute.name, this.attribute.value);

        try {
            const params = await this.evaluateParams(fns, fnparams);
            // replace variables
            const { token, subkey, replacements } = this.replaceParams(this.i18n, params);
            const result = subkey
                             ? this.translate(token, subkey, replacements)
                             : this.translate(token, params);
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

    replaceParams(i18n, params) {
        let { token, subkey, replacements } = i18n;

        token        = replaceTplString(token, params);
        subkey       = replaceTplString(subkey, params);
        replacements = extractKeyValue(replaceTplString(replacements, params));

        return { token, subkey, replacements };
    }

    async evaluateParams(fns, fnparams) {
        if (!this.hasTextVariables) return;
        const results = [];
        for await (const fn of fns) {
            try {
                const value = await fn(fnparams);
                results.push(value);
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

    get fns() {
        if (!this._fns) {
            const element = this.element;
            const ev = new Evaluator();
            const fns = [];
            const jsfns = this.i18n.fns;
            jsfns.forEach(jsfn => {
                const fn = ev.buildFN(jsfn);
                fns.push(element ? fn.bind(element) : fn);
            });
            this.evaluator = ev;
            this._fns = fns;
        }
        return this._fns;
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
        if (!this.hasTextVariables) return;
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
        if (!this.hasTextVariables) return;
        viewModel.addMutationListener(this.modelListener);
    }

}

AuroraElement.useAuroraAttribute(AuroraAttributeI18N);
