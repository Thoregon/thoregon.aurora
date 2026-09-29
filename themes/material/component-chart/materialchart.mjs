/**
 *
 *
 * @author: Bernhard Lukassen, Martin Neitz
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import loadECharts from "../../../lib/component-chart/echartsloader.mjs";

export default class MaterialChart {

    attach(jar) {
        this.jar       = jar;
        this.container = this.jar.container;
    }

    async renderChart(data, props) {
        const echarts = await loadECharts();
        const dom     = this.container.querySelector('.aurora-chart');
        if (!dom) return;

        if (!this.chart) {
            // size is set inline: template css may come from the bundled templates and be outdated
            dom.style.width  = '100%';
            dom.style.height = props.height || '400px';

            this.chart = echarts.init(dom);
            // ECharts does not follow container size changes by itself
            this.resizeObserver = new ResizeObserver(() => this.chart?.resize());
            this.resizeObserver.observe(dom);
        }
        this.chart.setOption(this.buildOption(data, props), { notMerge: true });
    }

    /**
     * translates the neutral { labels, series } structure into an ECharts option
     */
    buildOption(data, props) {
        const labels = data.labels ?? [];
        const series = [].concat(data.series ?? []);
        const common = {
            title : props.title ? { text: props.title } : undefined,
            legend: props.legend ? { bottom: 0 } : undefined,
        };

        // pie uses name/value pairs instead of a category axis, only the first series is shown
        if (props.type === 'pie') {
            const serie = series[0] ?? { data: [] };
            return {
                ...common,
                tooltip: { trigger: 'item' },
                series : [{
                    type: 'pie',
                    name: serie.name,
                    data: labels.map((name, i) => ({ name, value: serie.data[i] })),
                }],
            };
        }

        return {
            ...common,
            tooltip: { trigger: 'axis' },
            xAxis  : { type: 'category', data: labels },
            yAxis  : { type: 'value' },
            series : series.map(serie => ({
                type  : props.type,
                smooth: props.smooth,
                stack : props.stacked ? 'total' : undefined,
                ...serie,
            })),
        };
    }

    dispose() {
        this.resizeObserver?.disconnect();
        this.chart?.dispose();
        delete this.resizeObserver;
        delete this.chart;
    }
}