/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import AuroraElement from "../auroraelement.mjs";
import { doAsync }   from "/evolux.universe";

export default class AuroraCollection extends AuroraElement {

    constructor() {
        super();
        this.collectionHandlers = {};
    }

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-collection';
    }

    get templateElements() {
        return {
            theme: 'material',
            component: 'collections',
            templates: ['collection'],
        }
    }

    /*
     * collections API
     *
     *  a plugable architectiure with handlers
     *
     * Handlers to get access to collection items
     * - get first element to display
     * - get previous element (to be displayed)
     * - get next element (to be displayed)
     * - modification handler
     *
     *  if filters are applied or changed, elements will be rerendered
     *
     * Handlers to get views for elements:
     * - get default view
     * - get list view
     * - get reference view
     * - get detail view
     *
     * Selectionhandler
     * Menu/Actionhandler
     * - group changes
     * - not selectable elements
     * - multiselect disable actions
     */

    withCollectionHandles(handlers) {
        this.collectionHandlers = handlers;
    }

    withViewHandles(handlers) {
        this.viewHandlers = handlers;
    }

}

AuroraCollection.defineElement();
