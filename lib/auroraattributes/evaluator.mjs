/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

const CONTEXT_VARS = [
    '$',
    '$model',
    '$meta',
    '$vm',
    '$viewmodel',
    // '$view',
    '$viewmeta',
    '$interface',
    '$i',
];

const VIEW_VARS = [
    '$ref'
]

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
const REDEFINES = [...Object.keys(window).filter(name => name !== 'window' && name !== 'self' && name !== 'globalThis').filter(name => !AVAILABLES.includes(name))];

const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

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


    getParams() {
        // local params can override wrapped params, but context params can not be redefined
        let params = { ...this.getWrappedParams(), ...this.getLocalParams(), ...this.getContextParams() };
        return params;
    }

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

    //
    // create function with import from data URL
    //

    async buildFN2(name, expression) {
        const globals = REDEFINES.map(name => `const ${name} = {};`).join('\n');
        const fnparams = [...WRAPPED, ...CONTEXT_VARS];
        let js = `
const window = { window: 'Window' };
const self = window;
const globalThis = window;
${globals}
export default function ${name ?? 'fn'}({${fnparams.join(', ')}} = {}) {
return (
${santitizeExpression(expression)}
)
}
`;
        let fn = (await import("data:application/javascript;charset=utf-8," + encodeURIComponent(js))).default;
        return fn;
    }

    //
    // same with Function()
    //

    buildFN(expression) {
        const globals = REDEFINES.map(name => `const ${name} = {};`).join('\n');
        const fnparams = [...WRAPPED, ...CONTEXT_VARS];
        let js = `
const window = { window: 'Window' };
const self = window;
const globalThis = window;
${globals}
const result = (() => {
return (
${santitizeExpression(expression)}
)
})();
return result;
`;
        let fn = new AsyncFunction(`{${fnparams.join(', ')}} = {}`, js);
        // let fn = Function(`{${fnparams.join(', ')}} = {}`, js);
        // fn.name = name;  !! READONLY
        return fn;
    }



}
