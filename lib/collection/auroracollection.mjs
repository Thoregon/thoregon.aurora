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
import { doAsync, timeout } from "/evolux.universe";
import { forEach }          from "/evolux.util";

import AuroraElement        from "../auroraelement.mjs";
import View                 from "../blueprint/layout/view.mjs";

export default class AuroraCollection extends AuroraElement {

    constructor(props) {
        super(props);
        this.itemDecorators = [];
        this._itemIds       = new Set();
    }

    init() {
        if (!this.state) this.state = {};
    }

    set collection(model) {
        this.model = model;
        this.refreshItems();
    }

    async refreshItems() {
        // todo: old API -> get rid of it
        if (!this.model) return;
        let item = this.itemHandlers.firstItemToDisplay(this.state, this.model);
        if (item) await this.addItem(item);
        while (item = this.itemHandlers.nextItemToDisplay(item, this.state, this.model)) this.addItem(item);
    }

    // todo [OPEN]: remove item
    async mutated(mutation) {
        if (mutation.type === 'new')    await this.addItem(mutation.item, mutation.id);
        if (mutation.type === 'update') await this.updateItem(mutation.item, mutation.id, mutation.old);
    }

    async updateItem(item, id, old) {
        let elem = this.item4Update(id);
        elem.viewModel.model = item;
    }

    async addItem(item, id) {
        if (this._itemIds.has(id)) return;
        this._itemIds.add(id);
        let sort = this.sortProperty(item);
        let desc = (this.getAttribute("descending") === '' || false);
        if (!this.anchor) {
            this.anchor = this.container.querySelector('div.items');
        }
        let viewitem;
        if (this.itemView) {
            viewitem = await ItemView.with(this, this.getAppViewRoot(), this.itemView, item, id).createItemView();
            viewitem = await this.decorateItem(viewitem, [...this.itemDecorators]);
            if (id) this.mapping[id] = viewitem;
        } else if (this.viewHandlers) {
            // todo [REFACTOR]: this is the old API -> get rid of
            viewitem = this.viewHandlers.listView(item, this.state);
            if (id) this.mapping[id] = viewitem;
            viewitem = await this.decorateItem(viewitem, [...this.itemDecorators]);
        } else {
            viewitem = await this.decorateItem(item, [...this.itemDecorators]);
            if (id) this.mapping[id] = viewitem;
        }
        if (!viewitem) return;      // todo: log, may be an accident
        let children = [...this.anchor.children];
        if (children.length === 0) {
            if (sort) viewitem.setAttribute('sort', sort);
            this.anchor.appendChild(viewitem);
        } else {
            if (sort) {
                viewitem.setAttribute('sort', sort);
                if (desc) {
                    let sibling = children.find(node => node.getAttribute('sort') < sort && desc);
                    if (sibling) {
                        this.anchor.insertBefore(viewitem, sibling);
                    } else {
                        this.anchor.insertBefore(viewitem, this.anchor.firstChild);
                    }
                } else {
                    let sibling = children.find(node => node.getAttribute('sort') >= sort && !desc);
                    if (sibling) {
                        this.anchor.insertBefore(viewitem, sibling);
                    } else {
                        this.anchor.appendChild(viewitem);
                    }
                }
            } else {
                if (desc) {
                    this.anchor.insertBefore(viewitem, this.anchor.firstChild);
                } else {
                    this.anchor.appendChild(viewitem);
                }
            }
        }
        await viewitem.untilExist();
        this.parentAuroraElement().collectionItemsLengthChanged();
    }

    sortProperty(item) {
        let prop = this.getAttribute('order-by');
        let val = prop ? item[prop] : undefined;
        return val == undefined ? undefined : val instanceof Date ? val.getTime().toString() : typeof val === 'number' ? (""+val).padStart(10, '0') : val.toString();
    }

