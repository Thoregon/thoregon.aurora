/**
 *
 * todo [REFACTOR]: don't access model direct, insert ViewModel
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import AuroraElement from "../auroraelement.mjs";
import { doAsync }   from "/evolux.universe";

export default class AuroraCollection extends AuroraElement {

    init() {
        if (!this.state) this.state = {};
        // if (!this.model) this.model = ['a', 'b', 'c'];
/*
        if (!this.itemHandlers) {
            this.itemHandlers = {
                firstItemToDisplay: (state, model) => {
                    if (!state.currentIndex) state.currentIndex = 0;
                    return model[state.currentIndex];
                },
                nextItemToDisplay: (currentItem, state, model) => {
                    if (!state.currentIndex) state.currentIndex = 0;
                    let item = model[state.currentIndex+1];
                    if (item) state.currentIndex++; // only increment if there is an item
                    return item;
                },
                previousItemToDisplay: (currentItem, state, model) => {
                    if (!state.currentIndex) state.currentIndex = 0;
                    let item = model[state.currentIndex-1];
                    if (item) state.currentIndex--; // only increment if there is an item
                    return item;
                },
            };
        }
        if (!this.viewHandlers) {
            this.viewHandlers = {
                listView: (currentItem, state) => {
                    let elem = document.createElement('div');
                    elem.innerText = currentItem.toString();
                    return elem;
                },
                referenceView:(currentItem, state) => {

                },
            };
        }

        if (!this.actionHandlers) this.actionHandlers = {};
*/
    }

    set collection(model) {
        this.model = model;
        this.refreshItems();
    }

    refreshItems() {
        if (!this.model) return;
        let item = this.itemHandlers.firstItemToDisplay(this.state, this.model);
        if (item) this.addItem(item);
        while (item = this.itemHandlers.nextItemToDisplay(item, this.state, this.model)) this.addItem(item);
    }

    addItem(item) {
        if (!this.anchor) {
            this.anchor = this.container.querySelector('div.items');
        }
        let viewitem = this.viewHandlers.listView(item, this.state);
        this.anchor.appendChild(viewitem);
    }

    itemAdded(item) {
        this.addItem(item);
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
     *      - before/after item added
     *      - before/after item reomved
     *      - is item visible in current UI
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

    adjustContent(container) {
        if (!this.state) this.init();
        this.refreshItems();
    }

    get appliedTemplateName() {
        return 'collection';
    }

    getDefaultWidth() { return false; }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            title: {
                default:        '',
                type:           'string',
                description:    'A title that will describe the content',
                group:          'Content',
                example:        'orders'
            },
        });
    }

}

AuroraCollection.defineElement();
