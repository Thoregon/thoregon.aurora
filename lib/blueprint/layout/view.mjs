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

import { forEach, Q } from "/evolux.util";
import doT            from "../../formating/doT.mjs";
import { selectPath } from "../../util.mjs";

import AuroraElement from "../../auroraelement.mjs";

const _tpl      = {};
const _style    = {};
const _vmmodule = {};

export default (base) => class View extends (base || AuroraElement) {


    initView() {
        let view = this.view;
        if (!view) return;
        view = selectPath(view, this.collectedProperties());
        if (!view) return;
        let parts = view.split('/').filter(part => !!part);
        if (parts.length > 0) this.name = parts[0];
        if (parts.length > 1) this.kind = parts[1]; else this.kind = '';
    }


    async initViewModel() {
        // get viewModel with referenced entity
        if (this.viewModel) return this.viewModel;
        let vmc = await this.getViewModelClass();
        if (vmc) {
            if (this.model) {
                this.attachViewModel(await vmc.with({ model: this.model }));
                // this.viewModel.intercept2East(async (mutation) => await this.modelMutated(mutation));   // refresh view if properties has changed
            } else if (this.ref) {
                this.attachViewModel(await vmc.with({ modelRef: this.ref }));
                // this.viewModel.intercept2East(async (mutation) => await this.modelMutated(mutation));   // refresh view if properties has changed
            } else {
                let parentmodel = this.getParentModel();
                if (parentmodel) {
                    this.attachViewModel(await vmc.with({ model: parentmodel }));
                    // this.viewModel.intercept2East(async (mutation) => await this.modelMutated(mutation));   // refresh view if properties has changed
                } else {
                    this.attachViewModel(await vmc.with(/*{ model: universe.observe({}) }*/));
                    // this.viewModel.intercept2East(async (mutation) => await this.modelMutated(mutation));   // refresh view if properties has changed
                }
            }
        }
        return this.viewModel;
    }

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

    get kindname() {
        return `${this.name}/${this.kind}`;
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
        let id = this.viewpath;
        if (_tpl[id]) return _tpl[id];
        return await Q(`${id}/template`, async () => {
            let resourcepath = `${this.vpath}/${this.kindname}.jst`;
            try {
                let res = await this.fetch(resourcepath);
                if (res.ok) _tpl[id] = await res.text();
            } catch (ignore) { }
            return _tpl[id];
        });
    }

    async getStyle() {
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

            resourcepath = `${this.vpath}/${this.name}.css`;
            try {
                let res = await this.fetch(resourcepath);
                if (res.ok) styles.push(this.structCSS(await res.text(), resourcepath, `View '${this.name}'`));
            } catch (ignore) { }
            resourcepath = `${this.vpath}/${this.kindname}.css`;
            try {
                let res = await this.fetch(resourcepath);
                if (res.ok) styles.push(this.structCSS(await res.text(), resourcepath, `View Kind '${this.kindname}'`));
            } catch (ignore) { }
            _style[id] = styles.join('\n');
            return _style[id];
        });
    }

    async __styles() {
/*
        //
        // style from blueprint
        //
        resourcepath = this.approot + '/blueprint/app.css';
        try {
            let res = await this.fetch(resourcepath);
            if (res.ok) styles.push(await res.text());
        } catch (ignore) { }

        // style for flex rows
        let csspath   = `${this.themeRoot}/${theme}/flex.css`;
        try {
            let res = await this.fetch(csspath);
            if (res.ok) {
                let css = await res.text();
                styles.push(css);
            }
        } catch (ignore) { }

        // style for flex skeleton
        csspath   = `${this.themeRoot}/${theme}/skeleton.css`;
        try {
            let res = await this.fetch(csspath);
            if (res.ok) {
                let css = await res.text();
                styles.push(css);
            }
        } catch (ignore) { }

        //
        // basic theme styles from aurora and app
        //

        let resourcepath = `${this.themeRoot}/${theme}/${theme}.css`;
        try {
            let res = await this.fetch(resourcepath);
            if (res.ok) styles.push(await res.text());
        } catch (ignore) {
            console.log(ignore);
        }
        let approot = this.appUiRoot;
        if (approot) {
            resourcepath = `${approot}/${theme}/${theme}.css`;
            try {
                let res = await this.fetch(resourcepath);
                if (res.ok) styles.push(await res.text());
            } catch (ignore) { }
        }
*/
    }


    async getViewModelClass() {
        let id = this.viewpath;
        if (_vmmodule[id]) return _vmmodule[id].default;
        return await Q(`${this.viewpath}/viewmodel`, async () => {
            let resourcepath = `${this.vpath}/${this.kindname}.mjs`;
            let viewmodelmodule;
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
