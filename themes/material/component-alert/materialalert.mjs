/*
 * Copyright (c) 2022.
 */

/**
 *
 *
 * @author: Martin Neitz
 */

import ThemeBehavior            from "../../themebehavior.mjs";

import Ripple                   from '../ripple.mjs';

export default class MaterialAlert extends ThemeBehavior {

    rootElement = '';

    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;

  //      new Ripple( this.container.querySelector('.aurora-listitem-ripple'));
    }

}
