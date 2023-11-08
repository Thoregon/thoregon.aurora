/**
 *
 * todo [OPEN]
 *  - implement <filter-definition> in Aurora List
 *  - implement <grid-definition> in Grid Handler
 *
 * @author: Martin Neitz, Bernhard Lukassen
 */

import { asyncWithPath }   from "/evolux.util/lib/pathutils.mjs";
import { parseRouteIds }   from "/evolux.util/lib/formatutils.mjs";
import { Q }               from "/evolux.util";
import { extractKeyValue } from "/evolux.util/lib/formatutils.mjs";
import ListItemViewModel   from "../viewmodel/listitemviewmodel.mjs";
import AuroraFormElement   from "../formcomponents/auroraformelement.mjs";
import VisibilityObserver  from "/thoregon.aurora/lib/visibilityobserver.mjs";
import Query               from "/thoregon.truCloud/lib/query.mjs";

// TODO: support visibility  (scroll in) ->


// TODO: remove -> import dragula            from '../../ext/dragula/dragula.mjs';

import { AuroraActionBuilderIconContainer, AuroraActionBuilderMenu } from "../component-actions/auroaactionsbuilder.mjs";
import AuroraAttribute                                               from "../auroraattributes/auroraattribute.mjs";

const _vmmodule = {};

const observeOptions     = {
    childList            : true,
    subtree              : true,
    attributes           : true,
    attributeOldValue    : true,
    characterData        : false,
    characterDataOldValue: false
};

export default class AuroraList extends AuroraFormElement {

