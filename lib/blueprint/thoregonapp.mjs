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

import AuroraApp     from "./auroraapp.mjs";
import AuroraElement from "../auroraelement.mjs";
import { doAsync }   from "/evolux.universe";

let instance;

export default class ThoregonApp extends AuroraApp(AuroraElement) {

    /**
     * get the singleton instance
     * @return {ThoregonApp}
     */
    static get instance() {
        if (!instance) instance = new ThoregonApp();    // Lazy init
        // todo [OPEN]: register in universe
        return instance;
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

    //
    // triggers: use to recognize if the user clicks somewhere on the UI. components may react e.g. by closing a menu
    //


    observeTriggers(container) {
        container.addEventListener('click', (evt) => this._triggerClicked(evt), true);
    }

    _triggerClicked(evt) {
        this.emitEvent('window-clicked', new Event('window-clicked'));
        this.emitWidgetEvent('window-clicked');
        let elem = evt.path[0].parentAuroraElement();
        elem.triggerClicked(evt);
    }

    listenWidgetEvents() {
        window.addEventListener('message', (evt) => this.widgetEvent(evt));
    }

    widgetEvent(evt) {
        // todo [OPEN]
        //  - surroundingClick
        //  - resize from outside (ifram parent)
    }


    /*
     * Applications
     */

    /**
     * set the element as top app in the UI
     * @param {AuroraApp(AuroraElement)} appelement
     */
    top(appclass) {
        let appelement = document.createElement(appclass.elementTag);
        this.appendChild(appelement);
        return appelement;
    }

}

// register as custom element
ThoregonApp.defineElement();
