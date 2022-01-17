/*
 * Copyright (c) 2021.
 */

/**
 *
 *
 * @author: Bernhard Lukassen
 */

import ThemeBehavior            from "../../themebehavior.mjs";
import { validationLevel }      from "../../../lib/common.mjs";

export default class MaterialBlueprint extends ThemeBehavior {

    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;

        window.addEventListener('resize',   ( event ) => this.callbackResize( event, this.container ), false);
    }

    callbackResize( e, container ) {
        this.container.getAuroraBlueprint().resizeBlueprint();
    }
}