    constructor() {
        super();

        this._columns          = undefined;
        this._tableDefinitions = undefined;
        this._query            = undefined;
        this._handler          = undefined;
        this._gridTransitions  = undefined;
    }

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-list';
    }

    static get observedAttributes() {
        return [...super.observedAttributes, 'mode', 'filtervalue' ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if ( ! this.container ) return;

        switch (name) {
            case 'mode' :
                this.propertiesValues()['mode'] = newValue;
                this.determineAndSetHandler( true );
                this.activateWhenReady();
                break;
            case'filtervalue' :
                this.propertiesValues()['filtervalue'] = newValue;
                this.handler.reset();
                break;
        }
        return super.attributeChangedCallback(name, oldValue, newValue);
    }

    get viewmodel()     { return this._vm; }
    set viewmodel( vm ) { this._vm = vm; }

    applyChildNode(childnode) { return false; }

    /*
     * aurora element features
     */

    // theme ... component... templates

    get componentConfiguration() {

        return {
            theme    : 'material',
            component: 'component-list',
            templates: ['list'],
        }
    }

    doAfterInit(fn) {
        if (this.container) return fn();
        if (!this._initQ) return fn();
        this._initQ.push(fn);
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            'mode'          : {
                default    : 'table',
                type       : 'string',
                description: 'Type of representation',
                group      : 'Behavior',
                example    : 'table | grid'
            },
            'sort'          : {
                default    : '',
                type       : 'string',
                description: 'name of the attribute the list will be sorted',
                group      : 'Behavior',
                example    : 'first_name'
            },
            'filter': {
                default    : '',
                type       : 'string',
                description: 'name of the attribute the list will be filtered',
                group      : 'Behavior',
                example    : 'first_name'
            },
            'filtervalue': {
                default    : '',
                type       : 'string',
                description: 'value for the filter',
                group      : 'Behavior',
                example    : 'Martin'
            },
            'dragdrop'          : {
                default    : true,
                type       : 'Behavior',
                description: 'Support Drag & Drop of the elements',
                group      : 'Behavior',
                example    : 'true'
            },
            'dense'         : {
                default    : false,
                type       : 'boolean',
                description: 'dense representation',
                group      : 'Content',
                example    : 'true'
            },
            'itemview'          : {
                default    : undefined,
                type       : 'string',
                description: 'View for the items',
                group      : 'Content',
                example    : ''
            },
            ':columns'      : {
                default    : 'columns',
                type       : 'string',
                description: 'define the function of the ViewModel which is responsible to return the used columns',
                group      : 'Content',
                example    : 'myColumns'
            },
            ':query'        : {
                default    : 'query',
                type       : 'string',
                description: 'defines the query function responsible for the data rows',
                group      : 'Content',
                example    : 'myQuery'
            },
            'rendercolumn'    : {
                default    : '',
                type       : 'string',
                description: 'defines the render function responsible to return the content of an column',
                group      : 'Content',
                example    : 'myRenderColumnFunction'
            },
            ':renderelement': {
                default    : '',
                type       : 'string',
                description: 'defines the render function responsible for one element in grid mode',
                group      : 'Content',
                example    : 'myRenderElementFunction'
            },
            ':itemviewmodel': {
                default    : '',
                type       : 'string',
                description: 'defines the function responsible to deliver the viewmodel for the item',
                group      : 'Content',
                example    : 'myItemViewModel'
            },
            'itemviewmodel': {
                default    : '',
                type       : 'string',
                description: 'defines the name the viewmodel for the item',
                group      : 'Content',
                example    : 'ItemViewModel'
            },
            'elementwidth': {
                default    : '100%',
                type       : 'string',
                description: 'defines the width of element in grid mode',
                group      : 'Content',
                example    : '50%'
            },
            // view
            // :view
        });
    }

    propertiesAsBooleanRequested() {
        return {};
    }

    getDefaultWidth() {
        return false;
    }

    get $isListContext() {
        return true;
    }

    //--- attribute: columns  ---
    get columns()        { return this._columns; }
    set columns(columns) {
        this._columns = columns;

        this.determineAndSetHandler();
        this.handler.columns = this.columns;
        this.activateWhenReady();
    }

    //--- attribute: query  ---
    get query() { return this._query; }
    set query( query ) {
        if (this._query === query) return;

        this.doAfterInit((async () => {
            this._query = await Query.from(query);    // if it is a Query it won't get wrapped again!

            this.determineAndSetHandler();
            this.handler.query = this.query;
            this.activateWhenReady();
        }));
    }

    //--- Attribute handler  ---
    get handler()          { return this._handler; }
    set handler( handler ) { this._handler = handler; }

    //--- gridTransitions   ---
    get gridTransitions() { return this._gridTransitions; }
    set gridTransitions( transitions ) { this._gridTransitions = transitions; }

    //--- tableDefinitions   ---
    get tableDefinitions() { return this._tableDefinitions; }
    set tableDefinitions( tableDefinitions ) { this._tableDefinitions = tableDefinitions; }

    propertiesValues() {
        return super.propertiesValues();
    }

    determineAndSetHandler( reset = false ) {

        if ( this.handler && ! reset ) return this.handler;

        let propertiesValues = this.propertiesValues();

        switch ( propertiesValues['mode'] ) {
            case 'table':
                this.handler = new AuroraListHandlerTable(this);
                break;
            case 'grid':
                this.handler = new AuroraListHandlerGrid(this);
                break;
        }
    }
    activateWhenReady() {
        if ( !this._activated && this.handler.isReady() ) {
            this._activated = true;
            this.handler.activate();
        }
    }

    getSurroundingView() {
        let parentAuroraView = this.parentAuroraElement();
        while (parentAuroraView && !parentAuroraView.vpath) parentAuroraView = parentAuroraView.parentAuroraElement();
        return parentAuroraView;
    }

    viewpath() {
        return this.getSurroundingView()?.vpath;
    }

    // todo [RFACTOR]: move to blueprint view
    async getItemViewModelClass(propertiesValues) {
        // todo: check if method to get item vm exists
        const functionItemViewModel = propertiesValues[':itemviewmodel'];
        if (functionItemViewModel) {
          return this.viewmodel?.[functionItemViewModel]?.();
        }
        const refItemVMClass = propertiesValues['itemviewmodel']
        const viewpath = this.viewpath();
        if (!viewpath) return;
        if (_vmmodule[refItemVMClass]) return _vmmodule[refItemVMClass].default;
        return await Q(refItemVMClass, async () => {
            let resourcepath = `${viewpath}/${refItemVMClass}.mjs`;
            let viewmodelmodule;
            try {
                viewmodelmodule = await this.import(resourcepath);
            } catch (e) {
                // console.log(`Can't load behavior '${resourcepath}': ${e.stack ? e.stack : e.message }`);
                // behavior not found, always return empty, don't try to load again
                viewmodelmodule = { default: undefined };
            }
            _vmmodule[refItemVMClass] = viewmodelmodule;
            return _vmmodule[refItemVMClass].default;
        });

    }
    /**
     *  routine to add all needed classes.
     *  This only can be done on the element level as it will be differ from element to element
     */
    collectClasses() {
        let classes          = [];
        let propertiesValues = this.propertiesValues();

        if (propertiesValues['dense']) {
            classes.push('dense');
        }

        if (propertiesValues['fullwidth']) {
            classes.push('fullwidth');
        }

        return classes;
    }

    async adjustContent(container) {
        container.classList.add("aurora-list-wrapper");
    }

    get appliedTemplateName() {
        return 'list';
    }

    use(obj, attr) {
        this.input.setAttribute('value', obj[attr]);
    }


    async existsConnect() {
        await super.existsConnect();

        let route = this.propertiesValues()['route'];
        // todo [REFACTOR]: change to a registry with callbacks in UI router
        if (route) universe.uirouter.source4route(route, this);

        // this.applyFilterDefintion();
        // this.applyColumnDefinition();
        // this.applyGridDefinition();

        this.behavior.attach(this);

/*
        const Q = this._initQ;
        this._initQ = [];
        Q.forEach(fn => fn());
*/
    }

    dispose() {
        let route = this.propertiesValues()['route'];
        if (route) universe.uirouter.removeSource(route, this);
        this.handler?.dispose();
    }

    applyFilterDefintion() {
        // todo
    }

    applyTableDefinition() {
        const tableDefinition = this.querySelector('table-definition');
        const tableAttributes = {
            presentation : tableDefinition?.getAttribute('presentation') ?? 'list',
        }
        this.tableDefinitions = tableAttributes;
    }

    applyGridDefinition() {
        const gridDefinitions = this.querySelector('grid-definition');
        if ( !gridDefinitions ) return;

        const definitions =
                  {
                      columns: gridDefinitions.getAttribute('columns') ?? '2',
                      from   : gridDefinitions.getAttribute('from') ?? 0,
                      to     : gridDefinitions.getAttribute('to') ?? 99999,
                      view   : gridDefinitions.querySelector('view')?.innerHTML,
                      style  : gridDefinitions.querySelector('style')?.innerHTML,
                  };
        this.gridDefinition = definitions;
        return;

/*
        const gridTransitions = this.querySelector('grid-definition');
        if ( !gridTransitions ) return;
        const gridTransitionsElements = [...gridTransitions.querySelectorAll('grid-definition')];
        const gridTransitionsDefinitions = gridTransitionsElements.map(gridTransitionsElement => (
            {
                columns: gridTransitionsElement.getAttribute('columns') ?? '2',
                from   : gridTransitionsElement.getAttribute('from')    ?? 0,
                to     : gridTransitionsElement.getAttribute('to')      ?? 99999,
                view   : gridTransitionsElement.querySelector('view')   ?.innerHTML,
            }
        ));
        if (gridTransitionsDefinitions.length === 0) return;
        // todo [REFACTOR]: don't create those inner senseless aurora-attributes
        this.innerHTML = '';    // remove all aurora-attributes pointing to the wrong view and model.
        this.gridTransitions = gridTransitionsDefinitions;
*/
    }

    hasTableDefinition() {
        const tableDefinition = this.querySelector('table-definition');
        if (!tableDefinition) return false;
        const columnElements = [...tableDefinition.querySelectorAll('column')];
        return !columnElements.is_empty;
    }

    applyColumnDefinition() {
        const tableDefinition = this.querySelector('table-definition');
        if (!tableDefinition) return;
        const columnElements = [...tableDefinition.querySelectorAll('column')];
        const columnDefinitions = columnElements.map(columnElement => (
            {

                type       : columnElement.getAttribute('type') ?? 'value',
                attribute  : columnElement.getAttribute('attribute') ?? '',
                name       : columnElement.getAttribute('name') ?? '',
                label      : columnElement.getAttribute('label') ?? '',
                header     : columnElement.querySelector('header')?.innerHTML,   // todo [OPEN]: aurora attributes inside <header> must be connected to the parent view model which is not available (context is surrounding view and viewmodel) -> see getItemViewModelClass()
                view       : columnElement.querySelector('view')?.innerHTML,       // [...columnElement.children].filter(node => node.tagName !== 'HEADER').map(node => node.outerHTML).join('\n'),
                sortable   : columnElement.hasAttribute('sortable'),
                filterable : columnElement.hasAttribute('filterable'),
                visibility : extractKeyValue(columnElement.getAttribute('visibility')) ?? '',      // todo [REFACTOR
                width      : columnElement.getAttribute('width') ?? '',
                classes    : columnElement.getAttribute('classes') ?? '',
                align      : columnElement.getAttribute('align') ?? DEFAULT_COLUMN_DEFINITION_FOR_TABLE.align,
                actionstyle: columnElement.getAttribute('actionstyle') ?? DEFAULT_COLUMN_DEFINITION_FOR_TABLE.actionstyle,
                actionset  : columnElement.getAttribute('actionset') ?? DEFAULT_COLUMN_DEFINITION_FOR_TABLE.actionset,
                draghandle : columnElement.getAttribute('draghandle') ?? DEFAULT_COLUMN_DEFINITION_FOR_TABLE.draghandle,
                route      : columnElement.getAttribute('route') ?? '',
            }
        ));
        if (columnDefinitions.length === 0) return;
        // todo [REFACTOR]: don't create those inner senseless aurora-attributes
        this.innerHTML = '';    // remove all aurora-attributes pointing to the wrong view and model.
        this.columns = columnDefinitions;
    }

    // TODO: inlcude the observer....
    setResponsiveTableBreakpoints(columns) {
        let currentTableWidth = this.offsetWidth;
        let style_element     = this.container.querySelectorAll('#responsivebreakpoints')[0];
        let style             = '';
        style += '<style>';

        for (let c = 0; c < columns.length; c++) {
            let column = columns[c];

            if (column.responsivebreakpoint != '' &&
                parseInt(column.responsivebreakpoint) >= currentTableWidth) {
                style += '.responsive_' + column.responsivebreakpoint + ' { display: none; }';
            }

        }

        style += '</style>';
        style_element.innerHTML = style;
    }

    // todo [REFACTOR]: change to a registry with callbacks in UI router
    targetShowsView(route) {
        // todo [REFACTOR]: move to AuroraListHandler (below)
        const others = [...this.container.querySelectorAll('*[item-id]')];
        const elem = this.container.querySelector('*[item-id="' + route.r + '"]');
        others.forEach(item => item.classList.remove('active'));
        elem?.classList.add('active');
    }

    triggerRoute() {
        return true;
    }

    //
    // item actions
    //

    get hasItemActions() {
        return true;
    }

    triggerItemActions(action, items) {
        const event = new CustomEvent('item-actions', { detail: { action, items } });
        this.dispatchEvent(event);
    }
}


