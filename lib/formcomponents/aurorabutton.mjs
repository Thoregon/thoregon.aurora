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

    propertiesAsBooleanRequested() {
        return {
            leading_icon: 'usesleadingicon',
            trailing_icon: 'usestrailingicon',
            label:  'haslabel',
            requered: 'isrequered',
            readonly: 'isreadonly'
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
        if ( propertiesValues['usestrailingicon'] ) { classes.push('with-trailing-icon'); }
        if ( propertiesValues['disabled'] ) { classes.push('disabled'); }
        if ( propertiesValues['readonly'] ) { classes.push('readonly'); }

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
