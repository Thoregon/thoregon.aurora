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

export default class MaterialActions extends ThemeBehavior {

    rootElement  = '';
    _pos_wrapper = {};
    _columns     = {};

    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;

        new Ripple( this.container.querySelector('.aurora-listitem-ripple'));
    }

    connectActions( actions ) {
        let trigger = this.container.querySelector('.aurora-actions-trigger');
        trigger?.addEventListener('click', (event) => this.callbackClickActionMenuTrigger(event, trigger ), false);

        for (let i = 0; i < actions['all'].length; i++) {
            let action = actions['all'][i];
            if ( action.isAvailable() &&
                !action.isDisabled() ) {
                const element = this.container.querySelector('[aurora-action-name="'+ action.name +'"]');
                element?.addEventListener('click', (event) => {
                    action.apply(event);
                    event.stopPropagation();
                }, false );
            }
        }

    }

    callbackClickActionMenuTrigger( event ) {
        event.stopPropagation();
        let menu = this.container.querySelector('.aurora-actions-menu');
        menu.classList.toggle('active');
        menu.classList.add('open-down-right');

    }
}
