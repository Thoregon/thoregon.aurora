/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import ThemeBehavior from "../../themebehavior.mjs";

export default class MaterialLink extends ThemeBehavior {

    attach(jar) {
        this.jar       = jar;
        this.container = this.jar.container;
        this.container.addEventListener('click', (event) => this.trigger(event));
    }

    async trigger(event) {
        if (await this.jar.trigger(event)) event.stopPropagation();
    }

}
