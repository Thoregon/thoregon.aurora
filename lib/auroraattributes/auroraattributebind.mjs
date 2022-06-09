/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import AuroraElement   from "../auroraelement.mjs";
import AuroraAttribute from "./auroraattribute.mjs";

const SHORTCODE = ':';

export default class AuroraAttributeBind extends AuroraAttribute {

    static get name() {
        return "bind";
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

    connectElement() {
        // nothiing to do, bind only reacts on mutations on the west (model/viewmodel) side
    }

    //
    // view model
    //

    connectViewModelListeners(viewModel) {
        // Listen to all modifications
        // viewModel.addAll
    }

}

AuroraElement.useAuroraAttribute(AuroraAttributeBind);
