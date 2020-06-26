/**
 * use this as base class for all aurora elements!
 *
 * @author: Bernhard Lukassen
 */

import { UIObservingElement }       from '/evolux.ui';

export default class AuroraElement extends UIObservingElement {

    /**
     * name of the defining element library
     * @return {string}
     */
    static get libraryId() {
        return 'aurora';
    }

}
