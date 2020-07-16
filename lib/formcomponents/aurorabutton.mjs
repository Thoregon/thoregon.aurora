/**
 *
 *
 * @author: Bernhard Lukassen
 */

import doT                      from "/dot";
import AuroraFormElement        from "./auroraformelement.mjs";

export default class AuroraButton extends AuroraFormElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-button';
    }

    // theme ... component... templates

    get templateElements() {
       return {
           theme: 'material',
           component: 'formcomponents',
           templates: ['button'],
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
            leading_icon: {
                default:        '',
                type:           'string',
                description:    'Name of the icon to be used infront of the field',
                group:          'Content',
                example:        'globe'
            }
        });
    }

    propertiesAsBooleanRequested() {
        return {
            leading_icon: 'usesleadingicon',
            label: 'haslabel'
        };
    }

    /**
     *  routine to add all needed classes.
     *  This only can be done on the element level as it will be differ from element to element
    */
    collectClasses() {
        //--- 1: first get the classes added from the dom element
        //--- 2: analyse the transferred attributes
        let classes = [];
        let propertiesValues = this.propertiesValues();

        if ( propertiesValues['usesleadingicon'] )  { classes.push('with-leading-icon'); }
        if ( propertiesValues['disabled'] ) { classes.push('disabled'); }

        return classes;
    }

    applyContent(container) {
        console.log(this.propertiesValues());
        let properties = this.propertiesValues();
        properties['classes'] = this.collectClasses().join(' ');
        let tplsrc = this.templates;
        let tempFn = doT.template( tplsrc['button'] );
        let element = tempFn( properties );

        container.innerHTML = element;

        this.attachBehavior();
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

AuroraButton.defineElement();
