/**
 * Material behavior for the top thregon app
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import ThemeBehavior from "../../themebehavior.mjs";

export default class MaterialThoregonApp extends ThemeBehavior {

    attach(jar) {
        this.jar       = jar;
        this.container = this.jar.container;
    }
}
