/**
 *
 *
 * @author: Bernhard Lukassen
 */

import ThemeBehavior            from "../../themebehavior.mjs";

import Ripple                   from '../ripple.mjs';

export default class MaterialButton extends ThemeBehavior {

    rootElement = '';

    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;

        new Ripple( this.container.querySelector('.aurora-button-ripple'));
    }

    focus()  { this.container.querySelector('button').focus() }
    select() { this.container.querySelector('button').select() }

    setAttributeLabel(label) {
        const labelElement = this.container.querySelector('.aurora-button-label');
        labelElement.innerHTML = label;
    }
}
