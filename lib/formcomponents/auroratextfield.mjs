/**
 *
 *
 * @author: Bernhard Lukassen
 */

import doT                      from "/dot";
import AuroraFormElement        from "./auroraformelement.mjs";

export default class AuroraTextField extends AuroraFormElement {


    templateElement() { return 'field-text'; }

    applyContent(container) {

        console.log( this.propertiesValues() );
        var tempFn = doT.template('<input class="auroratextinput" type="text" placeholder="{{=it.label}}"/>');
        console.log( tempFn );
        var element = tempFn( this.propertiesValues() );

        container.innerHTML = element;
    }

    use(obj, attr) {
        this.input.setAttribute('value', obj[attr]);
    }
}

AuroraTextField.defineElement('aurora-inputtext');
