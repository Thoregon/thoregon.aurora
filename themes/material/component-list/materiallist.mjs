/*
 * Copyright (c) 2022.
 */

/**
 *
 *
 * @author: Bernhard Lukassen
 */

import ThemeBehavior            from "../../themebehavior.mjs";
import dragula            from '../../../ext/dragula/dragula.mjs';


import Ripple                   from '../ripple.mjs';

export default class MaterialList extends ThemeBehavior {

    rootElement  = '';
    _pos_wrapper = {};
    _columns     = {};

    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;

        this._pos_wrapper = this.container.getBoundingClientRect();
        //---

        let rowheaders = this.container.querySelectorAll("th.sortable");

        let actiontriggers = this.container.querySelectorAll(".aurora-table-actions-trigger");

        for ( let i = 0; i < rowheaders.length; i++ ) {
            rowheaders[i].addEventListener('click', (event) => this.callbackClickRowHeader(event, rowheaders[i]), false);
        }

        for ( let i = 0; i < actiontriggers.length; i++ ) {
            actiontriggers[i].addEventListener('click', (event) => this.callbackClickActionTrigger(event, actiontriggers[i]), false);
        }
/*
        if ( this.jar.propertiesValues()['dragdrop'] ) {
            if (this.container.children.length > 0) {
                let list = [this.container.children[0]];
                let drake = dragula(list, {
                    isContainer             : function (el) {
                        return false; // only elements in drake.containers will be taken into account
                    },
                    moves                   : function (el, source, handle, sibling) {
                        return true; // elements are always draggable by default
                    },
                    accepts                 : function (el, target, source, sibling) {
                        return true; // elements can be dropped in any of the `containers` by default
                    },
                    invalid                 : function (el, handle) {
                        return false; // don't prevent any drags from initiating by default
                    },
                    direction               : 'vertical',             // Y axis is considered when determining where an element would be dropped
                    copy                    : false,                       // elements are moved by default, not copied
                    copySortSource          : false,             // elements in copy-source containers can be reordered
                    revertOnSpill           : false,              // spilling will put the element back where it was dragged from, if this is true
                    removeOnSpill           : false,              // spilling will `.remove` the element, if this is true
                    mirrorContainer         : list[0],    // set the element that gets mirror elements appended
                    documentElement         : this.container,
                    ignoreInputTextSelection: true,     // allows users to select input text, see details below
                    slideFactorX            : 0,               // allows users to select the amount of movement on the X axis before it is considered a drag instead of a click
                    slideFactorY            : 0,               // allows users to select the amount of movement on the Y axis before it is considered a drag instead of a click
                });
            }
        }
*/
        new Ripple( this.container.querySelector('.aurora-listitem-ripple'));
    }

    callbackClickActionTrigger( event, trigger ) {
        trigger.parentElement.getElementsByClassName('aurora-table-actions-menu')[0].classList.toggle('hidden');
        trigger.classList.toggle('hidden');
        event.stopPropagation();
    }


    callbackClickRowHeader( event, th ) {

        //--- remove all sortings in case a different column is taken -----
        let headers = this.container.querySelectorAll("th.sortable");

        for (let i = 0; i < headers.length; i++) {
            if (headers[i] != th) {
                headers[i].classList.remove('sort-asc', 'sort-desc');
            }
        }

        //--- switch between the different stages of sorting ------
        //--- sort-asc -> sort-desc -> no sorting

        let classlist = th.classList;

        if (classlist.contains('sort-asc')) {
            // add sort-desc
            th.classList.remove('sort-asc');
            th.classList.add('sort-desc');

            // inform query....
        } else if (classlist.contains('sort-desc')) {
            // remove sort-desc
            th.classList.remove('sort-desc');

            // inform query....
        } else {
            // add sort-asc
            th.classList.add('sort-asc');

            // inform query....
        }
    }

}
