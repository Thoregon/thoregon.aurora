/*
 * Copyright (c) 2021.
 */

/**
 *
 *
 * @author: Bernhard Lukassen
 */

import ThemeBehavior            from "../../themebehavior.mjs";

import Ripple                   from '../ripple.mjs';

export default class MaterialTab extends ThemeBehavior {

    rootElement  = '';
    _pos_wrapper = {};
    _columns     = {};

    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;

        this._pos_wrapper = this.container.getBoundingClientRect();


        //---  KEYUP event for the input field  ------------------------------------------------------------------------
 //       this.container.addEventListener('mousedown', () => this.callbackTabOnMouseDown( this ), false);


        new Ripple( this.container.querySelector('.aurora-listitem-ripple'));
    }

/*    callbackTabOnMouseDown( tab ) {
        let tablist = tab.jar.tablist;
        tablist.tabClicked( this );
    }*/

}
