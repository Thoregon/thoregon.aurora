/**
 * a base behavior element for themes
 *
 * @author: Bernhard Lukassen
 */

import { className }                from '/evolux.util';
import { ErrNotImplemented }        from "../lib/errors.mjs";

export default class ThemeBehavior {

    // the 'jar' is the surrounding element in which the specific theme element is represented
    attach(jar) {
        throw ErrNotImplemented(`${className(this)}.attach()`);
    }

}
