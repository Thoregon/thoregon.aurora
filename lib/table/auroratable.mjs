/*
 * Copyright (c) 2021.
 */

/**
 *
 * @author: Martin Neitz
 */

import AuroraFormElement        from "../formcomponents/auroraformelement.mjs";

export default class AuroraTable extends AuroraFormElement {

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
            ':row'    : {
                default    : '',
                type       : 'string',
                description: 'defines the render function responsible for one data row',
                group      : 'Content',
                example    : 'myRenderRowFunction'
            },
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

        let functionColumns   = propertiesValues[':columns'];
        let functionQuery     = propertiesValues[':query'];
        let functionRenderRow = propertiesValues[':row'];

        let vm      = this.viewModel || this.parentViewModel();
        let columns = this.getColumnDefinition(vm, functionColumns);

        let query       = vm[functionQuery]();
        let rowfunction = vm[functionRenderRow];

        this.container.innerHTML = this.renderTable( query, rowfunction, columns );
        this.setResponsiveBreakpoints(columns);

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
            action              : '',
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
        display += this.renderTableBody( query, rowfunction, columns);
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

    renderTableBody(query, rowfunction, columns) {
        let display = '';

        display += '<tbody>';

        for (let i = 0; i < query.length; i++) {
            let object = query[i];
            if ( rowfunction ) {
                display += '<tr>' + rowfunction( this, query, object, columns ) + '</tr>';
            } else {
                display += this.renderTableRow(object, columns, query);
            }
        }

        display += '</tbody>';

        return display;
    }

    renderTableRow(object, columns, query) {
        let display = '';
        display += '<tr>';
        for (let c = 0; c < columns.length; c++) {
            let column = columns[c];

            let responsive = (column.responsivebreakpoint != '')
                ? 'responsive_' + column.responsivebreakpoint
                : '';

            display += '<td class="' + column.align + ' ' + responsive + '">';
            if (column.type === 'actions') {
                display += this.renderActions(object, column);
            } else {
                if (column.action != '') {
                    display += '<a href="">' + object[column.name] + '</a>';
                } else {
                    display += object[column.name];
                }
            }
            display += '</td>';
        }
        display += '</tr>';

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

    connectedCallback() {
        super.connectedCallback();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('click', this._clickhandler);
    }
}

AuroraTable.defineElement();
