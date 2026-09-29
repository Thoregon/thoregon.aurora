/**
 * Custom element for the in-house ImageCropper (formerly a wrapper for Slim image cropper)
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import AuroraElement from "../auroraelement.mjs";
import MaterialImageCropper from "../../themes/material/form-image-cropper/materialimagecropper.mjs";

export default class AuroraImageCropper extends AuroraElement {

    behaviorClass() {
        return MaterialImageCropper;
    }

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-image-cropper';
    }

    destroy() {
        this.behavior?.destroy();
    }

    /*
     * aurora element features
     */

    get appliedTemplateName() {
        return 'imagecropper';
    }

    getDefaultWidth() { return false; }

    /*
     * value handling
     */

    /**
     * called by the behavior after the user cropped an image
     * @param {Object} output  { image: dataUrl, name, type, width, height }
     * @return {Promise<UFD>}
     */
    async saveImage(output) {
        const ufd = await mediathek.add(output.image, {        // don't convert, this is the responsibility of the mediathek and the storage adapters
            filename: output.name,
            mimetype: output.type,
        });
        this._ufd = ufd;
        this.dispatchEvent(new Event('change'));
        return ufd;
    }

    /** called by the behavior when the user removed the image */
    removeImage() {
        this._ufd = null;
        this.dispatchEvent(new Event('change'));
    }

    /** called by the behavior on errors (file too large, upload failed, ...) */
    showError(error) {
        const hint = this.container?.querySelector('.aurora-hint');
        if (!hint) return console.error('AuroraImageCropper', error);
        hint.textContent = error.message;
        hint.classList.add('error');
    }

    get ufd() {
        return this._ufd;
    }

    set ufd(ufd) {
        this._ufd = ufd;
        // forward to image cropper; if the behavior is not attached yet, it picks up _ufd in attach()
        if (this.behavior) this.behavior.imageDescriptor = ufd;
    }

    get value() {
        return this._ufd;
    }

    set value(ufd) {
        this.ufd = ufd;
    }

    showFileDialog() {
        return this.behavior.showFileDialog();
    }

    /*
     *
     */
    get componentConfiguration() {
        return {
            theme: 'material',
            component: 'form-image-cropper',
            templates: ['imagecropper'],
        }
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            label: {
                default:        '',
                type:           'string',
                description:    'A text Label that will describe the Field',
                group:          'Content',
                example:        'Please select your profile image'
            },
            hint: {
                default:        '',
                type:           'string',
                description:    'a description for the element',
                group:          'Content',
                example:        'Please use 300x300px'
            },
            ratio: {
                default:        '1:1',
                type:           'string',
                description:    'the ratio of the result image you want to crop',
                group:          'Behavior',
                example:        'input | free | 1:1 | 3:2 | 2:3 | 4:3 | 3:4 | 16:9 '
                                // input - the ratio of the input file
                                // free  - any size the user crop it to
            },
            size: {
                default:        '',
                type:           'string',
                description:    'Determine the target size of the resulting image.',
                group:          'Behavior',
                example:        '900,400'
            },
            layout: {
                default:        'square',
                type:           'string',
                description:    'select the image style',
                group:          'Behavior',
                example:        'round | rounded | square'
            },
            width: {
                default:        '100%',
                type:           'string',
                description:    'How much space should the prompter consume',
                group:          'Behavior',
                example:        '50%'
            },
            align: {
                default:        'center',
                type:           'string',
                description:    'Where should the prompter be positioned',
                group:          'Behavior',
                example:        'left | center | right'
            },
        });
    }

    get input() {
        return this.container.querySelector('input');
    }

    async adjustContent(container) {
        container.classList.add("aurora-imagecropper-wrapper");
    }


    /*
        connectedCallback() {
            super.connectedCallback();
        }

        disconnectedCallback() {
            super.disconnectedCallback();
        }
    */

}

AuroraImageCropper.defineElement();
