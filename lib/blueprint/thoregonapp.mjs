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

    /**
     * template definition
     * @return {{component: string, templates: [string], theme: string}}
     */
    get templateElements() {
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
    set top(appclass) {
        let appelement = document.createElement(appclass.elementTag);
        this.appendChild(appelement);
        /*
        todo [OPEN]: restore UI state
        ui.prepareEnveloping(this.appElement);
        ui.awaken();
        */
        // todo [OPEN]: connect Model and UI (ViewModel)
    }

}

// register as custom element
ThoregonApp.defineElement();