    async decorateItem(item, decorators) {
        let decorator = decorators.pop();
        if (decorator) {
            decorator = decorator.clone();
            if (this.level) {
                decorator.level = this.level;
                item.level = this.level;
            }
            this.container.appendChild(decorator);
            await decorator.untilExist();
            await decorator.refresh();
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
        // todo: old API -> get rid of it
        console.log("$$ AuroraCollection: old 'itemAdded' used!")
        await this.addItem(item, id);
    }

    get items() {
        return this.anchor.childViews;
    }

    get length() {
        return this.query?.length || 0;
    }

    async connect() {
        if (!this.queryName) return;
        // await timeout(200);
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
            let parentElem = this.itemParentElement();
            if (!parentElem) {
                this.initQuery(query);
            } else {
                parentElem.vmQ(() => {
                    let parentVM = parentElem ? parentElem.viewModel : undefined;
                    this.incrementLevel(parentElem);
                    if (parentVM && parentVM.west.model) {
                        query.parent = parentVM.west.model[universe.T];
                        this.initQuery(query);
                    }
                })
            }
        }
    }

    async renderForMount() {
        let element = await this.renderTemplateWithProperties( 'skeletoncollection' , {});
        this.container.innerHTML   = element;
    }

    incrementLevel(parentElem) {
        if (!parentElem.level) return;
        let level = parseInt(parentElem.level);
        this.level = level+1;
    }

    initQuery(query) {
        query.addCurrentItemsHandler((items) => this.initialItems(items));
        query.connect();
    }

    /**
     *
     * @param items
     */
    async initialItems(items) {
        await forEach(Object.entries(items), async ([key, item]) => {
            let mutation = { type: 'new', item: item.item, id: key };
            await this.mutated(mutation);
        });
        this.query.addMutationListener(async (mutation) => await this.mutated(mutation));

        this.parentAuroraElement().collectionItemsLengthChanged();
    }

    get queryName() {
        return this.getAttribute("query");
    }

    set queryName(query) {
        this.setAttribute("query", query);
    }

    get itemView() {
        return this.getAttribute("item-view");
    }

    itemParentElement() {
        if (!this.hasAttribute("with-parent")) return;
        let parent = this.getAttribute("with-parent");
        return this.parentAuroraElement(parent);
    }

    getAppViewRoot() {
        return this.getAuroraAppElement().getAppViewRoot();
    }

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-collection';
    }

    static get observedAttributes() {
        return [...super.observedAttributes, "expanded", "order-by", "view", "descending"];
    }

    get componentConfiguration() {
        return {
            theme: 'material',
            component: 'collections',
            templates: [
                'collection',
                'skeletoncollection'
            ],
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // todo
    }

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
        // todo [OPEN]: introduce selector/filter to select right view for the item
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
            expanded: {
                default:        '',
                type:           'boolean',
                description:    'items visible',
                group:          'Content',
                example:        'false'
            },
            "order-by": {
                default:        '',
                type:           'string',
                description:    'name of a property',
                group:          'Content',
                example:        'timestamp'
            },
            "item-view": {
                default:        '',
                type:           'string',
                description:    'name of a view used for each item',
                group:          'Content',
                example:        'timestamp'
            },
            descending: {
                default:        '',
                type:           'boolean',
                description:    'direction of order',
                group:          'Content',
                example:        'true'
            },
            "with-parent": {
                default:        '',
                type:           'string',
                description:    'name of a parent element',
                group:          'Content',
                example:        'timestamp'
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

class ItemView extends View(Object) {

    constructor(collectionElement, approot, view, item, id, parentmodel) {
        super();
        this.collectionElement = collectionElement;
        this.approot           = approot;
        this.view              = view;
        this.model             = item;
        this.id                = id;
        this.parent            = parentmodel;
    }

    static with(approot, view, item, id) {
        let itemview = new this(approot, view, item, id);
        return itemview;
    }

    getParentModel() {
        return this.parent;
    }

    getVMProperties() {
        let properties = super.getVMProperties();
        properties.level = this.collectionElement.level || 1;
        return properties;
    }

    async createItemView() {
        let container = document.createElement('div');
        let element = await this.buildViewElements();
        container.innerHTML = element;
        [...container.children].filter(elem => elem.isAuroraElement).forEach((elem) => {
            elem.behaviorQ(() => {
                let vm = this.viewmodel;
                elem.attachViewModel(vm);
                vm.view = elem;
            });
        });
        return container;
    }

}

AuroraCollection.defineElement();

/*
 * old collections API
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
