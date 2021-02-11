/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */
import AuroraElement from "../auroraelement.mjs";

export default class AuroraLink extends AuroraElement {

    constructor() {
        super();
    }


    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-link';
    }

    /**
     * template definition
     * @return {{component: string, templates: [string], theme: string}}
     */
    get templateElements() {
        return {
            theme    : 'material',
            component: 'blueprint',
            templates: ['link'],
        }
    }

    get appliedTemplateName() {
        return 'link';
    }

    getDefaultWidth() { return '100%'; }


    propertiesDefinitions() {
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            to: {
                default:        '',
                type:           'string',
                description:    'reference to the target',
                group:          'Content',
                example:        'MyFirstApp'
            }
        });
    }

}

AuroraLink.defineElement();
