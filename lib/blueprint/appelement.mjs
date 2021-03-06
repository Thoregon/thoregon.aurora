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
            let inipath   = `${this.uiBase}/views/blueprint/config.ini`;
            let res = await fetch(inipath);
            if (res.ok) {
                let ini              = await res.text();
                let config           = parseIni(ini);
                return config;
            }
        } catch (e) {
            console.log(e);
        }
    }

    async templates() {
        let templates     = {};
        let tplpath = `${this.uiBase}/views/blueprint/app.jst`;
        try {
            let res = await fetch(tplpath);
            if (res.ok) templates['blueprint'] = await res.text();
        } catch (ignore) { }
        return templates;
    }

    async getComponentTranslations() {
        try {
            let inipath   = `${this.uiBase}/views/blueprint/i18n.json`;
            let res = await fetch(inipath);
            if (res.ok) {
                let ini            = await res.text();
                let i18n           = JSON.parse(ini);
                _i18n[this.elemId] = i18n;
                return i18n;
            }
        } catch (ignore) { }
    }

    async elementStyle(templatename) {
        let inipath   = `${this.uiBase}/views/blueprint`;
        let styles    = [];
        let csspath;

        // get color definition if any
        try {
            let res = await fetch(`${inipath}/colors.xml`);
            if (res.ok) {
                let xml       = await res.text();
                let colorDefs = asColorDefinitions(xml);
                let colorCSS  = AuroraColors.asColorCSS(colorDefs);
                styles.push(colorCSS);
            }
        } catch (ignore) { }
        // style for flex rows
        csspath = `${inipath}/flex.css`;
        try {
            let res = await fetch(csspath);
            if (res.ok) {
                let css = await res.text();
                _cssparts[csspath] = css;
                styles.push(css);
            }
        } catch (ignore) { }
        // style for flex skeleton
        csspath = `${inipath}/skeleton.css`;
        try {
            let res = await fetch(csspath);
            if (res.ok) {
                let css = await res.text();
                _cssparts[csspath] = css;
                styles.push(css);
            }
        } catch (ignore) { }
        // style for component
        csspath = `${inipath}/app.css`;
        try {
            let res = await fetch(csspath);
            if (res.ok) {
                let css = await res.text();
                _cssparts[csspath] = css;
                styles.push(css);
            }
        } catch (ignore) { }

        // collect styles
        return `/* elem: ${this.elemId} */\n${styles.join('\n')}`;
    }

    getDefaultWidth() { return false; }

    async themeBehavior(name) {
        let behaviormodule;
        let behaviorpath = `${this.uiBase}/views/blueprint/app.mjs`;
        try {
            behaviormodule = await import(behaviorpath);
        } catch (e) {
            console.log(`Can't load behavior '${behaviorpath}': ${e.stack ? e.stack : e.message }`);
            // behavior not found, always return empty, don't try to load again
            behaviormodule = { default: undefined };
        }
        return behaviormodule.default;
    }

    propertiesValues() {
        return Object.assign(super.propertiesValues(), { interface: this.app.interfaceSettings });
    }
}
