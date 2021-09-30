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

export default class MaterialTabList extends ThemeBehavior {

    rootElement  = '';
    _pos_wrapper = {};
    _columns     = {};

    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;

        this._pos_wrapper = this.container.getBoundingClientRect();

  //      this.jar.addEventListener('tabadded', event => alert(event.detail));
        this.jar.addEventListener('tabadded', (event) => this.callbackTabAdded( event, this ), false);

        new Ripple( this.container.querySelector('.aurora-listitem-ripple'));
    }

    callbackTabAdded(event, tablist) {
        event.detail.addEventListener('mousedown', () => this.callbackTabOnMouseDown( event.detail ), false);
    }
    callbackTabOnMouseDown( tab ) {
        let tabindicator   = this.container.querySelector('.aurora-tab-list-indicator');
        let tablistwrapper = this.container.querySelector('.aurora-tab-list');

        let tabstyle       = getComputedStyle(tablistwrapper);
        let margintop      = parseInt(tabstyle.marginTop);

        let left  = tab.offsetLeft;
        let width = tab.offsetWidth;
        let height = tablistwrapper.offsetHeight;

        tabindicator.style.top = height + margintop + 'px';
        tabindicator.style.marginLeft = left + 'px';
        tabindicator.style.width = width + 'px';
    }

}
