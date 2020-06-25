/**
 *
 *
 * @author: Bernhard Lukassen
 */

import doT                      from "/dot";
import AuroraFormElement        from "./auroraformelement.mjs";

export default class AuroraTextField extends AuroraFormElement {

    // theme ... component... templates

    get templateElements() {
       return {
           theme: 'material',
           component: 'formcomponents',
           templates: ['fieldtext'],
       }
    }

    propertiesAsBooleanRequested() {
        return {
            leading_icon: 'usesleadingicon',
            trailing_icon: 'usestrailingicon',
            label:  'haslabel'
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
        let tempFn = doT.template( tplsrc['fieldtext'] );
        let element = tempFn( properties );

        container.innerHTML = element;
        import('../themes/material.mjs');
    }

    use(obj, attr) {
        this.input.setAttribute('value', obj[attr]);
    }
}

AuroraTextField.defineElement('aurora-inputtext');
