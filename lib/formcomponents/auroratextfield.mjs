/**
 *
 *
 * @author: Bernhard Lukassen
 */

import doT                      from "/dot";
import AuroraFormElement        from "./auroraformelement.mjs";

export default class AuroraTextField extends AuroraFormElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-inputtext';
    }

    // theme ... component... templates

    get templateElements() {
       return {
           theme            : 'material',
           component        : 'formcomponents',
           templates        : ['fieldtext'],
       }
    }

    propertiesAsBooleanRequested() {
        return {
            leading_icon    : 'usesleadingicon',
            trailing_icon   : 'usestrailingicon',
            label           : 'haslabel',
            requered        : 'isrequered',
            readonly        : 'isreadonly',
            modifications   : 'change',
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

        let inputs = container.getElementsByTagName('input');
        // use first one; todo [OPEN]: are multiple input fields in the template useful?
        if (inputs.length > 0) this.input = inputs[0];

        this.attachBehavior();
    }

    /*
     * Inner Properties
     */

    get value() {
        return this.input.value;
    }

    set value(value) {
        this.input.value = value;
    }

    /*
     * Inner Attributes
     */

/*
    forwardedAttributes() {
        return Object.assign(super.exposedEvents(), {
            value: { select: 'input' }
        });
    }
*/

    /*
     * Exposed Events
     */

    exposedEvents() {
        return Object.assign(super.exposedEvents(), {
            value: {
                inner   : 'change',                // todo [OPEN]: handle changes of modification accuracy (change | key | none) -> use/implement 'this.updateExposedEvent()'
                select  : 'input'
            }
        });
    }

    /*
     * Lifecyle
     */

    connectedCallback() {
        super.connectedCallback();
        this._clickhandler = (evt) => {
            console.log('textinput -> click');

        };
        this.addEventListener('click', this._clickhandler);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('click', this._clickhandler);
    }

    /*
     * aurora element features
     */

    get isInput() {
        return true;
    }
}

AuroraTextField.defineElement();
