/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */
import AuroraApp     from "./auroraapp.mjs";
import AuroraElement from "../auroraelement.mjs";
import listeners     from "../../ext/dragula/dragula.mjs";

export default class AppElement extends AuroraApp(AuroraElement) {

    constructor(...args) {
        super(...args);
        this._listeners = {};
    }


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
        } catch (ignore) {
            console.error(ignore)
        }
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
            let res = await this.fetch(`${inipath}/material.css`);
            if (res.ok) {
//                let xml       = await res.text();
//                let colorDefs = asColorDefinitions(xml);
//                let colorCSS  = AuroraColors.asColorCSS(colorDefs);
//                styles.push(colorCSS);
            }
        } catch (ignore) {
            // not existing -> build it...
        }
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

    //
    // triggers: use to recognize if the user clicks somewhere on the UI. components may react e.g. by closing a menu
    //

    /**
     * called if the app is the top most
     * create an envelop for the app itself
     * the envelop provides basic UI elements like menu, indicators and status displays
     */
    prepareEnveloping() {
        this.listenWidgetEvents();  // todo [OPEN]: only when app used as widget
    }


    observeTriggers(container) {
        container.addEventListener('click', (evt) => this._triggerClicked(evt), true);
    }

    _triggerClicked(evt) {
        this.emitEvent('window-clicked', new Event('window-clicked'));
        this.emitWidgetEvent({ type: 'window-clicked' }); // todo[OPEN]: add coordinates
        let elem = (evt.path?.[0] ?? evt.currentTarget ?? evt.target ?? {}).parentAuroraElement();
        elem?.triggerClicked?.(evt);
    }

    listenWidgetEvents() {
        window.addEventListener('message', (evt) => this.widgetEvent(evt));
    }

    widgetEvent(evt) {
        // check if the message comes from the embedded widget
        // if (!this.widgetURL.startsWith(evt.origin)) return;

        const data = evt.data;
        if (!data) return;

        const type = data.type;
        if (!type) return;

        // console.log('>> WidgetEvent', data);
        // todo [OPEN]
        //  - surroundingClick
        //  - resize from outside (ifram parent)
        switch (type) {
            case 'setParams':
                this.handleParams(data.params);
                break;
        }
    }

    handleParams(params) {
        this._params = params;
        this.dispatchAppEvent('setParams', params);
    }

    get appParams() {
        return this._params;
    }

    //
    // app (widget) element listeners
    //

    addAppEventListener(eventname, listener) {
        let eventlisteners = this._listeners[eventname];
        if (!eventlisteners) eventlisteners = this._listeners[eventname] = [];
        eventlisteners.push(listener);
    }

    removeAppEventListener(eventname, handler) {
        let eventlisteners = this._listeners[eventname];
        if (!eventlisteners) return;
        this._listeners[eventname] = eventlisteners.filter((fn) => fn !== listener);
    }

    dispatchAppEvent(eventname, details) {
        let eventlisteners = this._listeners[eventname];
        if (!eventlisteners) return;
        eventlisteners.forEach((listener) => {
            try {
                listener(details);
            } catch (e) {
                console.log("AppElement listener error:", e);
            }
        })
    }
}
