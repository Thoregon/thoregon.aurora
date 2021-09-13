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

export default class MaterialDrawer extends ThemeBehavior {


    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;

        this.drawer = this.container.querySelectorAll('.aurora-drawer')[0];

        this.isDragging = false;
        this.prev_x     = 0;
        this.width      = 0;

        //---  CLICK event for the input field wrapper  ----------------------------------------------------------------

        let dragHandle = this.container.querySelectorAll('.drawer-drag-handle');
   //     dragHandle[0].onmousedown = this.callbackDrag();

        dragHandle[0].addEventListener('mousedown', ( event ) => this.callbackDrag( event, this.container ), false);
        document.addEventListener('mousemove', ( event ) => this.callbackMove( event, this.container ), false);
        document.addEventListener('mouseup',   ( event ) => this.callbackDrop( event, this.container ), false);

        /*

        var textfield = this.container.getElementsByClassName("aurora-text-field");
        textfield[0].addEventListener('click', this.callbackClicked, false);

        var inputfield = this.container.getElementsByClassName("aurora-text-field-input");

        //---  KEYUP event for the input field  ------------------------------------------------------------------------
        var typing     = (event) => this.callbackKeyup( event, this.container );
        inputfield[0].addEventListener('keyup', this.callbackKeyup, false);
        inputfield[0].addEventListener('keyup', () => this.cleanErrors(), false);

        var leaving     = (event) => this.callbackFocusout( event, this.container );
        inputfield[0].addEventListener('focusout', leaving, false);

        inputfield[0].addEventListener( 'focus', this.callbackClicked );
*/
        // MDC.MDCRipple.attachTo(inputfield);
    }

    callbackDrag( event, container ) {
        this.isDragging = true;
        let handle = event.target;
        this.prev_x = handle.offsetLeft;

    }
    callbackMove( event, container ) {
        if ( this.isDragging ) {

            if (event.pageX) {
                this.width = event.pageX;
            }

            let newWidth = this.width;
            if ( this.drawer.classList.contains('right') ) {
                  newWidth = window.outerWidth - this.width;
//                let temp = this.drawer.outerWidth();
//                debugger;
            }

            this.drawer.style.width =  newWidth + 'px';
            this.drawer.setAttribute('data-width', newWidth + 'px');

            this.container.getAuroraBlueprint().adjustBlueprint();
        }

    }
    callbackDrop( event, container ) {
        if ( this.isDragging ) {
            this.isDragging = false;
        }
    }
}
