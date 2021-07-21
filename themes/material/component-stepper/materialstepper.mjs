/*
 * Copyright (c) 2021.
 */

/**
 *
 *
 * @author: Martin Neitz
 *
 * https://codepen.io/RobertAron/pen/gOLLXLo?editors=0010
 */

import ThemeBehavior            from "../../themebehavior.mjs";

import Ripple                   from '../ripple.mjs';

export default class Materialstepper extends ThemeBehavior {

    rootElement = '';

    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;

        new Ripple( this.container.querySelector('.aurora-button-ripple'));
    }

}
