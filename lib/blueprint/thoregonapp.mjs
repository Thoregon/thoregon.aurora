/**
 * Top element for a thoregon UI
 * Singleton, exists on once
 * Acts as an envelop/sandbox for all other apps
 *
 * It
 *
 * Manages also UI elements like
 * - menu(s)
 * - indicator(s)
 * - thoregon features
 *   - identity
 *   - karte
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import AuroraApp            from "./auroraapp.mjs";
import AuroraElement        from "../auroraelement.mjs";
import MaterialThoregonApp  from "../../themes/material/app/materialthoregonapp.mjs";
import { doAsync, timeout } from "/evolux.universe/common.mjs";

let instance;

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


export default class ThoregonApp extends AuroraApp(AuroraElement) {

    constructor() {
        super();
        this._prpareQ = null;
        this._x = makeid(5);
    }

    /**
     * get the singleton instance
     * @return {ThoregonApp}
     */
    static get instance() {
        if (!instance) instance = new ThoregonApp();    // Lazy init
        // todo [OPEN]: register in universe
        return instance;
    }

    behaviorClass() {
        return MaterialThoregonApp;
    }


    async templates() {
        return { thoregonapp: '' };
    }

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'thoregon-app';
    }

    get uiRoot() {
        return this.uiComponentRoot;
    }

    isAppElement() {
        return false;
    }

/*
    get appElementSpec() {
        return { elem: this, name: 'ThoregonApp', path: '' };
    }
*/

    async config() {
        await AuroraElement._proxy();
        super.config();
    }
    /**
     * template definition
     * @return {{component: string, templates: [string], theme: string}}
     */
    get componentConfiguration() {
        return {
            theme    : 'material',
            component: 'app',
            templates: ['thoregonapp'],
        }
    }

    get appliedTemplateName() {
        return 'thoregonapp';
    }

    getDefaultWidth() { return '100%'; }

    /*
     * Applications
     */

    /**
     * set the element as top app in the UI
     * @param {AuroraApp(AuroraElement)} appelement
     */
    async top(appclass) {
        // await timeout(60);
        console.log("*** ThoregonApp b4 create app element", this._x);
        let appelement = document.createElement(appclass.elementTag);
        console.log("*** ThoregonApp after create app element");
        // await this.wait4container();
        this.appendChild(appelement);
        console.log("*** ThoregonApp appended app element");

        const eventReady = new Event("thoregonappready");
        this.dispatchEvent(eventReady);
        return appelement;
    }

    async wait4container(retries = 10) {
        if (this.container || retries <= 0) return await timeout(100);
        await timeout(50);
        return this.wait4container(--retries);
    }

    appendChild(appelement) {
        if (!this.container) {
            console.log("*** ThoregonApp no container", this._x);
            this._prpareQ = () => super.appendChild(appelement);
        } else {
            return super.appendChild(appelement);
        }
    }

    elemContainerDefined() {
        console.log("*** ThoregonApp container defined", this._x);
    }

    elemPrepare() {
        if (!this._prpareQ) return;
        console.log("*** ThoregonApp run prepareQ", this._x);
        this._prpareQ();
    }

}

// register as custom element
ThoregonApp.defineElement();