const DEFAULT_COLUMN_DEFINITION_FOR_TABLE = {
    type       : 'value',
    attribute  : '',
    name       : '',
    label      : '',
    align      : 'left',
    sortable   : false,
    filterable : false,
    draghandle : false,
    route      : '',
    visibility : '',
    set        : 'default',
    actionstyle: 'menu',
    actionset  : 'default',
    classes    : '',
    width      : '',
    view       : undefined
}


export class AuroraListHandler {

    constructor( element ) {

        this.actionBuilderMenu          = new AuroraActionBuilderMenu();
        this.actionBuilderIconContainer = new AuroraActionBuilderIconContainer();

        this._element   = element;
        this._query     = undefined;

        this.properties = this.element.propertiesValues();

        this.container  = element.container;

        this.route      = this.properties['route'];
        this.itemview   = this.properties['itemview'];

        let functionNameItemViewModel = this.properties['itemviewmodel'];

        this.functionItemViewModel    = this.element.viewmodel?.[functionNameItemViewModel];

        this.visibilityObserver = new VisibilityObserver();

//        if ( this.container ) {
            this.visibilityObserver.observe(this.container);
//        };

        this.visibilityObserver.addEventListener('changeDetected', (e) => this.handleResize( e ) );

        this.dragElement         = undefined;
        this.dragElementNewIndex = undefined;
    }

    handleResize( event ) {}
    reset() {}

    transferProperties( element ) {}

    get element()           { return this._element; }
    set element( element )  { this._element = element; }

    get query()        { return this._query; }
    set query( query ) { this._query = query; }


    isReady () { return false; }
    applyFilter( object ) { return true; }

    getView() {
        const view = this.element.getSurroundingView();
        return view;
    }

    getListViewModel() {
        return this.getView()?.viewModel;
    }

