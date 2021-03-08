/**
 *
 *
 * @author: Bernhard Lukassen
 */

import ThemeBehavior            from "../../themebehavior.mjs";

import Ripple                   from '../ripple.mjs';

export default class MaterialCollectionItem extends ThemeBehavior {

    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;
    }

}
