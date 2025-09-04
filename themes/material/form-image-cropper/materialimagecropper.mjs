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
        this.imagecropper = this.container.querySelector('.aurora-image-cropper');

        let elem = this.container.querySelector('.slim');

        let width = elem.getAttribute('data-width') || '100%';
        this.imagecropper.setAttribute('style', 'width:' + width  );

        let align = elem.getAttribute('data-align') || 'center';
        this.container.classList.add(align );

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
            crop: {
                x: 0,
                y: 0,
                width:  dimension[0] || 100,
                height: dimension[1] || 100,
            },
            service: async (...args) => await this.saveImage(...args),
            fetcher: async (...args) => await this.fetchImage(...args),
            download: false,
            push: true,
            willSave: function(data, ready) {
                ready(data);
            },
        //    willRemove: async ( data, ready ) => await this.jar.remove( data, ready ),
            label: label,
            buttonConfirmLabel: 'Ok',

            buttonEdit:   true,   // show the pencil (re-crop) icon
            buttonRemove: true,   // show the trash (remove) icon
            meta: {
                userId:'1234',
                ufd: 'martin'
            }
        });

        this.slim.size = { width: dimension[0], height: dimension[1] };
        this.slim.delegate = this;

/*
        this.observer = new IntersectionObserver((entries, observer) => {
            if (entries.length === 0) return ;
            const entry = entries[0];
            if (!entry.isIntersecting) return ;
            // console.log("cropper visible");
        }, {
            root: this.container,
            rootMargin: '0px',
            threshold: 1.0
        } );

        this.observer.observe(elem);
*/
    }

    testEvents() {
        alert('hab dich...');
    }


    imageLoaded() {
        this.jar.imageLoaded();
    }

    showFileDialog() {
        if (this.slim.data?.input?.name) return;
        return this.slim._openFileDialog();
    }

    get imageDescriptor() {
        return this.slim.dataBase64?.output;
    }

    set imageDescriptor(ufd) {
        this.loadCropper(ufd);
    }

    async loadCropper(ufd) {
        this._loading = true;
        try {
            const value = await ufd.getDataUrl();
            if (!value || !this.slim) {
                this._loading = false;
                return;
            }
            this.slim.load(value, (error, data) => {
                this._loading = false;
                if (error) console.log("Slim Image Cropper: load", error);
            });
        } catch(e) {
            this._loading = false;
        }
    }

    async saveImage(...args) {
        if (this._loading) return;
        return await this.jar.saveImage(...args);
    }

    async fetchImage(...args) {
        if (this._loading) return;
        return await this.jar.fetchImage(...args);
    }

    valueChanged( value ) {
        /*
         this.destroy();

        let slim = this.container.querySelectorAll('.slim.aurora-image-cropper')[0];

        let image = slim.querySelector('img.aurora-image-source') || document.createElement('img');

        image.setAttribute('src', value);
        image.classList.add('aurora-image-source');
        // image.setAttribute('name', "aurora-image-source");

        slim.appendChild(image);
        this.attachSlim();
         */
    }
}
