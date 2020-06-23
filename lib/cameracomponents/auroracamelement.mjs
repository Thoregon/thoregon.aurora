/**
 *
 *
 * @author: Bernhard Lukassen
 */

import { UIObservingElement }       from '/evolux.ui';

export default class AuroraCamElement extends UIObservingElement {

    constructor() {
        super();
    }

    elementStyle() {
        return `
            :host { border:     1px dotted red; }
        `;
    }

    buildElement() {
        return this.builder.newDiv();
    }

}
