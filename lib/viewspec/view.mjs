/**
 *
 * todo [REFACTOR]: check if a custom element is needed to encapsulate style...
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import { Q } from "/evolux.util";
import doT   from "/dot";


export default class View {

    constructor(viewpath, approot) {
        this.approot          = approot;
        this.viewpath         = viewpath;
        this._tpl             = undefined;             // template
        this._style           = undefined;             // css styles
        this._viewmodelmodule = undefined;             // viewmodel
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
        // connect view to viewmodel
        if (this.viewmodel) this.viewmodel.view = this.container;
    }

    get vpath() {
        return `${this.approot}/views/${this.name}`;
    }

    get kindname() {
        return `${this.name}${this.kind}`;
    }

    async getTemplate() {
        if (this._tpl) return this._tpl;
        return await Q(`${this.viewpath}/template`, async () => {
            let resourcepath = `${this.vpath}/${this.kindname}.jst`;
            try {
                let res = await fetch(resourcepath);
                if (res.ok) this._tpl = await res.text();
            } catch (ignore) { }
            return this._tpl;
        });
    }

    async getStyle() {
        if (this._style) return this._style;
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
            this._style = `/* view: ${this.viewpath} */\n${styles.join('\n')}`;
            return this._style;
        });
    }

    async getViewModelClass() {
        if (this._viewmodelmodule) return this._viewmodelmodule.default;
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
            this._viewmodelmodule = viewmodelmodule;
            return this._viewmodelmodule.default;
        });
    }
}
