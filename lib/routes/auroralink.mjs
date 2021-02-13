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
        this.inCollection = false;
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
            templates: ['link', 'collectionlink'],
        }
    }

    get appliedTemplateName() {
        return this.inCollection ? 'collectionlink' : 'link';
    }

    getDefaultWidth() { return '100%'; }

    get isItemDecorator() {
        return true;
    }

    clone() {
        let elem = super.clone();
        elem.inCollection = this.inCollection;
        return elem;
    }

    /*
     * link behavior
     */


    get isTrigger() {
        return true;
    }

    async trigger(event) {
        // has action? await exec, if no error (throw) follow link
        console.log("aurora-link");
        return false;
    }

    /*
     * element properties
     */

    propertiesDefinitions() {
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            to: {
                default:        '',
                type:           'string',
                description:    'reference to the target, a path or aurora-name',
                group:          'Reference',
                example:        ''
            },
            ref: {
                default:        '',
                type:           'string',
                description:    'reference to view, may be defined by the entity',
                group:          'Content',
                example:        'Reference'
            },
        });
    }

}

AuroraLink.defineElement();
