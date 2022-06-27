/**
 *
 * @author: Martin Neitz, Bernhard Lukassen
 */

import AuroraFormElement  from "../formcomponents/auroraformelement.mjs";
import { asyncWithPath }  from "/evolux.util/lib/pathutils.mjs";
import ListItemViewModel  from "../viewmodel/listitemviewmodel.mjs";
import { fromKVString }   from "/evolux.util/lib/objutils.mjs";

// TODO: support visibiity (scroll in) -> import VisibilityObserver from "/thoregon.aurora/lib/visibilityobserver.mjs";

// TODO: remove -> import dragula            from '../../ext/dragula/dragula.mjs';

import { AuroraActionBuilderIconContainer, AuroraActionBuilderMenu } from "../component-actions/auroaactionsbuilder.mjs";

export default class AuroraList extends AuroraFormElement {

    constructor() {
        super();

        this._columns = undefined;
        this._query   = undefined;
        this._handler = undefined;
    }

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-list';
    }

    static get observedAttributes() {
        return [...super.observedAttributes, 'mode' ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if ( ! this.container ) return;

        switch (name) {
            case 'mode' :
                this.propertiesValues()['mode'] = newValue;
                this.determineAndSetHandler( true );
                this.activateWhenReady();
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
        this._query = query;

        this.determineAndSetHandler();
        this.handler.query = this.query;
        this.activateWhenReady();
    }

    //--- Attribute handler  ---
    get handler()          { return this._handler; }
    set handler( handler ) { this._handler = handler; }


    determineAndSetHandler( reset = false ) {

        if ( this.handler && ! reset ) return this.handler;

        let propertiesValues = this.propertiesValues();

        switch ( propertiesValues['mode'] ) {
            case 'table':
                this.handler = new AuroraListHandlerList(this);
                //this._handler = new AuroraListHandlerTable( this.container, vm, query, propertiesValues );
                break;
            case 'grid':
                this.handler = new AuroraListHandlerList(this);
//                this._handler = new AuroraListHandlerGrid( this.container, vm, query, propertiesValues );
//                this.container.innerHTML = this.renderGrid( query, columns );
                // data loop ---

                //              let grid = this.container.querySelector('.aurora-list-grid');
                //            await this.renderGridElements( query, elemenfunction, columns, grid );
                break;
        }
    }
    activateWhenReady() {
        if ( this.handler.isReady() ) { this.handler.activate(); }
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

        this.applyColumnDefinition();

        this.behavior.attach(this);
    }

    disposeView() {
        super.disposeView();
        let route = this.propertiesValues()['route'];
        if (route) universe.uirouter.removeSource(route, this);
    }

    applyColumnDefinition() {
        const columnElements = [...this.querySelectorAll('column')];
        const columnDefinitions = columnElements.map(columnElement => (
            {
                name      : columnElement.getAttribute('name') ?? '',
                label     : columnElement.getAttribute('label') ?? '',
                header    : columnElement.querySelector('header')?.innerHTML,
                view      : [...columnElement.children].filter(node => node.tagName !== 'HEADER').map(node => node.outerHTML).join('\n'),
                sortable  : columnElement.hasAttribute('sortable'),
                filterable: columnElement.hasAttribute('filterable'),
                visibility: fromKVString(columnElement.getAttribute('visibility')) ?? ''      // todo [REFACTOR
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
    route      : '',
    visibility : '',
    set        : 'default',
    actionstyle: 'menu',
    classes    : '',
    width      : '',
    view       : undefined
}


export class AuroraListHandler {

    constructor( container, vm, query , properties ) {

        this.actionBuilderMenu          = new AuroraActionBuilderMenu();
        this.actionBuilderIconContainer = new AuroraActionBuilderIconContainer();

        this.container  = container;
        this.vm         = vm;
        this.query      = query;
        this.properties = properties;
        this.route      = properties['route'];

        let functionNameItemViewModel = properties[':itemviewmodel'];
        this.functionItemViewModel    = vm[functionNameItemViewModel];

    }

    connectQuery( ) {
        this.query
            .onAdd((key, item, beforeKey) => this.itemAdded(key, item, beforeKey))
            .onDrop()
            .onMove()
            .onFlush();

    }

    collectClasses() {
        let classes = [];

        if (this.properties['dense'])     { classes.push('dense'); }
        if (this.properties['fullwidth']) { classes.push('fullwidth'); }

        return classes;
    }

    async callbackItemClicked(query, key, object) {
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

    renderActions(listItemViewModel, actionDefinition ) {
        return "<aurora-actions mode='" + actionDefinition.actionstyle + " position='" + actionDefinition.align + "'></aurora-actions>"
    }
}

export class AuroraListHandlerList {
    constructor ( element ) {
        this._element = element;
        this._columns = undefined;
        this._query   = undefined;   // need to move up as every handler will have a query
        this.transferProperties( element );

        let functionNameRenderColumn = this.element.propertiesValues()['rendercolumn'];
        this.functionRenderColumn    = this.element.viewmodel?.[functionNameRenderColumn];
    }

    transferProperties( element ) {
        this.columns = element.columns;
        this.query   = element.query;
    }

    isReady () {
        return  !!( this.columns &&
                    this.query );
    }

    get element()           { return this._element; }
    set element( element )  { this._element = element; }

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
    }

    get query()        { return this._query; }
    set query( query ) { this._query = query; }

    activate () {
        this.element.container.innerHTML = this.scaffold();
        this.tablebody = this.element.container.querySelector('tbody.aurora-table-body');

        this.connectQuery();
    }

    connectQuery( ) {
        this.query
            .onAdd((key, item, beforeKey) => this.itemAdded(key, item, beforeKey))
            .onDrop()
            .onMove()
            .onFlush();

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
        let classes = [];
        if ( this.element.propertiesValues()['fullwidth'] ) {
            classes.push('fullwidth');
        }

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

            display += '<th class="' + column.align + ' ' + sortable + ' ' + responsive + '" data-column="' + column.attribute + '"  style="'+ width +'">';

            if ( column.sortable ) {
                display += sortHTML;
            }

            display += column.header ? column.header : column.label;

            display += '</th>';
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

    async itemAdded(key, item, beforeKey) {
        //--- TODO: protocol  to superclass
        // console.log(key);

        let object  = item;
        let rowHTML = '';
        let listItemViewModel;

        //--- 1: itemViewModel
        //--- 2: renderRowFunction
        //--- 3: FILTER: true | false
        //       mayBeIncluded( object )
        //       applyFilter( object )
        //       sort - bubble the new entry into list or is this query a query functionality

        if ( ! this.applyFilter( object ) ) return;

        listItemViewModel = await ListItemViewModel.with({model: object});

        rowHTML = await this.renderTableRow( listItemViewModel );

        let tr = document.createElement("tr");
        tr.setAttribute('item-id', key);

    //    tr.addEventListener('click', () => this.callbackItemClicked( this.query, key, object ));

        //--- add the rendered HTML to the tr element
        tr.innerHTML = rowHTML;

        tr.viewModel = listItemViewModel;

        this.tablebody.append(tr);

        this.connectAuroraAttributes(tr, listItemViewModel);
    }

    applyFilter( object ) {
     //   if ( object.name == "EasySummit" ) return false;
        return true;
    }

    connectAuroraAttributes(element, viewModel) {
        const elements = [...element.querySelectorAll('*')];
        let auroraAttributes = [];
        elements.forEach(element => { auroraAttributes = [...auroraAttributes, ...element.getAuroraAttributes?.()] });
        element.auroraAttributes = auroraAttributes;
        auroraAttributes.forEach(attribute => attribute.attachViewModel(viewModel));
    }

    async renderTableRow( listItemViewModel ) {
        let columns = this.columns;
        let query = this.query;

        let object = listItemViewModel.model;
        let display = '';

        for (let c = 0; c < columns.length; c++) {
            let column        = columns[c];
            let displayColumn = "";

            let responsive = (column.visibility != '')
                ? this.getVisibilityRulesName( column )
                : '';

            if (column.type === 'actions') {
                displayColumn += this.renderActions( listItemViewModel, column );
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

                if (column.route != '') {
                    displayColumn += '<a href="">' + valueelem /*await this.getColumnValue(object, column )*/ + '</a>';
                } else {
                    displayColumn += valueelem; // await this.getColumnValue(object, column );
                    // display += object[column.attribute];
                }
            }

            //--- decorate the column with <td> this will enable us to switch to different structure <div>  if needed
            displayColumn = '<td class="' + column.align + ' ' + responsive + '">' + displayColumn + '</td>';

            display += displayColumn;
        }

        return display;
    }



}

export class AuroraListHandlerTable extends AuroraListHandler {
    constructor( container, vm, query , properties ) {
        super( container, vm, query , properties );

        /*
        this.visibilityObserver = new VisibilityObserver();
        this.visibilityObserver.observe( this.container );
        this.visibilityObserver.addEventListener('changeDetected', (e) => this.handleVisibilityResize( e ) );

        let functionNameColumnDefinition = properties[':columns'];
        let functionNameRenderRow        = properties[':renderrow'];

        this.functionRenderRow     = vm[functionNameRenderRow];

 */
        this.columns = this.getColumnDefinition(vm, functionNameColumnDefinition, query);
    }

    activate() {
        this.container.innerHTML = this.scaffold();
//        this.setResponsiveTableBreakpoints(columns);  // need to move

        this.registerVisibilityRules();
        this.tablebody = this.container.querySelector('tbody.aurora-table-body');

        this.connectQuery();
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
                if ( column.visibility.min ) {
                    ruledefinition.min = column.visibility.min;
                }
                if ( column.visibility.max ) {
                    ruledefinition.max = column.visibility.max;
                }
                this.visibilityObserver.registerRule( ruledefinition );
            }

        }
    }

    getVisibilityRulesName(column ) {
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

    handleVisibilityResize( event ) {
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

    async itemAdded(key, item, beforeKey) {
        //--- TODO: protocol  to superclass
        // console.log(key);

        let object  = item;
        let rowHTML = '';
        let listItemViewModel;

        //--- 1: itemViewModel
        //--- 2: renderRowFunction
        //--- zoe

        if ( this.functionItemViewModel ) {
            listItemViewModel = await this.functionItemViewModel.call( this.vm, object );
        } else {
            listItemViewModel = await ListItemViewModel.with({model: object});
        }

        if ( this.functionRenderRow ) {
            rowHTML = await this.functionRenderRow.call( this.vm, this, this.query, listItemViewModel, this.columns );
        } else {
            rowHTML = await this.renderTableRow( listItemViewModel );
        }

        let tr = document.createElement("tr");

        tr.setAttribute('item-id', key);

        tr.addEventListener('click', () => this.callbackItemClicked( this.query, key, object ));

        //--- add the rendered HTML to the tr element
        tr.innerHTML = rowHTML;

        tr.viewModel = listItemViewModel;

        this.tablebody.append(tr);

        // todo [REFACTOR]: get rid of this ugly workaround  $$@AURORACLEANUP
        setTimeout(() => {
            listItemViewModel.view = tr;
        }, 500);
    }

    async renderTableRow( listItemViewModel ) {
        let columns = this.columns;
        let query = this.query;

        let object = listItemViewModel.model;
        let display = '';

        for (let c = 0; c < columns.length; c++) {
            let column = columns[c];

            let responsive = (column.visibility != '')
                ? this.getVisibilityRulesName( column )
                : '';

            display += '<td class="' + column.align + ' ' + responsive + '">';
            if (column.type === 'actions') {
                display += this.renderActions( listItemViewModel, column );
            } else {
                const valueelem = '<span aurora-name="' + column.attribute + '"></span>';
                if (column.route != '') {
                    display += '<a href="">' + valueelem /*await this.getColumnValue(object, column )*/ + '</a>';
                } else {
                    display += valueelem; // await this.getColumnValue(object, column );
                    // display += object[column.attribute];
                }
            }
            display += '</td>';
        }

        return display;
    }

    scaffold() {
        //--- TODO: define protocol on superclass

        let display = '';

        display += this.scaffoldTableHeader();
        display += this.scaffoldTableBody();
        display += this.scaffoldTableFooter();

        return display;
    }

    scaffoldTableHeader() {

        let columns = this.columns;
        let display = '';

        let classes = this.collectClasses();

        display = '<div id="visibilitystyles"></div>';
        display += '<table class="' + classes.join(' ') + '">';

        //--- table header -----------
        display += '<thead>';

        for (let c = 0; c < columns.length; c++) {
            let column = columns[c];

            let sortable = (column.sortable)
                ? 'sortable'
                : '';

            let sortHTML   = '<div class="aurora-sort-icon-wrapper"><svg class="aurora-sort-icon" aria-hidden="true" role="presentation" viewBox="0 0 24 24"><path d="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z"></path></svg></div>';
            sortHTML       = '<div class="aurora-sort-icon-wrapper"></div>'
            let responsive = (column.visibility != '')
                ? this.getVisibilityRulesName( column )
                : '';

            display += '<th class="' + column.align + ' ' + sortable + ' ' + responsive + '" data-column="' + column.attribute + '">';

            if (column.sortable && column.align == 'right') {
                display += sortHTML;
            }

            display += column.label;

            if (column.sortable && column.align != 'right') {
                display += sortHTML;
            }

            display += '</th>';
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

    getColumnDefinition(vm, function_columns, query ) {
        let defaults = {
            type       : 'value',
            attribute  : '',
            name       : '',
            label      : '',
            align      : 'left',
            sortable   : false,
            route      : '',
            visibility : '',
            set        : 'default',
            actionstyle: 'menu',
        }

        let metaClass         = query.baseMetaClass;
        if (!vm[function_columns]) return;
        let column_definition = vm[function_columns]();
        let columns           = [];

        for (let c = 0; c < column_definition.length; c++) {
            let column              = column_definition[c];
            let newColumnDefinition = {...defaults};
            Object.assign(newColumnDefinition, column);

            if ( newColumnDefinition.label == '' ) {
                if ( metaClass?.attributes[column.attribute] ) {
                    newColumnDefinition.label = metaClass.attributes[column.attribute].i18nColumn();
                }
            }

            columns.push(newColumnDefinition);
        }

        return columns;
    }

}
export class AuroraListHandlerGrid  extends AuroraListHandler {

    constructor( container, vm, query , properties ) {
        super( container, vm, query , properties );

        this.itemview = properties['itemview'];

        let functionNameColumnDefinition = properties[':columns'];
        let functionNameRenderElement    = properties[':renderelement'];

        this.functionRenderElement     = vm[functionNameRenderElement];
//        this.columns = this.getColumnDefinition(vm, functionNameColumnDefinition, query);
    }

    activate() {
        this.container.innerHTML = this.scaffold();
//               this.setResponsiveTableBreakpoints(columns);  // need to move

        this.grid = this.container.querySelector('.aurora-list-grid');

        this.connectQuery();
    }

    scaffold(){

        let display = '';
        let classes = this.collectClasses();
        display += '<div class="aurora-list-grid '+ classes +'"></div>';

        return display;
    }

    async itemAdded(key, item, beforeKey) {
        //--- TODO: protocol  to superclass
        // console.log(key);

        let object  = item;
        let elementHTML = '';
        let listItemViewModel;
        let element;

        if (this.itemview) {
            element = document.createElement("div");
            element.setAttribute('item-id', key);

            element.addEventListener('click', () => this.callbackItemClicked( this.query, key, object ));

            element.innerHTML = `<aurora-view view="${this.itemview}"></aurora-view>`;
            element.children[0].model = item;
            this.grid.appendChild(element);
        } else {
            if (this.functionItemViewModel) {
                listItemViewModel = await this.functionItemViewModel.call(this.vm, object);
            } else {
                listItemViewModel = await ListItemViewModel.with({ model: object });
            }

            if (this.functionRenderElement) {
                elementHTML = await this.functionRenderElement.call(this.vm, this, this.query, listItemViewModel, this.columns);
            } else {
                elementHTML = await this.renderTableRow(listItemViewModel);
            }

            element = document.createElement("div");
            element.setAttribute('item-id', key);
            element.classList.add('aurora-grid-element');
            element.style['width'] = this.properties['elementwidth'];

            element.addEventListener('click', () => this.callbackItemClicked(query, key, object, tr, route));
            element.innerHTML = elementHTML;

            //       listItemViewModel.actionBuilder

            let view = element.children[0];
            view.viewModel = listItemViewModel;

            this.grid.append(element);

            setTimeout(() => {
                listItemViewModel.view = view;
            }, 500);
        }
    }
}

AuroraList.defineElement();
