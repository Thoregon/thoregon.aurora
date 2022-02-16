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

export default class MaterialQRCode extends ThemeBehavior {

    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;

    }

}
