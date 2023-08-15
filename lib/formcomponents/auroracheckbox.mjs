/**
 *
 *
 * @author: Bernhard Lukassen
 */

import AuroraFormElement        from "./auroraformelement.mjs";

export default class AuroraCheckbox extends AuroraFormElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-checkbox';
    }

    // theme ... component... templates

    get componentConfiguration() {
        return {
            theme: 'material',
            component: 'form-checkbox',
            templates: ['checkbox'],
        }
    }

    propertiesDefinitions() {
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            label: {
                default:        '',
                type:           'string',
                description:    'A text Label that will describe the Field',
                group:          'Content',
                example:        'I accept the challenge'
            }
        });
    }

    propertiesAsBooleanRequested() {
        return {
            label:        'haslabel',
            disabled:     'isdisabled',
        };
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

        if ( propertiesValues['disabled'] ) { classes.push('disabled'); }
        if ( propertiesValues['fullwidth'] ) { classes.push('fullwidth'); }

        return classes;
    }

    async adjustContent(container) {
        container.classList.add("aurora-checkbox-wrapper");
    }

    get appliedTemplateName() {
        return 'checkbox';
    }

    use(obj, attr) {
        this.input.setAttribute('value', obj[attr]);
    }

    get valueEventName() {
        return 'change';
    }

    get value() {
        return this.behavior.getValue();
    }

    set value(value) {
        if (this.beforeInit()) return this.addInitFn(() => { this.value = value });
        this.behavior.valueChanged( value );
    }

    get input() {
        return this.container.querySelector('input');
    }

}

AuroraCheckbox.defineElement();
