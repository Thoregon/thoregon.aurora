/*
 * Copyright (c) 2021.
 */

/**
 *
 *
 * @author: Martin Neitz
 */

import ThemeBehavior            from "../../themebehavior.mjs";
import { validationLevel }      from "../../../lib/common.mjs";

export default class MaterialSection extends ThemeBehavior {

    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;
    }

}
