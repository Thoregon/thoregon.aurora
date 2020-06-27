/**
 *
 *
 * @author: Bernhard Lukassen
 */

import ThemeBehavior            from "../../themebehavior.mjs";

export default class AuroraTextField extends ThemeBehavior {

    attach(jar) {
        this.jar = jar;
        this.auroraelement = this.jar.shadowRoot;

        var elements = this.auroraelement.getElementsByClassName("aurora-text-field");
        elements[0].addEventListener('click', () => myfunction, false);
    }

    myfunction () {
        alert ('hab dich...');
    }
}