    applyHeaderDefinitions() {
        const theaders = [...this.element.container.querySelectorAll('th')];
        // todo [OPEN]: add headers

        for (let i = 0; i < theaders.length; i++) {
            const coldef = this.columns[i];
            if (!coldef) continue;
            const header = coldef.header;
            if (!header) continue;
            // const viewElems = [...header.children];
            // if (viewElems.is_empty) continue;
            const theader = theaders[i];
            const elem = theader.querySelector('.header-content');
            if (!elem) continue;
            elem.innerHTML = header;
            // elem.innerHTML = '';
            // viewElems.forEach(viewElem => elem.appendChild(viewElem));
            const view = this.getView();
            if (view) {
                // todo [OPEN]: when an aurora attribute renders HTML (innerHTML) it must add/remove aurora attributes, add a mutation listener on each row like in blueprint element
                this.connectAuroraAttributes(elem, view.viewModel);
            }
        }
    }

    connectQuery( ) {
        this.query
            .onAdd((key, item, beforeKey) => this.itemAdded(key, item, beforeKey))
            .onDrop((key, olditem ) => this.itemDropped(key))
            .onMove()   // implement
            .onFlush();

    }

    collectClasses() {
        let classes = [];

        if (this.properties['dense'])     { classes.push('dense'); }
        if (this.properties['fullwidth']) { classes.push('fullwidth'); }

        return classes;
    }

/*
    async callbackItemClicked(query, key, object) {

        let route  = this.route;
        let router = universe.uirouter;
        let defroute = router.getRouteFor(route);
        if (!defroute) return;
        let parameter = await this.routeParameters(key, object);

        let buildRoute =  router.buildRoute(route, parameter);

        router.routePath(buildRoute, true);
    }

    async routeParameters(key, object) {
        let route  = this.route;
        let router = universe.uirouter;
        let defroute = router.getRouteFor(route);
        if (!defroute) return;
        let ids      = defroute.ids;

        let parameter = {};

        for (let i = 0; i < ids.length; i++) {
            const objid = ids[i];
            parameter[objid] = objid === '@key' ? key : await asyncWithPath(object, objid );
        }

        let buildRoute =  router.buildRoute(route, parameter);

        router.routePath(buildRoute, true);
    }
*/

    renderActions(listItemViewModel, actionDefinition ) {
        const view = ( actionDefinition.view )
                     ? '<view>' + actionDefinition.view + '</view>'
                     : '';
        return `<aurora-actions mode="${actionDefinition.actionstyle}" align="${actionDefinition.align}" aurora-bind:actions="getActions('${actionDefinition.actionset}')">${view}</aurora-actions>`;
    }

    //
    // AuroraAttributes
    //

    connectAuroraAttributes(element, viewModel) {
        const elements = [...element.querySelectorAll('*')];
        let auroraAttributes = [];
        elements.forEach(element => { auroraAttributes = [...auroraAttributes, ...element.getAuroraAttributes?.()] });
        element.auroraAttributes = auroraAttributes;
        auroraAttributes.forEach(attribute => attribute.attachViewModel(viewModel, viewModel.parent));
    }

    observeContentChanges(element, listItemViewModel) {
        element._mutationobserver = new MutationObserver((mutations) => this.viewMutated(mutations, element, listItemViewModel) );
        element._mutationobserver.observe(element, observeOptions);
    }

    //---- Drag and Drop Support  ----------------------

    connectDragDropSupport( container, element, listItemViewModel ) {
        const dragHandlers = [...element.querySelectorAll('.drag-handle')];

        if ( dragHandlers.length > 0 ) {
            element.addEventListener('dragstart', ( event ) => this.callbackDragStart( container, element, event ));
            element.addEventListener('dragover',  ( event ) => this.callbackDragOver(  event ) );
            element.addEventListener('dragenter', ( event ) => this.callbackDragEnter( container, element, event ));
            element.addEventListener('dragend',   ( event ) => this.callbackDragEnd(   container, element, event ));
            element.addEventListener('drop',      ( event ) => this.callbackDrop(  container, element, event ));
        }

        for ( let i=0; i<dragHandlers.length; i++ ) {
            const dragHandle = dragHandlers[i];
            dragHandle.addEventListener('mousedown', ( event ) => this.callbackDragHandlerMouseDown( container, element, event ));
        }
    }

    //--- this function is used to make an element draggable
    callbackDragHandlerMouseDown( container, element, event ) {
        element.setAttribute('draggable', true);
    }

    //--- this is just a dummy function to trigger the DROP event
    callbackDragOver( event ) {
        event.preventDefault();
        return false;
    }

    callbackDragStart(container, element, event ) {
        this.dragElement = element;
        element.classList.add("aurora-dragging");

        event.dataTransfer.dropEffect    = 'move';
        event.dataTransfer.effectAllowed = 'move';
    }

    callbackDragEnd(container, element, event ) {
        this.dragElement.setAttribute('draggable', false );
        this.dragElement.classList.remove("aurora-dragging");
    }

    callbackDrop(container, element, event ) {
        event.stopPropagation()
        this.dragElement.setAttribute('draggable', false );
        this.dragElement.classList.remove("is-dragging");

        //--- inform the item view model about the drop ---
        element.viewModel.dropElement( element, this.dragElementNewIndex  );
    }

    callbackDragEnter(container, element, event ) {

        let children = Array.from( container.querySelectorAll('.aurora-list-element' ));

        this.dragElementNewIndex = children.indexOf( element );

        if ( children.indexOf( element ) > children.indexOf( this.dragElement ) ) {
            element.after( this.dragElement );
        } else {
            element.before( this.dragElement );
        }
    }

    //--- END Drag and Drop --------------------------------------------

    viewMutated(mutations, element, listItemViewModel) {
        mutations.forEach( (mutation) => {
            switch(mutation.type) {
                case 'childList':
                    this.nodesMutated(mutation, element, listItemViewModel);
                    break;
                case 'attributes':
                    this.attributeMutated(mutation, element, listItemViewModel);
                    break;
                // not needed to detect changes of aurora-attributes
                // case 'characterData':
                //     break;
            }
        });
    }

