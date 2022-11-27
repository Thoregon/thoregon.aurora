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

import { replaceTplString, parseI18N, parseKeyValue, extractKeyValue } from "/evolux.util/lib/formatutils.mjs";

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

    static get supportsMultiple() {
        return true;
    }

    //
    // resolveI18n()
    //

    resolveI18n() {
        const string      = this.attribute.value;
        this.i18n         = parseI18N(string);
        this.hasVariables = !this.i18n.fns.is_empty;
        this.translate    = app?.getTranslator() ?? ((...args) => `${args.join(',')}`);
    }

    //
    //
    //

    setInitialValue() {
        if (this.hasVariables) return;
        const prop              = this.selector ?? 'innerHTML';
        const element           = this.element;
        const replacements      = parseKeyValue(this.i18n.replacements); // extractKeyValue(this.i18n.replacements);
        const { token, subkey, defaultText } = this.i18n;

        // in this case no variables need to be replaced, translated text is static
        let result = this.i18n.subkey
                       ? this.translate(this.i18n.token, this.i18n.subkey, replacements)
                       : this.translate(this.i18n.token, replacements);

        if ( result === token   &&
             defaultText != undefined ) {
            result = defaultText;
        }

        if (result === token && subkey) result = `${token}.${subkey}`;
        try {
            if (prop in element) {
                // if it is a normal property, set it
                element[prop] = result;
            } else {
                // set the elements attribute
                element.setAttribute(prop, result);
            }
        } catch (e) { }
    }

    async modelMutated() {
        if (this._active) return;

        const fns     = this.fns;
        const ev      = this.evaluator;
        const vm      = this.getAttachedViewModel();
        const prop    = this.selector ?? 'innerHTML';
        const element = this.element;
        if (!vm || !prop) return;

        debuglog("** aurora-i18n > modelMutated ", this.auroraName, this.attribute.name, this.attribute.value);

        try {
            this._active = true;
            const otherparams = this.elementAndAttributeParams();
            const fnparams = ev.buildFnParamValues(vm.model, vm, otherparams);
            const params = await this.evaluateParams(fns, fnparams);
            // replace variables
            const { token, subkey, replacements } = this.replaceParams(this.i18n, params);
            let result = subkey
                             ? this.translate(token, subkey, replacements)
                             : this.translate(token, replacements);
            if (result === token && subkey) result = `${token}.${subkey}`;
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
        delete this._active;
    }

    replaceParams(i18n, params) {
        let { token, subkey, replacements } = i18n;

        // the params will be consumed! each call to 'replaceTplString' will remove the params used from the array!
        token        = replaceTplString(token, params);
        subkey       = replaceTplString(subkey, params);
        replacements = parseKeyValue(replaceTplString(replacements, params));

        return { token, subkey, replacements };
    }

    async evaluateParams(fns, fnparams) {
        if (!this.hasVariables) return;
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

    get fns() {
        if (!this._fns) {
            const element = this.element;
            const ev = new Evaluator();
            const fns = [];
            const jsfns = this.i18n.fns;
            jsfns.forEach(jsfn => {
                try {
                    const fn = ev.buildFN(jsfn, this.elementAndAttributeParamNamess());
                    fns.push(element ? fn.bind(element) : fn);
                } catch (e) {
                    // there was an error creating the function
                    console.log("aurora-i18n ERROR in '" + e.expression + "' ->", e.message);
                }
            });
            this.evaluator = ev;
            this._fns = fns;
        }
        return this._fns;
    }

    firstSyncFnValue() {
        this.modelMutated();
    }

    doFirstSync() {
        if (!this.hasVariables) return;
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
        if (!this.hasVariables) return;
        viewModel.addMutationListener(this.modelListener);
    }

}

AuroraElement.useAuroraAttribute(AuroraAttributeI18N);
