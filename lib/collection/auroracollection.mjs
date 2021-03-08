/**
 * view a collection of items
 *
 * items can be fix formated by using <aurora-listitem>
 * or free formated using <aurora-collectionitem>
 *
 * items can be decorated by specifying decorators like <aurora-link>
 *
 * specify a view model class for the item.
 *
 *
 * todo [REFACTOR]:
 *  - don't access model direct, insert ViewModel
 *  - params for query from router; select with URL param
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import AuroraElement from "../auroraelement.mjs";
import { doAsync }   from "/evolux.universe";

export default class AuroraCollection extends AuroraElement {

    constructor(props) {
        super(props);
        this.itemDecorators = [];
    }


    init() {
        if (!this.state) this.state = {};
    }

    set collection(model) {
        this.model = model;
        this.refreshItems();
    }

    async refreshItems() {
        if (!this.model) return;
        let item = this.itemHandlers.firstItemToDisplay(this.state, this.model);
        if (item) await this.addItem(item);
        while (item = this.itemHandlers.nextItemToDisplay(item, this.state, this.model)) this.addItem(item);
    }

    async mutated(mutation) {
        if (mutation.type === 'new')    await this.addItem(mutation.item, mutation.id);
        if (mutation.type === 'update') await this.updateItem(mutation.item, mutation.id, mutation.old);
    }

    async updateItem(item, id, old) {
        let elem = this.item4Update(id);
        elem.viewModel.model = item;
    }

    async addItem(item, id) {
        if (!this.anchor) {
            this.anchor = this.container.querySelector('div.items');
        }
        let viewitem;
        if (this.viewHandlers) {
            viewitem = this.viewHandlers.listView(item, this.state);
            if (id) this.mapping[id] = viewitem;
            viewitem = await this.decorateItem(viewitem, [...this.itemDecorators]);
        } else {
            viewitem = await this.decorateItem(item, [...this.itemDecorators]);
            if (id) this.mapping[id] = viewitem;
        }
        this.anchor.appendChild(viewitem);
        await viewitem.untilExist();
    }

    async decorateItem(item, decorators) {
        let decorator = decorators.pop();
        if (decorator) {
            decorator = decorator.clone();
            this.container.appendChild(decorator);
            await decorator.untilExist();
            await decorator.decorate(item);
            // todo [OPEN]: decorator view model
            return this.decorateItem(decorator, decorators);
        }
        return item;
    }

    get mapping() {
        if (!this._mapping) this._mapping = {};
        return this._mapping;
    }

    item4Update(id) {
        if (!id) return; // todo: log
        return  this.mapping[id];
    }

    async itemAdded(item, id) {
        await this.addItem(item, id);
    }

    get items() {
        return this.anchor.childViews;
    }

    async connect() {
        if (!this.queryName) return;
        let app = universe.uirouter.app;
        let Query = app.getQuery(this.queryName);
        if (!Query) {
            console.log(`AuroraCollection: Query '${this.queryName}' not found.`);
            return;
        }
        let query = Query.in(app);
        this.query = query;
        // todo: entity ref from url router, parent if exists

        if (this.viewModel) {
            this.viewModel.query = query;
        } else {
            query.addMutationListener(async (mutation) => await this.mutated(mutation));
            query.connect();
        }
    }

    get queryName() {
        return this.getAttribute("query");
    }

    set queryName(query) {
        this.setAttribute("query", query);
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

    async adjustContent(container) {
        if (!this.state) this.init();
        await this.refreshItems();
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
            query: {
                default:        '',
                type:           'string',
                description:    'name of a registered query',
                group:          'Content',
                example:        'orders'
            },
        });
    }

    /*
     * embedded elements
     */

    doApplyChildNode(child, container) {
        if (child.isItemDecorator) {
            this.domRemoveChild(child);
            this.itemDecorators.push(child);
            child.inCollection = true;
        } else if (child.isCollectionItem) {
            this.domRemoveChild(child);
            this.collectionitem = child;
        } else {
            super.doApplyChildNode(child, container);
        }
    }

}

AuroraCollection.defineElement();
