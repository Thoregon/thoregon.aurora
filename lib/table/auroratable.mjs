/*
 * Copyright (c) 2021.
 */

/**
 *
 * @author: Martin Neitz
 */

import AuroraFormElement        from "../formcomponents/auroraformelement.mjs";

export default class AuroraTable extends AuroraFormElement {
// AuroraList
    _columns = {};

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-table';
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
            component: 'component-table',
            templates: ['table'],
        }
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            'type'   : {
                default    : 'table',
                type       : 'string',
                description: 'Type of representation',
                group      : 'Behavior',
                example    : 'table | grid'
            },
            'dense'   : {
                default    : false,
                type       : 'boolean',
                description: 'dense representation',
                group      : 'Content',
                example    : 'true'
            },
            ':columns': {
                default    : 'columns',
                type       : 'string',
                description: 'define the function of the ViewModel which is responsible to return the used columns',
                group      : 'Content',
                example    : 'myColumns'
            },
            ':query'  : {
                default    : 'query',
                type       : 'string',
                description: 'defines the query function responsible for the data rows',
                group      : 'Content',
                example    : 'myQuery'
            },
            ':row'    : {   // :renderrow
                default    : '',
                type       : 'string',
                description: 'defines the render function responsible for one data row',
                group      : 'Content',
                example    : 'myRenderRowFunction'
            },
            // :renderelement
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

        return classes;
    }

    async adjustContent(container) {
        container.classList.add("aurora-table-wrapper");
    }

    get appliedTemplateName() {
        return 'table';
    }

    use(obj, attr) {
        this.input.setAttribute('value', obj[attr]);
    }

    async existsConnect() {
        super.existsConnect();

        let propertiesValues = this.propertiesValues();

        let functionColumns    = propertiesValues[':columns'];
        let functionQuery      = propertiesValues[':query'];
        let functionRenderRow  = propertiesValues[':row'];
        let functionRenderGrid = propertiesValues[':grid'];

        let vm      = this.viewModel || this.parentViewModel();
        let columns = this.getColumnDefinition(vm, functionColumns);

        let query       = vm[functionQuery]();
        let rowfunction = vm[functionRenderRow];

        switch ( propertiesValues['type'] ) {
            case 'table':
                this.container.innerHTML = this.renderTable( query, rowfunction, columns );

                // data loop -----------
                let tablebody = this.container.querySelector('tbody.aurora-table-body');
                this.renderTableData( query, rowfunction, columns, tablebody );

                this.setResponsiveBreakpoints(columns);
                break;
            case 'grid':
                break;
        }

        this.behavior.attach(this);
        this._columns = columns;

    }

    setResponsiveBreakpoints(columns) {
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

    getColumnDefinition(vm, function_columns) {
        let defaults = {
            type                : 'value',
            name                : '',
            label               : '',
            align               : 'left',
            sortable            : false,
            route               : '',
            responsivebreakpoint: '',
        }

        let column_definition = vm[function_columns]();
        let columns           = [];

        for (let c = 0; c < column_definition.length; c++) {
            let column              = column_definition[c];
            let newColumnDefinition = {...defaults};
            Object.assign(newColumnDefinition, column);
            columns.push(newColumnDefinition);
        }

        return columns;
    }

    renderTable(query, rowfunction, columns) {

        let display = '';

        display += this.renderTableHeader(columns, query);
        display += this.renderTableBody( query, columns);
        display += this.renderTableFooter(columns, query);

        return display;
    }

    renderTableHeader(columns, query) {
        let display = '';

        let propertiesValues = this.propertiesValues();
        let fullwidth        = propertiesValues['fullwidth'];
        let dense            = propertiesValues['dense'];

        let fullwidthclass = (fullwidth)
            ? 'fullwidth'
            : '';

        let denseclass = (dense)
            ? 'dense'
            : '';

        display = '<div id="responsivebreakpoints"></div>';
        display += '<table class="' + fullwidthclass + ' ' + denseclass + '">';

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

            display += '<th class="' + column.align + ' ' + sortable + ' ' + responsive + '" data-column="' + column.name + '">';

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

    renderTableData( query, rowfunction, columns, tablebody ) {
        let route = this.propertiesValues()['route'];

        for (let i = 0; i < query.length; i++) {
            let rowHTML = '';
            let object = query[i];
            if (rowfunction) {
                rowHTML = rowfunction(this, query, object, columns);
            } else {
                rowHTML = this.renderTableRow(object, columns, query);
            }

            let tr = document.createElement("tr");
            tr.addEventListener('click', ()=>this.callbackItemClicked(object, tr, route) );
            tr.innerHTML = rowHTML;
            tablebody.append(tr);
        }
    }

    callbackItemClicked(object, tr, route ) {

        let router = universe.uirouter;
        let ids    = router.getRouteFor(route).ids

        let parameter = {};

        for (let i = 0; i < ids.length; i++) {
            parameter[ids[i]] = object[ids[i]];
        }

        let buildRoute =  router.buildRoute(route, parameter);
        router.routePath(buildRoute);
    }

    renderTableRow(object, columns, query) {
        let display = '';
//        display += '<tr>';
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
                    display += '<a href="">' + object[column.name] + '</a>';
                } else {
                    display += object[column.name];
                }
            }
            display += '</td>';
        }
//        display += '</tr>';

        return display;
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

AuroraTable.defineElement();
