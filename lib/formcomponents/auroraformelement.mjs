/**
 *
 *
 * @author: Bernhard Lukassen
 */

import { UIObservingElement }       from '/evolux.ui';

export default class AuroraFormElement extends UIObservingElement {

    elementStyle() {
        return `
            p { font-family: "Courier New"; }
        `;
    }

    buildElement() {
        return this.builder.newDiv();
    }

}
