/**
 *
 *
 * @author: Bernhard Lukassen
 */

import doT                      from "/dot";
import AuroraFormElement        from "./auroraformelement.mjs";

export default class AuroraTextField extends AuroraFormElement {


    templateElement() { return 'fieldtext'; }

    applyContent(container) {
        var tempFn = doT.template( this.getTemplate() );
        console.log( tempFn );
        var element = tempFn( this.propertiesValues() );

        container.innerHTML = element;
    }

    use(obj, attr) {
        this.input.setAttribute('value', obj[attr]);
    }
}

AuroraTextField.defineElement('aurora-inputtext');
