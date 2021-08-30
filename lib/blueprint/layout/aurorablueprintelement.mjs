/**
 *
 *  Base class for all parts building a blueprint
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import AuroraElement from "../../auroraelement.mjs";

export default class Aurorablueprintelement extends AuroraElement {

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
