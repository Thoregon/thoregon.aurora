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

export default class MaterialTable extends ThemeBehavior {

    rootElement = '';

    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;


        let listitem = this.container.getElementsByClassName("aurora-listitem")[0];
        listitem.addEventListener('focusin', (event) => this.callbackFocusInListItem(event, listitem), false);
        listitem.addEventListener('focusout', (event) => this.callbackFocusOutListItem(event, listitem), false);


        new Ripple( this.container.querySelector('.aurora-listitem-ripple'));
    }

    callbackFocusInListItem( event, listitem ) {
       listitem.classList.add('focused');
    }
    callbackFocusOutListItem( event, listitem ) {
        listitem.classList.remove('focused');
    }
}