    attributeMutated(mutation, element, listItemViewModel) {
        const name      = mutation.attributeName;
        const Attribute = AuroraAttribute.whichAuroraAttribute(name);   // is it even an aurora attribute
        if (!Attribute) return;

        const subelement = mutation.target;
        const value      = subelement.getAttribute(name);
        const attribute  = this.whichAuroraAttribute(element, subelement, name);     // get the matching attribute if it is already used

        // check if the attribute has been added/modified or removed

        // attribute was removed
        if (attribute && !value) return this.removeAuroraAttribute(attribute, element, subelement);

        // attribute was modified
        if (attribute && value)  return this.modifyAuroraAttribute(attribute, value, listItemViewModel);

        // attribute was added
        if (!attribute && value) return this.addAuroraAttribute(Attribute, element, subelement, name, value, listItemViewModel);
    }

    removeAuroraAttribute(attribute, element, subelement) {
        element.auroraAttributes = element.auroraAttributes.filter(attr => attr !== attribute);
        if (subelement.auroraAttributes) {
            subelement.auroraAttributes = subelement.auroraAttributes.filter(attr => attr !== attribute);
        }
        attribute.detachViewModel();
        attribute.disconnectElement();
    }

    modifyAuroraAttribute(attribute, value, listItemViewModel) {
        const viewModel = listItemViewModel;
        attribute.update(value, viewModel);
    }

    addAuroraAttribute(Attribute, element, subelement, name, value, listItemViewModel) {
        const viewModel = listItemViewModel;
        const attribute = Attribute.with(subelement, { name, value });
        element.auroraAttributes.push(attribute);
        if (!subelement.auroraAttributes) subelement.auroraAttributes = [];
        subelement.auroraAttributes.push(attribute);
        if (viewModel) attribute.attachViewModel(viewModel, viewModel.parent);
    }

    whichAuroraAttribute(element, subelement, attributename) {
        const attribute = element.auroraAttributes.find(auroraattribute => auroraattribute.element === subelement && auroraattribute.hasName(attributename));
        return attribute;
    }

    nodesMutated(mutation, element, listItemViewModel) {
        const auroraAttributes = element.auroraAttributes;
        const viewModel = listItemViewModel;

        //
        // first remove all removed aurora attributes
        //
        const removedElements = [...mutation.removedNodes];
        const removedAuroraAttributes = [];

        removedElements.forEach(element => {
            auroraAttributes
                .filter(attribute => attribute.isForElement(element))
                .forEach(attribute => {
                    removedAuroraAttributes.push(attribute);
                    attribute.detachViewModel();
                });
        });

        element.auroraAttributes = auroraAttributes.filter(attribute => !removedAuroraAttributes.includes(attribute));

        //
        // now get all added aurora attributes
        //
        const addedElements   = [...mutation.addedNodes];
        let addedAuroraAttributes = [];

        addedElements.forEach(element => { addedAuroraAttributes = [...addedAuroraAttributes, ...element.getAuroraAttributes?.() ?? [] ] });
        element.auroraAttributes = [...element.auroraAttributes, ...addedAuroraAttributes];

        if (viewModel) {
            // attach all aurora attributes to the view model
            // todo: check why this causes an endless loop respectively why it works anyways?
            // addedAuroraAttributes.forEach(attribute => attribute.attachViewModel(viewModel, viewModel.parent));
        }
    }

    dispose() {
        // implement by subclass
    }

}

export class AuroraListHandlerTable extends AuroraListHandler {
    constructor ( element ) {
        super( element );

        this.transferProperties( element );

        let functionNameRenderColumn = this.element.propertiesValues()['rendercolumn'];
        this.functionRenderColumn    = this.element.viewmodel?.[functionNameRenderColumn];

        this._itemModified           = async (evt) => await this.itemModified(evt);
    }

    transferProperties( element ) {
        this.sort = element.propertiesValues().sort;
        if (element.columns) this.columns = element.columns;
        if (element.query)   this.query   = element.query;
    }

    isReady () {
        return !!((this.columns || this.hasTableDefinition()) && this.query);
    }

    hasTableDefinition() {
        return this.element?.hasTableDefinition();
    }

    get columns()           { return this._columns; }
    set columns( column_definition )  {
        let columns = [];

        for (let c = 0; c < column_definition.length; c++) {
            let column              = column_definition[c];
            let newColumnDefinition = {...DEFAULT_COLUMN_DEFINITION_FOR_TABLE};
            Object.assign(newColumnDefinition, column);

            columns.push(newColumnDefinition);
        }

        this._columns = columns;
        this.registerVisibilityRules();

    }

    activate() {
        const auroralist = this.element;

        this.useFilter   = false;
        this.filter      = ''
        this.filterValue = '';

        if (auroralist.hasAttribute('filter')) {
            if (auroralist.getAttribute('filter') != '') {
                this.useFilter = true;
                this.filter    = auroralist.getAttribute('filter');
                if (auroralist.hasAttribute('filtervalue') &&
                    auroralist.getAttribute('filtervalue') != '') {
                    this.filterValue = auroralist.getAttribute('filtervalue').toUpperCase();
                }
            }
        }

        auroralist.applyTableDefinition();
        auroralist.applyFilterDefintion();
        auroralist.applyColumnDefinition();
        auroralist.container.innerHTML = this.scaffold();
        this.applyHeaderDefinitions();
        this.tablebody = auroralist.container.querySelector('tbody.aurora-table-body');

        this.connectQuery();
    }

    scaffold() {

        let display = '';
        display += this.scaffoldTableHeader();
        display += this.scaffoldTableBody();
        display += this.scaffoldTableFooter();

        return display;
    }

