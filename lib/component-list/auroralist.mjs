/**
 *
 * @author: Martin Neitz, Bernhard Lukassen
 */

import AuroraFormElement  from "../formcomponents/auroraformelement.mjs";
import { asyncWithPath }  from "/evolux.util/lib/pathutils.mjs";
import ListItemViewModel  from "../viewmodel/listitemviewmodel.mjs";
import VisibilityObserver from "/thoregon.aurora/lib/visibilityobserver.mjs";

// TODO: remove - import dragula            from '../../ext/dragula/dragula.mjs';

import { AuroraActionBuilderIconContainer, AuroraActionBuilderMenu } from "../component-actions/auroaactionsbuilder.mjs";

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

    get $isListContext() {
        return true;
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

    query(query) {
        let handler;
        let propertiesValues = this.propertiesValues();

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

    }

    async existsConnect() {
        await super.existsConnect();

        let route = this.propertiesValues()['route'];
        // todo [REFACTOR]: change to a registry with callbacks in UI router
        if (route) universe.uirouter.source4route(route, this);

        /*
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
        */
        this.behavior.attach(this);
    }

    disposeView() {
        super.disposeView();
        let route = this.propertiesValues()['route'];
        if (route) universe.uirouter.removeSource(route, this);
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

export class AuroraListHandlerTable extends AuroraListHandler {
    constructor( container, vm, query , properties ) {
        super( container, vm, query , properties );

        this.visibilityObserver = new VisibilityObserver();
        this.visibilityObserver.observe( this.container );
        this.visibilityObserver.addEventListener('changeDetected', (e) => this.handleVisibilityResize( e ) );

        let functionNameColumnDefinition = properties[':columns'];
        let functionNameRenderRow        = properties[':renderrow'];

        this.functionRenderRow     = vm[functionNameRenderRow];
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

        // todo [REFACTOR]: get rid of this ugly workaround  $@VIEWBUILD
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
//        debugger;
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
