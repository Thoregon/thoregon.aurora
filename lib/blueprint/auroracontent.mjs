/**
 * a placeholder for a whole app
 *
 * @author: Bernhard Lukassen
 */

import AuroraElement        from "../auroraelement.mjs";

export default class AuroraContent extends AuroraElement {
    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-content';
    }

    /**
     * connect to the viewmodel. add all listeners
     * @param viewmodel
     */
    connectViewModel(viewmodel) {
    }


    applyContent(container) {
        // get the content (view components) and display it
    }
}

// register as custom element
AuroraContent.defineElement();
