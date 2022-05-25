/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import { ErrNotImplemented } from "../errors.mjs";
import AuroraElement         from "../auroraelement.mjs";

export default class AuroraAttribute {

    constructor(elem, attr) {
        this.element   = elem;
        this.attribute = attr;
        this.spec      = this.parseAttributeSelector();
    }

    static with(elem, attr) {
        const attribute = new this(elem, attr);
        return attribute;
    }

    get is(){
        return this.hasAttr(this.elem);
    }

    static get auroraName() {
        return `aurora-${this.name}`;
    }

    get auroraName() {
        return this.constructor.auroraName;
    }

    static get auroraShortName() {
        return `a-${this.name}`;
    }

    get auroraShortName() {
        return this.constructor.auroraShortName;
    }

    static attrCompare() {
        const names = [this.auroraName, this.auroraShortName];
        return !this.supportsSelector
               ? (attrname) => names.includes(attrname)
               : (attrname) => names.includes(attrname)
                               || (names.findIndex(name => attrname.startsWith(`${name}:`)) > -1)   // selector
                               || (names.findIndex(name => attrname.startsWith(`${name}.`)) > -1);  // subselector
    }

    static getAttr(element) {
        const elemattrnames = element.getAttributeNames();
        const name          = elemattrnames.find(this.attrCompare());
        if (name === undefined) return;
        const value         = element.getAttribute(name);
        return { name, value };
    }

    static getAttrs(element) {
        // when it does not support multiple attributes even when it supports selectors, get only the first
        if (!this.supportsMultiple) {
            const attr = this.getAttr(element);
            return attr !== undefined ? [attr] : [];
        }
        const elemattrnames = element.getAttributeNames();
        const attrnames     = elemattrnames.filter(this.attrCompare());
        const attrs         = attrnames.map((attrname) => ({ name: attrname, value : element.getAttribute(attrname) }));
        return attrs;
    }

    parseAttributeSelector() {
        let name = this.attribute?.name;
        if (!name) return;
        let selector, subselector;
        let parts = name.split('.');     // first try to get a subselector
        if (parts.length > 1) {
            name        = parts[0];
            subselector = parts[1];
        }
        parts = name.split(':');         // now try to get the selector
        if (parts.length > 1) {
            name        = parts[0];
            selector    = parts[1];
        }
        return { name, selector, subselector };
    }

    //
    // subclasses
    //

    /**
     * name of the attribute
     */
    static get name() {
        throw ErrNotImplemented('name');
    }

    get name() {
        return this.constructor.name;
    }

    /**
     * specify if this aurora attribute can be specialized with a selector
     * e.g. aurora-name:meta
     * @return {boolean}
     */
    static get supportsSelector() {
        return false;
    }

    static get supportsMultiple() {
        return false;
    }

    static get selectors() {
        return [];
    }

    static get subselectors() {
        return [];
    }

}

// AuroraElement.useAuroraAttribute(AuroraAttribute)

//
// HTML Element polyfills
//

Object.defineProperties(Element.prototype,{
    getAuroraAttributes: {
        configurable: false,
        enumerable: false,
        value: function getAuroraAttributes() {
            const auroraattributes = [];
            Object.values(AuroraElement.definedAuroraAttributes).forEach((AuroraAttribute) => {
                const found = AuroraAttribute.getAttrs(this);
                if (!found.is_empty) {
                    found.forEach(({ name, value }) => {
                        auroraattributes.push(AuroraAttribute.with(this, { name, value }));
                    });
                }
            });
            return auroraattributes;
        }
    }

});
