/**
 *
 * @author: Martin Neitz, Bernhard Lukassen
 */

import AuroraFormElement from "../formcomponents/auroraformelement.mjs";
import { asyncWithPath } from "/evolux.util/lib/pathutils.mjs";
import ListItemViewModel from "../viewmodel/listitemviewmodel.mjs";

export default class AuroraList extends AuroraFormElement {
// AuroraList
    _columns = {};

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-list';
    }

    /*
     * aurora element features
     */

    get isTrigger() {
        return true;
    }

    get isCollectionItem() {
        return true;
    }

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
            ':renderrow'    : {
                default    : '',
                type       : 'string',
                description: 'defines the render function responsible for one data row in table mode',
                group      : 'Content',
                example    : 'myRenderRowFunction'
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
        super.existsConnect();

        let propertiesValues = this.propertiesValues();
        let functionQuery    = propertiesValues[':query'];
        let vm               = this.viewModel || this.parentViewModel();

        if (!vm[functionQuery]) return;

        let query = await vm[functionQuery]();

        let handler;

        switch ( propertiesValues['mode'] ) {
            case 'table':
                handler = new AuroraListHandlerTable( this.container, vm, query, propertiesValues );
                break;
            case 'grid':
                handler = new AuroraListHandlerGrid( this.container, vm, query, propertiesValues );
//                this.container.innerHTML = this.renderGrid( query, columns );
                // data loop ---

  //              let grid = this.container.querySelector('.aurora-list-grid');
    //            await this.renderGridElements( query, elemenfunction, columns, grid );
                break;
        }

        handler.activate();
        this.behavior.attach(this);
//        this._columns = columns;

    }

    renderGrid(  query, columns  ) {
        let classes = this.collectClasses();

        return '<div class="aurora-list-grid '+ classes +'"></div>';

    }

    async renderGridElements( query, elemenfunction, columns, grid ) {
        let route = this.propertiesValues()['route'];

        let propertiesValues      = this.propertiesValues();
        let functionItemViewModel = propertiesValues[':itemviewmodel'];
        let vm                    = this.viewModel || this.parentViewModel();
        let itemviewmodelfunction = vm[functionItemViewModel];


        for await (const key of query.itemKeys) {
            let object = await query.get(key);
            let listItemViewModel;

            if ( itemviewmodelfunction ) {
                listItemViewModel = await itemviewmodelfunction(object);
            } else {
                listItemViewModel = await ListItemViewModel.with({ model: object });
            }


            let elementHTML = '';
            if (elemenfunction) {
                elementHTML = elemenfunction(this, query, listItemViewModel, columns);
            } else {
                elementHTML = await this.renderTableRow(object, columns, query);
            }

            let element = document.createElement("div");

            element.classList.add('aurora-grid-element');
            element.style['width'] = this.propertiesValues()['elementwidth'];
            element.addEventListener('click', ()=>this.callbackItemClicked(query, key, object, tr, route) );
            element.innerHTML = elementHTML;
            grid.append(element);
        }
    }

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




    async __renderTableData( query, rowfunction, columns, tablebody ) {
        let route = this.propertiesValues()['route'];

        let propertiesValues      = this.propertiesValues();
        let functionItemViewModel = propertiesValues[':itemviewmodel'];
        let vm                    = this.viewModel || this.parentViewModel();
        let itemviewmodelfunction = vm[functionItemViewModel];

        for await (let key of query.itemKeys) {
            let object = await query.get(key);
            let rowHTML = '';
            let listItemViewModel;

            if ( itemviewmodelfunction ) {
                listItemViewModel = await itemviewmodelfunction(object);
            } else {
                listItemViewModel = await ListItemViewModel.with({ model: object });
            }

            if (rowfunction) {
                rowHTML = rowfunction(this, query, listItemViewModel, columns);
            } else {
                rowHTML = await this.renderTableRow( listItemViewModel, columns, query);
            }

            let tr = document.createElement("tr");

            tr.addEventListener('click', ()=>this.callbackItemClicked(query, key, object, tr, route) );

            //--- add the rendered HTML to the tr element
            tr.innerHTML = rowHTML;

            listItemViewModel.view = tr;

            tablebody.append(tr);
        }
    }
    async callbackItemActionClicked( object, action ) {
        this.triggerItemActions(action, [object]);
    }
    async callbackItemClicked(query, key, object, tr, route ) {

        let router = universe.uirouter;
        let ids    = router.getRouteFor(route).ids

        let parameter = {};

        for (let i = 0; i < ids.length; i++) {
            const objid = ids[i];
            parameter[objid] = objid === '@key' ? key : await asyncWithPath(object, objid );
        }

        let buildRoute =  router.buildRoute(route, parameter);

        router.routePath(buildRoute);
    }

    async renderTableRow(listItemViewModel, columns, query) {
        let object = listItemViewModel.model;
        let display = '';

        for (let c = 0; c < columns.length; c++) {
            let column = columns[c];

            let responsive = (column.responsivebreakpoint != '')
                ? 'responsive_' + column.responsivebreakpoint
                : '';

            display += '<td class="' + column.align + ' ' + responsive + '">';
            if (column.type === 'actions') {
                display += this.renderActions(listItemViewModel, column);
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

    async getColumnValue( object, column ) {
        return await asyncWithPath(object, column.attribute );
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
        let ids    = router.getRouteFor(route).ids

        let parameter = {};

        for (let i = 0; i < ids.length; i++) {
            const objid = ids[i];
            parameter[objid] = objid === '@key' ? key : await asyncWithPath(object, objid );
        }

        let buildRoute =  router.buildRoute(route, parameter);

        router.routePath(buildRoute);
    }

    renderActions(listItemViewModel, actionDefinition) {

        switch (actionDefinition.actionstyle) {
            case "iconcontainer":
                return this.actionBuilderIconContainer.renderActions(listItemViewModel, actionDefinition);
            case "menu":
            default:
                return this.actionBuilderMenu.renderActions(listItemViewModel, actionDefinition);
                break;
        }

    }

}
export class AuroraListHandlerTable extends AuroraListHandler {
    constructor( container, vm, query , properties ) {
        super( container, vm, query , properties );

        let functionNameColumnDefinition = properties[':columns'];
        let functionNameRenderRow        = properties[':renderrow'];

        this.functionRenderRow     = vm[functionNameRenderRow];
        this.columns = this.getColumnDefinition(vm, functionNameColumnDefinition, query);
    }

    activate() {
        this.container.innerHTML = this.scaffold();
//               this.setResponsiveTableBreakpoints(columns);  // need to move

        this.tablebody = this.container.querySelector('tbody.aurora-table-body');

        this.connectQuery();
    }

     async itemAdded(key, item, beforeKey) {
        //--- TODO: protocol  to superclass
        console.log(key);

        let object  = item;
        let rowHTML = '';
        let listItemViewModel;

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

        tr.addEventListener('click', () => this.callbackItemClicked( this.query, key, object ));

        //--- add the rendered HTML to the tr element
        tr.innerHTML = rowHTML;

        listItemViewModel.view = tr;

        this.tablebody.append(tr);

    }

    async renderTableRow( listItemViewModel ) {
        let columns = this.columns;
        let query = this.query;

        let object = listItemViewModel.model;
        let display = '';

        for (let c = 0; c < columns.length; c++) {
            let column = columns[c];

            let responsive = (column.responsivebreakpoint != '')
                ? 'responsive_' + column.responsivebreakpoint
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

        display = '<div id="responsivebreakpoints"></div>';
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
            let responsive = (column.responsivebreakpoint != '')
                ? 'responsive_' + column.responsivebreakpoint
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
            type                : 'value',
            attribute           : '',
            name                : '',
            label               : '',
            align               : 'left',
            sortable            : false,
            route               : '',
            responsivebreakpoint: '',
            set                 : 'default',
            actionstyle         : 'menu',
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
        console.log(key);

        let object  = item;
        let elementHTML = '';
        let listItemViewModel;
        let element;

        if (this.itemview) {
            element = document.createElement("div");

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
            element.classList.add('aurora-grid-element');
            element.style['width'] = this.properties['elementwidth'];

            element.addEventListener('click', () => this.callbackItemClicked(query, key, object, tr, route));
            element.innerHTML = elementHTML;
//        listItemViewModel.view = element.children[0];
//        debugger;
            //       listItemViewModel.actionBuilder

            this.grid.append(element);
        }
    }
}

export class AuroraActionBuilderIconContainer {
    renderActions( listItemViewModel, actionDefinition ) {
        let display = '';
        let actions = listItemViewModel.getActions( actionDefinition.set )['all'];

        // in case no actions are loaded
//        if (actions.length == 0 ) return;

//        let actions_primary = listItemViewModel.model.metaClass.getAllActions()['primary'];
//        let actions_primary = listItemViewModel.model.metaClass.getAllActions()['secondary'];

        display += '<div class="aurora-table-actions">';
        display += '    <div class="aurora-table-actions-container">';
        display += '        <ul>';

        for (let i = 0; i < actions.length; i++) {
            let action = actions[i];
            display += this.renderActionIconContainer(listItemViewModel, action);
        }

        display += '<li class="aurora-table-action" ><i aria-hidden="true" class="material-icons aurora-icon">more_horiz</i></li>'

        display += '        </ul>';
        display += '      </div>';
        display += '    </div>';
        display += '</div>';
        return display;
    }
    renderActionIconContainer( listItemViewModel, action ) {

        if (listItemViewModel.isActionAvailable()) {
            const disabledClass =   ( listItemViewModel.isActionDisabled() )
                ? 'disabled'
                : '';

            return '<li class="aurora-table-action ' + disabledClass + ' ' + action.name + '" aurora-action="' + action.name + '"><i aria-hidden="true" class="material-icons aurora-icon">' + action.icon + '</i></li>';
        }
        return '';
    }
}

export class AuroraActionBuilderMenu {
    renderActions( listItemViewModel, actionDefinition  ) {
        let display = '';

        let actions = listItemViewModel.getActions( actionDefinition.set )['all'];

        display += '<div class="aurora-table-actions">';
        display += '    <div class="aurora-table-actions-trigger"><span class="material-icons">more_horiz</span></div>';
        display += '    <div class="aurora-table-actions-menu hidden">';
        display += '        <ul>';

        for (let i = 0; i < actions.length; i++) {
            let action = actions[i];
            if (listItemViewModel.isActionAvailable()) {
                const disabledClass =   ( listItemViewModel.isActionDisabled() )
                    ? 'disabled'
                    : '';

                display +=  '<li class="aurora-table-action ' + action.name + ' '+ disabledClass +' " aurora-action="'+ action.name +'"><span>' + action.label + '</span></li>';
            }
        }

        display += '        </ul>';
        display += '    </div>';
        display += '</div>';
        return display;
    }
}

AuroraList.defineElement();