    scaffoldTableHeader() {
        let columns = this.columns;
        let display = '';

        // collect classes
        let classes = ['noselect'];
        if ( this.element.propertiesValues()['fullwidth'] ) {
            classes.push('fullwidth');
        }

        classes.push('presentation-' + this.element.tableDefinitions['presentation'] );

        display = '<div id="visibilitystyles"></div>';
        display += '<table class="'+ classes.join(' ') +'">';

        //--- table header -----------
        display += '<thead>';

        for (let c = 0; c < columns.length; c++) {
            let column = columns[c];

            let sortable = (column.sortable)
                ? 'sortable'
                : '';

            let sortHTML   = '<div class="aurora-sort-icon-wrapper"></div>';

            let responsive =    ( column.visibility != '')    // todo [REFACTOR]: just one
                                ? this.getVisibilityRulesName( column )
                                : '';

            let width = ( column.width != '' )
                        ? 'width:' + column.width + ';'
                        : '';

            display += '<th class="' + column.align + ' ' + sortable + ' ' + responsive + '" data-column="' + column.attribute + '"  style="'+ width +'"><div class="header-cell-wrapper">';

            if ( column.sortable ) {
                display += sortHTML;
            }

            display += /*column.header ? column.header :*/ '<div class="header-content">' + column.label + '</div>';

            display += '</div></th>';
        }

        display += '</thead>';

        return display;
    }

    scaffoldTableBody() {
        return'<tbody class="aurora-table-body"></tbody>';
    }

    scaffoldTableFooter() {
        let display = '';

        //--- table footer -----------
        display += '<tfoot>';
        display += '</tfoot>';

        display += '</table>';

        return display;
    }

    registerVisibilityRules() {
        let columns = this.columns;
        for (let c = 0; c < columns.length; c++) {
            let column = columns[c];

            if ( column.visibility != '' ) {
                let name           = this.getVisibilityRulesName(column);
                let ruledefinition = {
                    name : name,
                    class: name
                };
                if ( column.visibility.min || column.visibility.min == 0 ) {
                    ruledefinition.min = column.visibility.min;
                }
                if ( column.visibility.max ) {
                    ruledefinition.max = column.visibility.max;
                }

                this.visibilityObserver.registerRule( ruledefinition );
            }

        }
    }

    getVisibilityRulesName( column ) {
        let name = 'visibility_';
        name += ( column.visibility.min )
            ? column.visibility.min
            : 0 ;

        name += '_';
        name += ( column.visibility.max )
            ? column.visibility.max
            : 999999 ;

        return name;
    }

    handleResize( event ) {
        let style_element     = this.container.querySelectorAll('#visibilitystyles')[0];
        let classesOutOfRange = event.resize.classesOutOfRange;

        let style  = '';
        style += '<style>';

        for (let c = 0; c < classesOutOfRange.length; c++) {
            let classOutOfRange = classesOutOfRange[c];
            style += '.' + classOutOfRange + ' { display: none; }';
        }

        style += '</style>';
        style_element.innerHTML = style;
    }

    async getItemViewModelClass() {
        if (this.itemViewModelClass) return this.itemViewModelClass;
        this.itemViewModelClass = (await this.element.getItemViewModelClass(this.element.propertiesValues()))  ?? ListItemViewModel;
        return this.itemViewModelClass;
    }

    async itemAdded(key, item, beforeKey) {
        //--- TODO: protocol  to superclass
        // console.log(key);
        let object  = item;
        let rowHTML = '';
        let listItemViewModel, ListItemViewModelClass;

        //--- 1: itemViewModel
        //--- 2: renderRowFunction
        //--- 3: FILTER: true | false
        //       mayBeIncluded( object )
        //       applyFilter( object )
        //       sort - bubble the new entry into list or is this query a query functionality

        if ( ! await this.applyFilter( object ) ) return;

        ListItemViewModelClass = await this.getItemViewModelClass();
        listItemViewModel = await ListItemViewModelClass.with({ model: object, parent: this.getListViewModel() });

        rowHTML = await this.renderTableRow( key, listItemViewModel );

        let tr = document.createElement("tr");
        tr.setAttribute('item-id', key);
        tr.classList.add('aurora-list-element');

        // if route on list
        tr.addEventListener('click', (evt) => this.callbackItemClicked( this.query, key, object, evt ));

        //--- add the rendered HTML to the tr element
        tr.innerHTML = rowHTML;
        // todo [OPEN]: when an aurora attribute renders HTML (innerHTML) it must add/remove aurora attributes, add a mutation listener on each row like in blueprint element

        tr.viewModel = listItemViewModel;

        await this.insertItem( tr );

        this.connectAuroraAttributes( tr, listItemViewModel );
        this.observeContentChanges( tr, listItemViewModel );
        this.connectDragDropSupport( this.tablebody, tr, listItemViewModel );
    }

    async itemDropped(key) {
        const table = this.tablebody;
        // debugger;
        const rows = table.querySelectorAll('tr[item-id="' + key + '"]');
        rows.forEach(row => row.remove());
    }

    async insertItem( tr ) {
        // todo [OPEN]: add filters --> applyFilter()

        if (this.sort == '') {
            this.tablebody.append(tr);
            return;
        }
        const sort                  = this.sort;
        const itemToInsert          = tr.viewModel.model;
        if (!itemToInsert) return;

        const itemToInsertSortValue = await itemToInsert[sort];
        const items                 = this.tablebody.children;

        let inserted = false;

        for (let i = 0; i < items.length; i++) {
            const item = items[i].viewModel.model;
            const itemSortValue = await item[sort];
            if (itemSortValue > itemToInsertSortValue) {
                this.tablebody.insertBefore(tr, items[i]);
                inserted = true;
                break;
            }
            // add listener for each item to resort on changes
            // don't forget to remove listeners when filter changes or item gets removed
            item.addEventListener('change', this._itemModified);
        }

        if (!inserted) this.tablebody.append(tr);
    }

