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

    attachSlim() {
        let elem = this.container.querySelector('.slim');
        this.slim = new Slim(elem, {
            ratio: '1:1',
            /*
                        minSize: {
                            width: 480,
                            height: 480,
                        },
            */
            crop: {
                x: 0,
                y: 0,
                width: 100,
                height: 100
            },
            service: async () => await this.jar.save(),
            fetcher: async () => await this.jar.fetch(),
            download: false,
            willSave: function(data, ready) {
                alert('saving!');
                ready(data);
            },
            label: 'Drop your image here.',
            buttonConfirmLabel: 'Ok',
            meta: {
                userId:'1234'
            }
        });
    }
}
