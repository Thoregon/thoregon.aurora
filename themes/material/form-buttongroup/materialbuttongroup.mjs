/**
 *
 *
 * @author: Martin Neitz
 */

import ThemeBehavior            from "../../themebehavior.mjs";

import Ripple                   from '../ripple.mjs';

export default class MaterialbuttonGroup extends ThemeBehavior {

    rootElement = '';

    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;

        new Ripple( this.container.querySelector('.aurora-buttongroup-ripple'));
    }


    getValue () {
        debugger;
    }

    valueChanged( value ) {
        debugger;
    }

}