    async applyFilter(object) {

        if (this.useFilter) {
            if (this.filterValue === '' || !this.filterValue) return true;

            let attributeValue = await object [this.filter];

            if (attributeValue instanceof Function) {
                attributeValue = attributeValue.call(object);
            }

            attributeValue = attributeValue.toUpperCase();
            if (attributeValue.indexOf(this.filterValue) !== -1) return true;
            return false;
        }
        return true;
    }

    async itemModified(evt) {
        // await this.resort();
    }

    reset() {
        this.activate();
    }
    async resort() {
        const sort = this.sort;
        if (!sort) return;      // disconnect all listeners
        const table = this.tablebody;
        const rows = table.children;

        // todo [REFACTOR]: optimise this

        const sortValues = [];
        for await (const row of rows) {
            if (row.nodeType !== 1) continue;
            const item = await row.viewModel.model;
            const value = await item[sort];
            sortValues.push({ value, row });
        }

        sortValues.sort((a,b) => a.value === b.value ? 0 : a.value > b.value ? 1 : -1);
        const ordered = sortValues.map(({ row }) => row);
        table.innerHTML = '';
        ordered.forEach(row => table.append(row));
    }

    async callbackItemClicked(query, key, object, evt) {

        let route  = this.route;
        let router = universe.uirouter;
        let defroute = router.getRouteFor(route);
        if (!defroute) return;
        let ids      = parseRouteIds(route);
        const params = [];
        for (let i = 0; i < ids.length; i++) {
            const objid = ids[i];
            params.push(objid === '@key' ? key : await asyncWithPath(object, objid ));
        }
        let buildRoute =  router.buildFullRoute(defroute.route, params);

        router.routePath(buildRoute, evt?.metaKey);
    }

    async renderTableRow( key, listItemViewModel ) {
        let columns = this.columns;
        let query = this.query;

        let object = listItemViewModel.model;
        let display = '';

        for (let c = 0; c < columns.length; c++) {
            let column        = columns[c];
            let displayColumn = "";
            let cell          = "";

            let tdClasses = [];     // <td>         classes
            let cwClasses = ['cell-wrapper'];     // .cellWrapper classes
            tdClasses.push( column.align );

            let responsive = (column.visibility != '')
                ? this.getVisibilityRulesName( column )
                : '';

            if ( responsive != "" )   { tdClasses.push( responsive ) };
            if  ( column.draghandle ) { tdClasses.push('drag-handle'); }

            if (column.type === 'actions') {
                displayColumn += this.renderActions( listItemViewModel, column );
                tdClasses.push( 'action-edit-inline' );
            } else if (column.view) {
                displayColumn += column.view;
            } else {
                const classes   =   ( column.classes != "" )
                                    ? 'class="'+ column.classes +'"'
                                    : '';
                let valueelem = '<span ' + classes + ' aurora-bind="$.' + column.attribute + '"></span>';

                if ( this.functionRenderColumn ) {
                    valueelem = await this.functionRenderColumn.call( listItemViewModel, column, responsive, valueelem );
                }

                displayColumn += valueelem;
            }

            //--- decorate the column with <td> this will enable us to switch to different structure <div>  if needed


            cell = document.createElement('td');
            cell.classList.add( ...tdClasses );

            let cellRouting = "";

            if (column.route != '') {
                cwClasses.push('action-route');
                const replacedRoute = column.route.replace('{@key}', key);
                cellRouting = 'aurora-route="'+ replacedRoute + '"';
            }

            displayColumn = '<td class="' + tdClasses.join(' ') + '"><div class="' + cwClasses.join(" ") + '" '+ cellRouting +'>' + displayColumn + '</div></td>';

            display += displayColumn;
        }

        return display;
    }

    dispose() {
        const rows = [...this.tablebody.querySelectorAll('tr')];
        rows.forEach((element) => {
            element._mutationobserver?.disconnect();
            element.auroraAttributes.forEach(attribute => attribute.disconnect());
            element.viewModel?.dispose();
        });
    }


}

export class AuroraListHandlerGrid  extends AuroraListHandler {

    constructor( element ) {
        super( element );
        this.transferProperties( element );
        this._itemModified = async (evt) => await this.itemModified(evt);
    }

    transferProperties( element ) {
 //       if ( element.gridDefinition.view ) this.view = element.gridDefinition.view;
        this.sort = element.propertiesValues().sort;
        if ( element.query )   this.query   = element.query;
    }


    isReady() { return true; }

    activate() {
        const auroralist = this.element;
        auroralist.applyGridDefinition();

        switch ( 'dynamic' ) {
            case 'fixed':
                // no registration necessary
                break;
            case 'dynamic':
                this.registerGridRulesDynamic();
                break;
            case 'userdefined':
                this.registerGridRulesUserDefined();
                break;
        }
//        this.registerVisibilityRules();

        this.container.innerHTML = this.scaffold();

        this.grid = this.container.querySelector('.aurora-list-grid');

        this.connectQuery();
    }

    scaffold(){

        let display = '';

        display += '<div id="grid-transition"><style>';

        const gridDimension = this.calculateGridDimensions( this.element.gridDefinition.columns );

        if ( this.properties['elementwidth'] ) {

            display += '.aurora-grid-element { width: ' + gridDimension['element'] + '%; }';
//            display += '.aurora-grid-element { width: ' + this.properties['elementwidth'] + ' }';

        }

        display += '</style></div>';
        // style :  aurora-grid-element: width = 25%
        //          gap:

        let classes = this.collectClasses();
        display += '<div id="visibilitystyles"></div>';

        if ( this.element.gridDefinition?.style ) {
            display += '<style>';
            display += this.element.gridDefinition?.style;
            display += '</style>';
        }

        display += '<div class="aurora-list-grid '+ classes +'"></div>';

        return display;
    }

