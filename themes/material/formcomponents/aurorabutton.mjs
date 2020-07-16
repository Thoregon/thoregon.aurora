/**
 *
 *
 * @author: Bernhard Lukassen
 */

import ThemeBehavior            from "../../themebehavior.mjs";

import MDC                      from '/@material/ripple';

export default class AuroraButton extends ThemeBehavior {

    rootElement = '';

    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;

        MDC.MDCRipple.attachTo(this.container.querySelector('.mdc-button__ripple'));
    }

}
