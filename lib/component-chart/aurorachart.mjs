/**
 *
 * @author: Martin Neitz, Bernhard Lukassen
 */

import AuroraFormElement from "../formcomponents/auroraformelement.mjs";
import { asyncWithPath } from "/evolux.util/lib/pathutils.mjs";
import ListItemViewModel from "../viewmodel/listitemviewmodel.mjs";
import { AuroraActionBuilderIconContainer, AuroraActionBuilderMenu } from "../component-actions/auroaactionsbuilder.mjs";

export default class AuroraChart extends AuroraFormElement {
// AuroraList
    _columns = {};

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-chart';
    }

    /*
     * aurora element features
     */

    // theme ... component... templates

    get componentConfiguration() {

        return {
            theme    : 'material',
            component: 'component-chart',
            templates: ['chart'],
        }
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            'type'          : {
                default    : 'pie',
                type       : 'string',
                description: 'Type of chart',
                group      : 'Behavior',
                example    : 'line | pie | bar'
            },

            ':data'      : {
                default    : 'data',
                type       : 'object',
                description: 'the function which will deliver the data',
                group      : 'Content',
                example    : 'myData'
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

        if (propertiesValues['fullwidth']) {
            classes.push('fullwidth');
        }

        return classes;
    }

    async adjustContent(container) {
        container.classList.add("aurora-chart-wrapper");
    }

    get appliedTemplateName() {
        return 'chart';
    }


    async existsConnect() {
        await super.existsConnect();

        let propertiesValues = this.propertiesValues();
        let functionData     = propertiesValues[':data'];
        let vm               = this.viewModel || this.parentViewModel();    // todo [$$@AURORACLEANUP]: no viewmodel available

        if (!vm[functionData]) return;

        let data = await vm[functionData]();
        this.behavior?.renderCart( data );
    }

}

AuroraChart.defineElement();
