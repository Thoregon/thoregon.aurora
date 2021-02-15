/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import AuroraElement from "../../auroraelement.mjs";

export default class AuroraContainer extends AuroraElement {

    constructor() {
        super();
        let app = this.getAuroraAppElement();
        if (app) app.registerBlueprintContainer(this);
    }

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-container';
    }

    /**
     * template definition
     * @return {{component: string, templates: [string], theme: string}}
     */
    get templateElements() {
        return {
            theme    : 'material',
            component: 'blueprint-container',
            templates: ['container'],
        }
    }

    get appliedTemplateName() {
        return 'container';
    }

    viewContent(content) {
        let container = this.container.querySelector('.aurora-blueprint-container');
        if (container) container.innerHTML = content;
        return container;
    }

    getDefaultWidth() { return '100%'; }

    /*
        propertiesDefinitions() {
            let parentPropertiesValues = super.propertiesDefinitions();
            return Object.assign(parentPropertiesValues, {
                title: {
                    default:        '',
                    type:           'string',
                    description:    'the title of the toolbar',
                    group:          'Content',
                    example:        'MyFirstApp'
                }
            });
        }
    */

}

AuroraContainer.defineElement();

