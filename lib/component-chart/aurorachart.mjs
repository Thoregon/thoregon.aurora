/**
 *
 * @author: Martin Neitz, Bernhard Lukassen
 */

import AuroraFormElement from "../formcomponents/auroraformelement.mjs";

export default class AuroraChart extends AuroraFormElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-chart';
    }

    get componentConfiguration() {
        return {
            theme    : 'material',
            component: 'component-chart',
            templates: ['chart'],
        }
    }

    propertiesDefinitions() {
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            'type'       : {
                default    : 'line',
                type       : 'string',
                description: 'chart type, used for all series without an own type',
                group      : 'Behavior',
                example    : 'line | bar | pie'
            },
            ':data'      : {
                default    : 'data',
                type       : 'string',
                description: 'name of the view model function which delivers { labels, series }',
                group      : 'Content',
                example    : 'salesData'
            },
            'title'      : {
                default    : '',
                type       : 'string',
                description: 'chart title',
                group      : 'Content',
                example    : 'Umsatz 2025'
            },
            'legend'     : {
                default    : false,
                type       : 'boolean',
                description: 'show legend',
                group      : 'Layout',
                example    : 'legend'
            },
            'smooth'     : {
                default    : false,
                type       : 'boolean',
                description: 'smooth lines (line charts only)',
                group      : 'Layout',
                example    : 'smooth'
            },
            'stacked'    : {
                default    : false,
                type       : 'boolean',
                description: 'stack series on top of each other (line and bar)',
                group      : 'Layout',
                example    : 'stacked'
            },
            'height'     : {
                default    : '400px',
                type       : 'string',
                description: 'height of the chart (CSS length)',
                group      : 'Layout',
                example    : '300px | 50vh'
            },
        });
    }

    propertiesAsBooleanRequested() {
        return {};
    }

    getDefaultWidth() {
        return false;
    }

    async adjustContent(container) {
        container.classList.add("aurora-chart-wrapper");
    }

    get appliedTemplateName() {
        return 'chart';
    }

    async existsConnect() {
        await super.existsConnect();
        await this.reload();
    }

    /**
     * fetches the data from the view model and (re)renders the chart
     */
    async reload() {
        let props = this.propertiesValues();
        let vm    = this.viewModel || this.parentViewModel();    // todo [$$@AURORACLEANUP]: no viewmodel available
        if (!vm?.[props[':data']]) return;

        let data = await vm[props[':data']]();
        if (!data) return;

        await this.behavior?.renderChart(data, props);
    }

    destroy() {
        this.behavior?.dispose?.();
        super.destroy();
    }
}

AuroraChart.defineElement();