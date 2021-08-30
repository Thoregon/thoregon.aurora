/**
 *
 *  Base class for all parts building a blueprint
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import AuroraElement from "../../auroraelement.mjs";

export default class AuroraBlueprintElement extends AuroraElement {

    constructor() {
        super();
        this.app = this.getAuroraAppElement();
    }

    viewContentElement(element) {
        let target = this.target;
        target.innerHTML = '';
        target.appendChild(element);
        return target;
    }

    get containerContent() {
        let target = this.container; // this.target;
        return target ? target.innerHTML : '';
    }

    set containerContent(content) {
        let target = this.container; // this.target;
        if (target) target.innerHTML = content;
    }

    get target() {
        // if (this._target) return this._target;
        this._target = this.container.querySelector('*[aurora-slot="main"]') || this.container;
        return this._target;
    }

    getAuroraBlueprint() {
        this.blueprint = super.getAuroraBlueprint();
        return this.blueprint;
    }

    propertiesDefinitions() {
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            view: {
                default:        '',
                type:           'string',
                description:    'View to be displays inside this part',
                group:          'Structure',
                example:        ''
            },
        });
    }

}
