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

        let rowheaders = this.container.querySelectorAll("th.sortable");

        for ( let th = 0; th < rowheaders.length; th++ ) {
            rowheaders[th].addEventListener('click', (event) => this.callbackClickRowHeader(event, rowheaders[th]), false);
        }

        new Ripple( this.container.querySelector('.aurora-listitem-ripple'));
    }

    callbackClickRowHeader( event, th ) {

        //--- remove all sortings in case a different column is taken -----
        let headers = this.container.querySelectorAll("th.sortable");

        for (let i = 0; i < headers.length; i++) {
            if (headers[i] != th) {
                headers[i].classList.remove('sort-asc', 'sort-dsc');
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
