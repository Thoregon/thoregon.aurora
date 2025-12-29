
/**
 * @author: Martin Neitz
 */

import AuroraFormElement        from "./auroraformelement.mjs";
import AuroraAttributeSupport   from "../auroraattributes/auroraattributesupport.mjs";

export default class AuroraToolbar extends AuroraAttributeSupport(AuroraFormElement) {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-toolbar';
    }

    /*
     * aurora element features
     */

    /*
     * Exposed Events
     */

    /*
        exposedEvents() {
            return Object.assign(super.exposedEvents(), {
                click: {
                    select  : 'button'
                }
            });
        }
    */

    // theme ... component... templates

    get componentConfiguration() {
        return {
            theme: 'material',
            component: 'toolbar',
            templates: ['toolbar'],
        }
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {

        });
    }

    propertiesAsBooleanRequested() {
        return {};
    }

    getDefaultWidth() { return false; }

    /**
     *  routine to add all needed classes.
     *  This only can be done on the element level as it will be differ from element to element
     */
    collectClasses() {
        //--- 1: first get the classes added from the dom element
        //--- 2: analyse the transferred attributes
        let classes = super.collectClasses();
        let propertiesValues = this.propertiesValues();

        return classes;
    }

    async adjustContent(container) {
        container.classList.add("aurora-toolbar-wrapper");
    }

    get appliedTemplateName() {
        return 'toolbar';
    }

    use(obj, attr) {
        this.input.setAttribute('value', obj[attr]);
    }

    connectedCallback() {
        super.connectedCallback();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('click', this._clickhandler);
    }
}

AuroraToolbar.defineElement();
