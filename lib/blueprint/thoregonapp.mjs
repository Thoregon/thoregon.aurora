/**
 * Top element for a thoregon UI
 * Singleton, exists on once
 * Acts as an envelop/sandbox for all other apps
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

import AuroraElement from "../auroraelement.mjs";

let instance;

export default class ThoregonApp extends AuroraElement {

    /**
     * get the singleton instance
     * @return {ThoregonApp}
     */
    static get instance() {
        if (!instance) instance = new ThoregonApp();    // Lazy init
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

}

// register as custom element
ThoregonApp.defineElement();
