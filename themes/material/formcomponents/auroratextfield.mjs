/**
 *
 *
 * @author: Bernhard Lukassen
 */

import ThemeBehavior            from "../../themebehavior.mjs";

export default class AuroraTextField extends ThemeBehavior {

    attach(jar) {
        this.jar = jar;
        console.log("AuroraFextField.attach()");
    }
}
