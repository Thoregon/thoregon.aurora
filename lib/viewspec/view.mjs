/**
 *
 * todo [OPEN]: listen on any model mutations, update view (template placeholders)
 * todo [REFACTOR]: check if a custom element is needed to encapsulate style... -> connect viewmodel after content is displayed!
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import { Q }       from "/evolux.util";
import doT         from "/dot";

import { doAsync, timeout } from "/evolux.universe";

const _tpl      = {};
const _style    = {};
const _vmmodule = {};

export default class View {

    constructor(viewpath, approot) {
        this.approot          = approot;
        this.viewpath         = viewpath;
    }

    static async from(viewpath, approot) {
        let view = new this(viewpath, approot);
        await view.init();
        return view;
    }

    async init() {
        if (!this.viewpath) return;
        let parts = this.viewpath.split('/').filter(part => !!part);
        if (parts.length > 0) this.name = parts[0];
        if (parts.length > 1) this.kind = parts[1]; else this.kind = '';

    }

    async render(parent, ref) {
        // get viewmodel with referenced entity
        let vmc = await this.getViewModelClass();
        let properties = {};
        if (vmc) {
            this.viewmodel = await vmc.with({ modelRef: ref });
            this.viewmodel.intercept2East(async (mutation) => await this.modelMutated(mutation));   // refresh view if properties has changed
            // get entity properties
            properties = this.viewmodel.getWestProperties();
        }
        // build view from template
        let tplstr = await this.getTemplate();
        let tempFn            = doT.template(tplstr, undefined, {});
        let element           = tempFn(properties);
        // style
        let style = await this.getStyle();
        if (style) element = '<style>\n' + style + '\n</style>\n' + element;
        // show
        this.container = parent.viewContent(element);
        // connect view to viewmodel -> REFACTOR: do when all child elements are rendered
        if (this.viewmodel) this.viewmodel.view = this.container;
    }

    dispose() {
        // invoked on top level element of view from UI router when router changes view
        // implement by subclass
        // [...this.container.children].forEach(elem => elem.disposeView());
    }

    destroy() {
        // invoked when element is disconnected from the DOM e.g. view closes
        // implement by subclass
    }

    async modelMutated(mutation) {
        return true;
    }

    get vpath() {
        return `${this.approot}/views/${this.name}`;
    }

    get kindname() {
        return `${this.name}${this.kind}`;
    }

    async getTemplate() {
        let id = `${this.viewpath}`;
        if (_tpl[id]) return _tpl[id];
        return await Q(`${id}/template`, async () => {
            let resourcepath = `${this.vpath}/${this.kindname}.jst`;
            try {
                let res = await fetch(resourcepath);
                if (res.ok) _tpl[id] = await res.text();
            } catch (ignore) { }
            return _tpl[id];
        });
    }

    async getStyle() {
        let id = `${this.viewpath}`;
        if (_style[id]) return _style[id];
        return await Q(`${this.viewpath}/style`, async () => {
            let styles    = [];
            let resourcepath = `${this.vpath}/${this.name}.css`;
            try {
                let res = await fetch(resourcepath);
                if (res.ok) styles.push(await res.text());
            } catch (ignore) { }
            resourcepath = `${this.vpath}/${this.kindname}.css`;
            try {
                let res = await fetch(resourcepath);
                if (res.ok) styles.push(await res.text());
            } catch (ignore) { }
            _style[id] = `/* view: ${this.viewpath} */\n${styles.join('\n')}`;
            return _style[id];
        });
    }

    async getViewModelClass() {
        let id = `${this.viewpath}`;
        if (_vmmodule[id]) return _vmmodule[id].default;
        return await Q(`${this.viewpath}/viewmodel`, async () => {
            let resourcepath = `${this.vpath}/${this.kindname}.mjs`;
            let viewmodelmodule;
            try {
                viewmodelmodule = await import(resourcepath);
            } catch (e) {
                console.log(`Can't load behavior '${resourcepath}': ${e.stack ? e.stack : e.message }`);
                // behavior not found, always return empty, don't try to load again
                viewmodelmodule = { default: undefined };
            }
            _vmmodule[id] = viewmodelmodule;
            return _vmmodule[id].default;
        });
    }
}
