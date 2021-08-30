/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import AuroraBlueprintElement from "./aurorablueprintelement.mjs";

export default class AuroraContainer extends AuroraBlueprintElement {

    constructor() {
        super();
        if (this.app) this.app.registerBlueprintContainer(this);
    }

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-container';
    }

    /*
     * Structure
    */

    async connect() {
        this.getAuroraBlueprint().uicontainer = this;
    }

    /**
     * template definition
     * @return {{component: string, templates: [string], theme: string}}
     */
    get componentConfiguration() {
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
        let target = this.target;
        target.innerHTML = content;
        return target;
    }
/*
    viewContentElement(element) {
        let target = this.target;
        target.innerHTML = '';
        target.appendChild(element);
        return target;
    }

    getDefaultWidth() { return '100%'; }

    get containerContent() {
        let target = this.container; // this.target;
        return target ? target.innerHTML : '';
    }

    set containerContent(content) {
        let target = this.container; // this.target;
        if (target) target.innerHTML = content;
    }

    get target() {
        // if (this._target) return this._target;
        this._target = this.container.querySelector('*[aurora-slot="main"]') || this.container;
        return this._target;
    }
/*
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

