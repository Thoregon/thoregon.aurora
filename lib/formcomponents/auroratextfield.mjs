/**
 *
 *
 * @author: Bernhard Lukassen
 */

import AuroraFormElement        from "./auroraformelement.mjs";

export default class AuroraTextField extends AuroraFormElement {

    applyContent(container) {
        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', this.getAttribute('placeholder') || 'enter input');
        container.appendChild(input);
        this.input = input;
        // container.innerHTML = '<input type="text" placeholder="enter input"/>';
    }

    use(obj, attr) {
        this.input.setAttribute('value', obj[attr]);
    }
}

AuroraTextField.defineElement('aurora-inputtext');
