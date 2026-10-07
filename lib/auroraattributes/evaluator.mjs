/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import FUNCTIONS from './auroraattributefunctions.mjs';

const CONTEXT_VARS = [
    '$',
    '$model',
    '$meta',
    '$vm',
    '$viewmodel',
    '$REF',
    // '$view',
    '$viewmeta',
    '$interface',
    '$i',
    '$blueprint',
];

const ALLOWED_GLOBALS = [
    // globals from Thoregon
    'universe',
    'thoregon',
    'dorifer',
    'mediathek',
    'device',
    'app',
    'agent',
    'me',
    // usefull globals
    'ResizeObserver',
    'MutationObserver',
];

const WRAPPED_GLOBALS = {
    'indexedDB' : {},
    'localStore' : {},

};
const WRAPPED  = Object.keys(WRAPPED_GLOBALS);
const AVAILABLES = [...ALLOWED_GLOBALS, ...Object.keys(WRAPPED_GLOBALS)];
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

const isValidBinding = name => {
    try {
        new AsyncFunction(`const ${name} = {};`);
        return true;
    } catch {
        return false;
    }
};

const REDEFINES = Object.keys(window).filter(name =>
    !['window', 'self', 'globalThis'].includes(name)
    && !AVAILABLES.includes(name)
    && isValidBinding(name)
);

// some expressions are not valid as the right side of an assignment.
// detect and wrap it in a self executing function so that no syntax error is thrown
const santitizeExpression = (expression) => false
                            // Support expressions starting with "if" statements like: "if (...) doSomething()"
                            || /^[\n\s]*if.*\(.*\)/.test(expression)
                            // Support expressions starting with "let/const" like: "let foo = 'bar'"
                            || /^(let|const)\s/.test(expression)
                            ? `(() => { ${expression} })()`
                            : expression

export default class Evaluator {

/*
    getParams() {
        // local params can override wrapped params, but context params can not be redefined
        let params = { ...this.getWrappedParams(), ...this.getLocalParams(), ...this.getContextParams() };
        return params;
    }
*/

    // todo: can not be defined here, must come from the elements context
    getLocalParams() {
        let params = {};
        return params;
    }

    getContextParams() {
        let params = {};
        CONTEXT_VARS.forEach(name => params[name] = { [name]: 1 });
        return params;
    }

    getWrappedParams() {
        let params = {...WRAPPED_GLOBALS};
        return params;
    }

    buildFnParamValues(model, viewmodel, otherparams = {}) {
        model     = model     ?? {};
        viewmodel = viewmodel ?? {};
        const fnparams = {
            '$scope'    : viewmodel,
            'indexedDB' : WRAPPED_GLOBALS.indexedDB,
            'localStore': WRAPPED_GLOBALS.localStore,
            '$'         : model,
            '$model'    : model,
            '$meta'     : model?.metaClass,
            '$vm'       : viewmodel,
            '$viewmodel': viewmodel,
            '$REF'      : viewmodel?.['@REF'],
            '$viewmeta' : viewmodel?.metaClass,
            '$router'   : universe.uirouter,
            '$interface': universe.uirouter.app.interfaceSettings,
            '$i'        : universe.uirouter.app.interfaceSettings,
            '$blueprint': universe.uirouter.getBlueprint(),
            '$bp'       : universe.uirouter.getBlueprint(),
            ...FUNCTIONS,
            ...otherparams
        };
        return fnparams;
    }

    //
    // same with Function()
    //

    buildFN(expression, otherparams = []) {
        const fnparams = [...new Set([
            '$scope',
            ...WRAPPED,
            ...CONTEXT_VARS,
            ...Object.keys(FUNCTIONS),
            ...otherparams
        ])];

        const declarations = [
            "window = { window: 'Window' }",
            'self = window',
            'globalThis = window',
            ...REDEFINES
                .filter(name => !fnparams.includes(name))
                .map(name => `${name} = {}`)
        ];

        const sanitized = santitizeExpression(expression);
        const js = `
const ${declarations.join(', ')};
with ($scope) {
    return await (
        ${sanitized}
    );
}
`;

        try {
            return new AsyncFunction(`{${fnparams.join(', ')}} = {}`, js);
        } catch (e) {
            e.expression = `(${sanitized})`;
            e.generatedSource = js;
            throw e;
        }
    }


    //
    // create function with import from data URL
    //

    async buildFNwithImport(expression, name) {
        const globals = REDEFINES.map(name => `${name} = {};`).join(', ');
        const fnparams = ['$scope', ...WRAPPED, ...CONTEXT_VARS];
        let js = `const window = { window: 'Window' }, self = window, globalThis = window, ${globals};
export default async function ${name ?? 'fn'}({${fnparams.join(', ')}} = {}) {
    return await (  with ($scope) { 
        ${santitizeExpression(expression)}
    } )
}
`;
        let fn = (await import("data:application/javascript;charset=utf-8," + encodeURIComponent(js))).default;
        return fn;
    }

}
