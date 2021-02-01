/**
 *
 *
 * @author: Bernhard Lukassen
 */

import AuroraFormElement        from "./auroraformelement.mjs";

export default class AuroraPinCode extends AuroraFormElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-pincode';
    }

    /*
     * aurora element features
     */

    get isTrigger() {
        return true;
    }


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

    get templateElements() {
       return {
           theme: 'material',
           component: 'form-pincode',
           templates: ['pincode'],
       }
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            inputs: {
                default:        '',
                type:           'number',
                description:    'Number of entry fields for the code (OTP)',
                group:          'Content',
                example:        '3'
            }
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
        let classes = [];
        let propertiesValues = this.propertiesValues();

        return classes;
    }



    async calculatedValues() {
        debugger;
        return {
            'pins': [1, 2, 3, 4, 5,]
        };
    }

    async adjustContent(container) {
        container.classList.add("aurora-pincode-wrapper");
    }

    get appliedTemplateName() {
        return 'pincode';
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

AuroraPinCode.defineElement();
