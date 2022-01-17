/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import ThemeBehavior from "../../themebehavior.mjs";
import { Chart, registerables }     from "../../../ext/chart.esm.js";

export default class MaterialChart {

    attach(jar) {
        this.jar       = jar;
        this.container = this.jar.container;
    }

    renderCart( data ) {
        Chart.register(...registerables);
        let ctx = this.container.querySelector('#aurora-chart').getContext('2d');
        let myChart = new Chart(ctx, {
            type: 'pie',
            data: data,
        });
    }

}
