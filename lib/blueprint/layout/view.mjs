/**
 * Base class as mixin for a view
 *
 * get view definitions comprised of
 * - template
 * - style
 * - view model (behavior)
 *
 * is not an AuroraElement!
 * provides behavior to create views from an app
 *
 * todo [REFACTOR]: change from name:kind to a path
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import { Q } from "/evolux.util";
import doT            from "../../formating/doT.mjs";
import { selectPath } from "../../util.mjs";

import AuroraBlueprintElement from "./aurorablueprintelement.mjs";

const _tpl      = {};
const _style    = {};
const _vmmodule = {};

const debuglog = (...args) => {}; // {};   // console.log(...args);

export default (base) => class View extends (base || AuroraBlueprintElement) {

    get hasOwnStyle() {
        return true;
    }

    initView() {
        let view = this.view;
        if (!view) return;
        view = selectPath(view, this.collectedProperties());
        if (!view) return;
        this.name = view;
        // let parts = view.split('/').filter(part => !!part);
        // if (parts.length > 0) this.name = parts[0];
        //         if (!this.name) return;if (parts.length > 1) this.kind = parts[1]; else this.kind = '';
    }


    async initViewModel() {
        // get viewModel with referenced entity
        if (this.viewModel) return this.viewModel;
        let vmc = await this.getViewModelClass();
        debuglog("## initViewModel 1", this, vmc?.constructor.name);
        if (vmc) {
            if (this.model) {
                debuglog("## initViewModel with model", this, vmc.constructor.name);
                await this.attachViewModel(await vmc.with({ model: this.model }));
            } else if (this.useModelProperty()) {
                debuglog("## initViewModel with model property", this, vmc.constructor.name);
                const model = await this.getModelProperty();
                await this.attachViewModel(await vmc.with( model ? { model } : {} ));
            } else if (this.useViewModelProperty()) {
                debuglog("## initViewModel with view model property", this, vmc.constructor.name);
                const model = await this.getViewModelProperty();
                await this.attachViewModel(await vmc.with( model ? { model } : {} ));
            } else if (this.ref) {
                debuglog("## initViewModel with ref", this, vmc.constructor.name);
                await this.attachViewModel(await vmc.with({ modelRef: this.ref }));
            } else {
                const params = {};
                if (await this.useParentViewModel()) {
                    let parentmodel = this.getParentModel();
                    if (parentmodel) params.model = parentmodel;
                }
                debuglog("## initViewModel with params", this, vmc.constructor.name, params);
                await this.attachViewModel(await vmc.with(params));
            }
        }
        return this.viewModel;
    }
/*

    useModelProperty() {
        return false;
    }

    async getModelProperty() {
        return undefined;
    }

    useViewModelProperty() {
        return false;
    }

    async getViewModelProperty() {
        return undefined;
    }

    useParentViewModel() {
        return false;
    }
*/

    getParentModel() {
        let parent = this.uibase || this.parentElement;
        let model;
        while (parent && !model) {
            model = parent.viewModel?.model;
            parent = parent.uibase || parent.parentElement;
        }
        return this.property && model ? model[this.property] : model;
    }

    async modelMutated(mutation) {
        return true;
    }

    get vpath() {
        return `${this.approot}/views/${this.name}`;
    }

    get templateElements() {
        return {
            theme: 'material'
        }
    }

    get viewpath() {
        return this.view;
    }

    async getTemplate() {
        if (!this.name) return;
        let id = this.viewpath;
        if (_tpl[id]) return _tpl[id];
        return await Q(`${id}/template`, async () => {
            let resourcepath = `${this.vpath}/${this.filename}.jst`;
            try {
                let res = await this.fetch(resourcepath);
                if (res.ok) _tpl[id] = await res.text();
            } catch (ignore) { }
            return _tpl[id];
        });
    }

    async getStyle() {
        if (!this.name) return;
        let id = this.viewpath;
        if (_style[id]) return _style[id];
        return await Q(`${this.viewpath}/style`, async () => {
            let styles    = [];
            let theme = this.templateElements.theme;
            let resourcepath;

            await this.addAllCommonStyles(theme, styles);
            await this.addAppThemeStyles(theme, styles);

            //
            // styles for the view
            //

            resourcepath = `${this.vpath}/${this.filename}.css`;
            try {
                let res = await this.fetch(resourcepath);
                if (res.ok) {
                    const css = this.structCSS(await res.text(), resourcepath, `View '${this.filename}'`);
                    styles.push(css);
                    this._cssStyle = css;
                }
            } catch (ignore) { }
/*
            resourcepath = `${this.vpath}/${this.filename}.css`;
            try {
                let res = await this.fetch(resourcepath);
                if (res.ok) styles.push(this.structCSS(await res.text(), resourcepath, `View Kind '${this.filename}'`));
            } catch (ignore) { }
*/
            _style[id] = styles.join('\n');
            return _style[id];
        });
    }

    get cssStyle() {
        return this._cssStyle ?? '';
    }

/*
    async useParentViewModel() {
        return !!this.getAttribute("set-parent-viewmodel");
    }
*/

    async getViewModelClass() {
        if (!this.name) return;
        let id = this.viewpath;
        debuglog("## getViewModelClass 1", id, this);
        if (_vmmodule[id]) return _vmmodule[id].default;
        return await Q(`${this.viewpath}/viewmodel`, async () => {
            let resourcepath = `${this.vpath}/${this.filename}.mjs`;
            let viewmodelmodule;
            debuglog("## getViewModelClass 2", id, this);
            try {
                viewmodelmodule = await this.import(resourcepath);
            } catch (e) {
                console.log(`Can't load behavior '${resourcepath}': ${e.stack ? e.stack : e.message }`);
                // behavior not found, always return empty, don't try to load again
                viewmodelmodule = { default: undefined };
            }
            _vmmodule[id] = viewmodelmodule;
            return _vmmodule[id].default;
        });
    }

    get appUiRoot() {
        return universe.uirouter?.appelement?.uiRoot;
    }

    async buildViewElements() {
        // this.initView();
        // if (!await this.initViewModel()) return;
        // build view from template
        let tplstr  = await this.getTemplate();
        if (!tplstr) return '<span></span>';
        let tempFn  = doT.template(tplstr, undefined, {});
        let properties = { interface: { ...this.app.thoregonApp.interfaceSettings} /*, ...(await this.getModelProperties()), ...this.getVMProperties()*/ }
        let element = tempFn(properties);
        // style
        let style   = await this.getStyle();
        if (style) element = '<style>\n' + style + '\n</style>\n' + element;
        return element;
    }

}
