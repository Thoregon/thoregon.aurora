/*
 * Copyright (c) 2021.
 */

/**
 *
 * @author: Martin Neitz
 */

import AuroraFormElement from "../formcomponents/auroraformelement.mjs";
import { asyncWithPath } from "/evolux.util/lib/pathutils.mjs";

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

        let functionColumns       = propertiesValues[':columns'];
        let functionQuery         = propertiesValues[':query'];
        let functionRenderRow     = propertiesValues[':renderrow'];
        let functionRenderElement = propertiesValues[':renderelement'];

        let vm      = this.viewModel || this.parentViewModel();

        if (!vm[functionQuery]) return;
        let query          = vm[functionQuery]();
        let rowfunction    = vm[functionRenderRow];
        let elemenfunction = vm[functionRenderElement];

        let columns = this.getColumnDefinition(vm, functionColumns, query);

        switch ( propertiesValues['mode'] ) {
            case 'table':
                this.container.innerHTML = this.renderTable( query, columns );

                this.setResponsiveTableBreakpoints(columns);
                // data loop ---
                let tablebody = this.container.querySelector('tbody.aurora-table-body');
                await this.renderTableData( query, rowfunction, columns, tablebody );

                break;
            case 'grid':
                this.container.innerHTML = this.renderGrid( query, columns );
                // data loop ---

                let grid = this.container.querySelector('.aurora-list-grid');
                await this.renderGridElements( query, elemenfunction, columns, grid );
                break;
        }

        this.behavior.attach(this);
        this._columns = columns;

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

    renderGrid(  query, columns  ) {
        let classes = this.collectClasses();

        return '<div class="aurora-list-grid '+ classes +'"></div>';

    }

    async renderGridElements( query, elemenfunction, columns, grid ) {
        let route = this.propertiesValues()['route'];

        for await (const key of query.itemKeys) {
            let object = await query.get(key);
            let elementHTML = '';
            if (elemenfunction) {
                elementHTML = elemenfunction(this, query, object, columns);
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

    renderTable(query, columns) {

        let display = '';

        display += this.renderTableHeader(columns, query);
        display += this.renderTableBody( query, columns);
        display += this.renderTableFooter(columns, query);

        return display;
    }

    renderTableHeader(columns, query) {
        let display = '';

        let propertiesValues = this.propertiesValues();

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

    renderTableBody(query, columns) {
        return'<tbody class="aurora-table-body"></tbody>';
    }

    async renderTableData( query, rowfunction, columns, tablebody ) {
        let route = this.propertiesValues()['route'];

        for await (let key of query.itemKeys) {
            let object = await query.get(key);
            let rowHTML = '';
            if (rowfunction) {
                rowHTML = rowfunction(this, query, object, columns);
            } else {
                rowHTML = await this.renderTableRow(object, columns, query);
            }

            let tr = document.createElement("tr");

            tr.addEventListener('click', ()=>this.callbackItemClicked(query, key, object, tr, route) );
            tr.innerHTML = rowHTML;
            tablebody.append(tr);
        }
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

    async renderTableRow(object, columns, query) {
        let display = '';

        for (let c = 0; c < columns.length; c++) {
            let column = columns[c];

            let responsive = (column.responsivebreakpoint != '')
                ? 'responsive_' + column.responsivebreakpoint
                : '';

            display += '<td class="' + column.align + ' ' + responsive + '">';
            if (column.type === 'actions') {
                display += this.renderActions(object, column);
            } else {
                if (column.route != '') {
                    display += '<a href="">' + await this.getColumnValue(object, column ) + '</a>';
                } else {
                    display += await this.getColumnValue(object, column );
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

    renderTableFooter(columns, query) {
        let display = '';

        //--- table footer -----------
        display += '<tfoot>';
        display += '</tfoot>';

        display += '</table>';

        return display;
    }

    renderActions(object, actionDefinition) {
        let display = '';
        let actions = actionDefinition.actions;

        display += '<div class="aurora-table-actions">';
        display += '    <div class="aurora-table-actions-trigger"><span class="material-icons">more_horiz</span></div>';
        display += '    <div class="aurora-table-actions-menu hidden">';
        display += '        <ul>';

        for (let i = 0; i < actions.length; i++) {
            let action = actions[i];
            display += this.renderAction(object, action);
        }

        display += '        </ul>';
        display += '    </div>';
        display += '</div>';
        return display;
    }

    renderAction(object, action, query) {
        // todo: check if action is allowed for object
        return '<li class="aurora-table-action ' + action.action + '"><span>' + action.label + '</span></li>';
    }

    triggerRoute() {
        return true;
    }
}

AuroraList.defineElement();
