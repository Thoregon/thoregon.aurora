/**
 *
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
    get templateElements() {
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
                example:        'FirstName'
            },
        });
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
