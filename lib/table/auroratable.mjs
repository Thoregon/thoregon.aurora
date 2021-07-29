/*
 * Copyright (c) 2021.
 */

/**
 *
 * @author: Martin Neitz
 */

import AuroraFormElement        from "../formcomponents/auroraformelement.mjs";

export default class AuroraTable extends AuroraFormElement {

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
            theme: 'material',
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
            ':columns' : {
                default:        'columns',
                type:           'string',
                description:    'define the function of the ViewModel which is responsible to return the used columns',
                group:          'Content',
                example:        'myColumns'
            },
        });
    }

    propertiesAsBooleanRequested() {
        return {};
    }

    getDefaultWidth() { return false; }

    /**
     *  routine to add all needed classes.
     *  This only can be done on the element level as it will be differ from element to element
     */
    collectClasses() {
        let classes = [];
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

        let function_column = propertiesValues[':columns'];

        let vm      = this.viewModel || this.parentViewModel();
        let columns = vm[function_column]();

        this.container.innerHTML = this.renderTable(columns);
    }

    renderTable( columns ) {
        let display = '';
        display  = '<table>';

        //--- Table Header -----------
        display += '<thead>';
        columns.forEach(function (column, index) {
            display += '<th>';
            display += column.label;
            display += '<th>';
        });
        display += '</thead>';

        display += '</table>';
        return display;

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