    handleResize( event ) {
        const classesInRange = event.resize.classesInRange;

        const numberOfColumns = ( classesInRange.length > 0 )
                                ? classesInRange[0]
                                : 2;

        const gridDimension = this.calculateGridDimensions( numberOfColumns );


        let style  = '';
        style += '<style>';
        style += '.aurora-grid-element { width: ' + gridDimension['element'] + '%; }';
        style += '</style>';
        const style_element  = this.container.querySelectorAll('#grid-transition')[0];
        if (!style_element) return;
        style_element.innerHTML = style;
    }

    registerGridRulesUserDefined() {

        let gridTransitions = this.element.gridTransitions;

        for (let c = 0; c < gridTransitions.length; c++) {
            let gridTransition = gridTransitions[c];

            let ruledefinition = {
                name : gridTransition.columns,
                class: gridTransition.columns,
            };

            if ( gridTransition.from || gridTransition.from == 0) {
                ruledefinition.min = gridTransition.from;
            }
            if ( gridTransition.to ) {
                ruledefinition.max = gridTransition.to;
            }

            this.visibilityObserver.registerRule(ruledefinition);
        }
    }
    registerGridRulesDynamic() {

        const elementWidth = 200;
        const gapSize      = 1;
        const endWidth     = 3000;

        let columns = 1;
        let from    = 0;

        let currentWidth      = elementWidth;


        while ( true ) {
            currentWidth += elementWidth;
            currentWidth += this.calculateGapsAsPixel( gapSize, columns, elementWidth );

            let ruleDefinition = {
                name : columns,
                class: columns,
                min: from,
                max: currentWidth,
            };

            this.visibilityObserver.registerRule( ruleDefinition );

            columns += 1;
            from    = currentWidth + 1;

            if ( currentWidth >= endWidth ) { break; }
        }
    }

    calculateGapsAsPixel( gapSize, columns, elementWidth  ) {
        return 10;
    }

    calculateGridDimensions( numberOfColumns ) {
        const gap        = 1;
        const gaps       = numberOfColumns - 1;
        const listWidth  = this.container.offsetWidth;
        const onePercent = listWidth / 100;

        const gapsWidth = gaps * onePercent;
        const elementWidth = ( listWidth - gapsWidth ) / numberOfColumns;

        return {
            element: (100 / listWidth) * elementWidth,
            gap    : 1
        }

    }

    async getItemViewModelClass() {
        if (this.itemViewModelClass) return this.itemViewModelClass;
        this.itemViewModelClass = /*(await this.element.getItemViewModelClass(this.element.propertiesValues()))  ??*/ ListItemViewModel;
        return this.itemViewModelClass;
    }

    async itemAdded(key, item, beforeKey) {
        //--- GRID
        //--- TODO: protocol  to superclass
        // console.log(key);

        let object      = item;
        let elementHTML = '';
        let listItemViewModel;
        let element;


        if ( ! this.applyFilter( object ) ) return;

        const ListItemViewModelClass = await this.getItemViewModelClass();


        if (this.itemview) {
            elementHTML = document.createElement("aurora-view");
            elementHTML.setAttribute( 'gridelement', '');
            elementHTML.setAttribute('view', this.itemview);
 //           elementHTML.innerHTML = `<aurora-view view="${this.itemview}"></aurora-view>`;
            listItemViewModel = await ListItemViewModelClass.with({ model: object, parent: this.getListViewModel() });
        } else {
            if (this.functionItemViewModel) {
                listItemViewModel = await this.functionItemViewModel.call(this.vm, object);
            } else {

                elementHTML = this.element.gridDefinition.view;
                listItemViewModel = await ListItemViewModelClass.with({ model: object, parent: this.getListViewModel() });
            }

            if (this.functionRenderElement) {
                elementHTML = await this.functionRenderElement.call(this.vm, this, this.query, listItemViewModel, this.columns);
            } else {
 //               elementHTML = await this.renderTableRow(listItemViewModel);
            }
        }

 //       elementHTML = "MARTIN";

        element = document.createElement("div");
        element.setAttribute('item-id', key);
        element.classList.add('aurora-grid-element');

        element.addEventListener('click', (evt) => this.callbackItemClicked( this.query, key, object, evt ));
 //       element.append(elementHTML);

        element.innerHTML = elementHTML;
        //       listItemViewModel.actionBuilder

        let view       = element.children[0];
        //view.viewModel = listItemViewModel;

        element.viewModel = listItemViewModel;

        await this.insertItem( element );

        this.connectAuroraAttributes( element, listItemViewModel );
        this.observeContentChanges( element, listItemViewModel );

    }


    async insertItem( element ) {

        if (this.sort == '') {
            this.grid.append(element);
            return;
        }
        const sort                  = this.sort;
        const itemToInsert          = element.viewModel.model;
        const itemToInsertSortValue = await itemToInsert[sort];
        const items                 = this.grid.children;

        let inserted = false;

        for (let i = 0; i < items.length; i++) {
            const item = items[i].viewModel.model;
            const itemSortValue = await item[sort];
            if (itemSortValue > itemToInsertSortValue) {
                this.grid.insertBefore(element, items[i]);
                inserted = true;
                break;
            }
            // add listener for each item to resort on changes
            // don't forget to remove listeners when filter changes or item gets removed
            item.addEventListener('change', this._itemModified);
        }

        if (!inserted) this.grid.append(element);
    }


    // todo [OPEN]
    async itemModified(evt) {}

    async callbackItemClicked(query, key, object, evt) {
    // Todo: move to superclass...
        let route  = this.route;
        let router = universe.uirouter;
        let defroute = router.getRouteFor(route);
        if (!defroute) return;
        let ids      = parseRouteIds(route);
        const params = [];
        for (let i = 0; i < ids.length; i++) {
            const objid = ids[i];
            params.push(objid === '@key' ? key : await asyncWithPath(object, objid ));
        }
        let buildRoute =  router.buildFullRoute(defroute.route, params);

        router.routePath(buildRoute, evt?.metaKey);
    }
}

AuroraList.defineElement();
