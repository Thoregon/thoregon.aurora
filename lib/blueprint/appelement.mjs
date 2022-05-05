/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */
import AuroraApp              from "./auroraapp.mjs";
import AuroraElement          from "../auroraelement.mjs";
import { asColorDefinitions } from "../util.mjs";
import AuroraColors           from "../colors/auroracolors.mjs";

export default class AppElement extends AuroraApp(AuroraElement) {

    getAppViewRoot() {
        return this.uiBase;
    }

    /*
     * start behavior
     */

    async isWelcome() {
        return false;       // todo: check if any service is created so far, then answer false
    }

    /*
     * view elements like templates, styles, behavior, ...
     */

    get appliedTemplateName() {
        return 'blueprint';
    }

    async getComponentConfig() {
        try {
            let inipath   = `${this.uiBase}/blueprint/config.ini`;
            let res = await this.fetch(inipath);
            if (res.ok) {
                let ini              = await res.text();
                let config           = parseIni(ini);
                return config;
            }
        } catch (e) {
            if (universe.DEBUG) console.log(e);
        }
    }

    async templates() {
        let templates     = {};
        let tplpath = `${this.uiBase}/blueprint/app.jst`;
        try {
            let res = await this.fetch(tplpath);
            if (res.ok) templates['blueprint'] = await res.text();
        } catch (ignore) { }
        return templates;
    }

    async getComponentTranslations() {
        try {
            let inipath   = `${this.uiBase}/blueprint/i18n.json`;
            let res = await this.fetch(inipath);
            if (res.ok) {
                let ini            = await res.text();
                let i18n           = JSON.parse(ini);
                _i18n[this.elemId] = i18n;
                return i18n;
            }
        } catch (ignore) { }
    }

    async elementStyle(templatename) {
/*
        debugger;
        let x = await super.elementStyle(templatename);
        return x;
*/

        let inipath   = `${this.uiBase}/blueprint`;
        let styles    = [];
        let csspath;

        // get color definition if any
        try {
            let res = await this.fetch(`${inipath}/colors.xml`);
            if (res.ok) {
                let xml       = await res.text();
                let colorDefs = asColorDefinitions(xml);
                let colorCSS  = AuroraColors.asColorCSS(colorDefs);
                styles.push(colorCSS);
            }
        } catch (ignore) { }
        // style for component
        csspath = `${inipath}/app.css`;
        try {
            let res = await this.fetch(csspath);
            if (res.ok) {
                let css = await res.text();
                styles.push(css);
                this.appstyle = css;
            }
        } catch (ignore) {}

        // collect styles
        return `/* App Element: ${this.elemId} */\n${styles.join('\n')}`;
    }

    getDefaultWidth() { return false; }

    async themeBehavior(name) {
        let behaviormodule;
        let behaviorpath = `${this.uiBase}/blueprint/app.mjs`;
        try {
            behaviormodule = await this.import(behaviorpath);
        } catch (e) {
            if (universe.DEBUG) console.log(`Can't load behavior '${behaviorpath}': ${e.stack ? e.stack : e.message }`);
            // behavior not found, always return empty, don't try to load again
            behaviormodule = { default: undefined };
        }
        return behaviormodule.default;
    }

    propertiesValues() {
        return Object.assign(super.propertiesValues(), { interface: this.app.interfaceSettings });
    }
}
