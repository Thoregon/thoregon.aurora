/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import AuroraElement   from "../auroraelement.mjs";
import AuroraAttribute from "./auroraattribute.mjs";

const SHORTCODE = '@';

export default class AuroraAttributeAction extends AuroraAttribute {

    constructor(...args) {
        super(...args);
        this.elementListener = (evt) => this.elementTriggered(evt);
    }


    static get name() {
        return "action";
    }

    static get supportsSelector() {
        return true;
    }

    static get supportsMultiple() {
        return true;
    }

    static attrCompare() {
        const names = [this.auroraName, this.auroraShortName];
        return (attrname) => (attrname.startsWith(SHORTCODE) || names.findIndex(name => attrname.startsWith(name)) > -1);
    }

    parseAttributeSelector() {
        let name = this.attribute?.name;
        if (!name || !name.startsWith(SHORTCODE)) return super.parseAttributeSelector();
        let selector = name.substr(1), subselector;
        let parts = selector.split('.');
        if (parts.length > 1) {
            selector = parts[0];
            subselector = parts[1];
        }
        return { name: this.auroraName, selector, subselector };
    }

    connectElementListeners(element) {
        element = element ?? this.element;
        if (!element) return;  // can't connect
        const eventname = this.selector ?? 'click';
        element.addEventListener(eventname, this.elementListener);
    }

    elementTriggered(evt) {

    }

    //
    // view model
    //

    connectViewModelListeners(viewModel) {
        // empty because an action is directed (UI -> Function)
    }


}

AuroraElement.useAuroraAttribute(AuroraAttributeAction);
