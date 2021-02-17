/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import ThemeBehavior from "../../themebehavior.mjs";
import Slim          from "../../../lib/slimimagecropper/slimimagecropper.mjs";

export default class MaterialImageCropper {

    attach(jar) {
        this.jar       = jar;
        this.container = this.jar.container;
        this.attachSlim();
    }

    destroy() {
        if (this.slim) this.slim.destroy();
    }

    attachSlim() {
        let elem = this.container.querySelector('.slim');
        let ratio = elem.getAttribute('data-ratio') || "1:1";
        let label = elem.getAttribute('data-label');

        let size =  elem.getAttribute('data-size') || "100,100";
        let dimension = size.split(',');

        this.slim = new Slim(elem, {
            ratio: ratio,
            /*
                        minSize: {
                            width: 480,
                            height: 480,
                        },
            */
            crop: {
                x: 0,
                y: 0,
                width:  dimension[0] || 100,
                height: dimension[1] || 100
            },
            service: async () => await this.jar.save(),
            fetcher: async () => await this.jar.fetch(),
            download: false,
     //       push: true,
            willSave: function(data, ready) {
                ready(data);
            },
            label: label,
            buttonConfirmLabel: 'Ok',
            meta: {
                userId:'1234'
            }
        });
    }
}
