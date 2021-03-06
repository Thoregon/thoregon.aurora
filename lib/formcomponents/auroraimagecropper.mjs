/**
 * Custom element wrapper for Slim image cropper -> Copyright (c) 2020 Rik Schennink - https://pqina.nl/slim
 *
 * Alternative: https://www.webcomponents.org/element/michael-silva/yo-image
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import AuroraElement from "../auroraelement.mjs";

export default class AuroraImageCropper extends AuroraElement {

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

    get isTrigger() {
        return true;
    }

    get appliedTemplateName() {
        return 'imagecropper';
    }

    getDefaultWidth() { return false; }

    async save() {
        debugger;
    }

    async fetch() {
        debugger;
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
            ratio: {
                default:        '1:1',
                type:           'string',
                description:    'the ratio of the result image you want to crop',
                group:          'Behavior',
                example:        '1:1 | 3:2 | 2:3 | 4:3 | 3:4 | 16:9 '
            },
            size: {
                default:        '100,100',
                type:           'string',
                description:    'Determine the target size of the resulting image.',
                group:          'Behavior',
                example:        '900,400'
            },
            style: {
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

    isInput() { return true; }

    get value() {
        return this.input.value;
    }

    set value( value ) {
        this.behaviorQ(() => this.behavior.valueChanged( value ) );
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
