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

    //
    // aurora element features
    //

    //
    // value
    //
    get value() {
        return this.behavior?.code;
    }

    set value(code) {
        if (this.beforeInit()) return this.addInitFn(() => { this.value = value });
        if (this.behavior) this.behavior.code = code;
    }

    codeFilled() {
        this.dispatchEvent(new Event('value'));
    }


    get componentConfiguration() {
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
            digits: {
                default:        3,
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
        let propertiesValues = this.propertiesValues();

        return {
            'pins': new Array( parseInt( propertiesValues.digits ) )
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
