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

export default class MaterialList extends ThemeBehavior {

    rootElement  = '';
    _pos_wrapper = {};
    _columns     = {};

    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;

        this._pos_wrapper = this.container.getBoundingClientRect();

        let rowheaders = this.container.querySelectorAll("th.sortable");
        let actiontriggers = this.container.querySelectorAll(".aurora-table-actions-trigger");

        for ( let i = 0; i < rowheaders.length; i++ ) {
            rowheaders[i].addEventListener('click', (event) => this.callbackClickRowHeader(event, rowheaders[i]), false);
        }

        for ( let i = 0; i < actiontriggers.length; i++ ) {
            actiontriggers[i].addEventListener('click', (event) => this.callbackClickActionTrigger(event, actiontriggers[i]), false);
        }


        new Ripple( this.container.querySelector('.aurora-listitem-ripple'));
    }

    callbackClickActionTrigger( event, trigger ) {
        trigger.parentElement.getElementsByClassName('aurora-table-actions-menu')[0].classList.toggle('hidden');
        //trigger.classList.toggle('hidden');
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
