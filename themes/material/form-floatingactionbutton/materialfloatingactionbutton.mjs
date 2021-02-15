/**
 *
 *
 * @author: Bernhard Lukassen
 */

import ThemeBehavior            from "../../themebehavior.mjs";

import Ripple                   from '../ripple.mjs';

export default class MaterialFloatingActionButton extends ThemeBehavior {

    rootElement = '';

    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;

        let button = this.container.getElementsByClassName("aurora-floatingactionbutton")[0];
        button.addEventListener('click', (event) => this.callbackClickButtone(event, button), false);

        new Ripple( this.container.querySelector('.aurora-button-ripple'));
    }

    callbackClickButtone( event, button ) {
        button.classList.toggle('open');
    }
}
