/**
 *
 *
 * @author: Bernhard Lukassen
 */

import ThemeBehavior            from "../../themebehavior.mjs";

import Ripple                   from '../ripple.mjs';

export default class MaterialFloatingActionButton extends ThemeBehavior {

    rootElement = '';

    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;

        this.checkActions( );

        let button = this.container.getElementsByClassName("aurora-floatingactionbutton")[0];
        button.addEventListener('click', (event) => this.callbackClickButton(event, button), false);

        new Ripple( this.container.querySelector('.aurora-button-ripple'));
    }

    callbackClickButton( event, button ) {
        let limit = 3;
        if ( this.numberOfActions() >= limit ) {
            button.classList.toggle('open');
            button.querySelector('.aurora-fab-actions').classList.toggle('collapsed');
        } else {
            let action = button.querySelector('.aurora-fab-actions').children[0];
            action.trigger();
        }
    }

    checkActions( ) {
        if ( this.numberOfActions() === 1  ) {
            this.container.querySelector('.aurora-floatingactionbutton').classList.remove('single-action');
        } else {
            this.container.querySelector('.aurora-floatingactionbutton').classList.add('single-action');
        }
    }

    numberOfActions() {
        let actions = this.container.querySelector('.aurora-floatingactionbutton .aurora-fab-actions');
        return actions.childElementCount;
    }
}
