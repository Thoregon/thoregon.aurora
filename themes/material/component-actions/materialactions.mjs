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

        const menu      = this.container.querySelector('.aurora-actions-menu');
        const uirouter  = universe.uirouter;
        const blueprint = uirouter.appelement.getBlueprint();

        const elementInformation = blueprint.analyzeElementPlacement(menu);
        const openDirection      = elementInformation.clipping.bottom ? 'open-up' : 'open-down';

        menu.classList.remove('open-up', 'open-down');

        menu.classList.toggle('active');
        menu.classList.add( openDirection );

        if (menu.classList.contains('active')) {
            //-- add event listener
        } else {
            //-- remove listener
        }

        const clicking  = (event) => this.callbackClicked( event, menu );
        document.addEventListener('click', clicking, false);

    }

    callbackClicked(event, menu) {
        menu.classList.remove('active');
    }

    setAvatar(avatarUrl) {

        const defaultAvatar = '/thoregon.aurora/themes/material/component-actions/default-avatar.svg';
        const url = (avatarUrl) ? avatarUrl : defaultAvatar

        this._avatar = this.container.querySelector('#avatar');

        this._avatar.setAttribute('src', url);
    }
}
