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
        this.jar.addEventListener('orientationchanged', (event) => this.callbackOrientationChanged( event, this ), false);

        new Ripple( this.container.querySelector('.aurora-listitem-ripple'));
    }

    callbackOrientationChanged() {
        let activetab      = this.jar.getAuroraTabContainer().getActiveTab();
        let tabindicator   = this.container.querySelector('.aurora-tab-list-indicator');
        let tablistwrapper = this.container.querySelector('.aurora-tab-list');

        this.adjustIndicator( activetab );
    }

    callbackTabAdded(event, tablist) {
        event.detail.addEventListener('mousedown', () => this.callbackTabOnMouseDown( event.detail ), false);
    }
    callbackTabOnMouseDown( tab ) {

        if ( tab.hasAttribute('disabled') ) return;
        this.adjustIndicator( tab );
    }

    adjustIndicator ( tab ) {
        let orientation    = this.jar.getAttribute('orientation');
        let tabindicator   = this.container.querySelector('.aurora-tab-list-indicator');
        let tablistwrapper = this.container.querySelector('.aurora-tab-list');

        switch ( orientation ) {
            case 'left':
                this.adjustIndicatorLeft( tablistwrapper, tab, tabindicator );
                break;
            case 'right':
                this.adjustIndicatorRight( tablistwrapper, tab, tabindicator );
                break;
            case 'bottom':
                this.adjustIndicatorBottom( tablistwrapper, tab, tabindicator );
                break;
            default:
                this.adjustIndicatorTop( tablistwrapper, tab, tabindicator );
                break;
        }
    }
    adjustIndicatorTop( tablistwrapper, tab, tabindicator ) {
        let tabstyle        = getComputedStyle(tablistwrapper);
        let indicatorstyle  = getComputedStyle(tabindicator);
        let margintop       = parseInt(tabstyle.marginTop);
        let indicatorheight = parseInt(indicatorstyle.height);

        let heightcorrection = parseInt( ( indicatorheight + 1 ) /2 );

        let left  = tab.offsetLeft;
        let width = tab.offsetWidth;
        let height = tablistwrapper.offsetHeight;

        tabindicator.style.top = height + margintop - heightcorrection + 'px';
        tabindicator.style.marginLeft = left + 'px';
        tabindicator.style.width = width + 'px';
    }

    adjustIndicatorBottom( tablistwrapper, tab, tabindicator ) {
        let tabstyle        = getComputedStyle(tablistwrapper);
        let indicatorstyle  = getComputedStyle(tabindicator);
        let margintop       = parseInt(tabstyle.marginTop);
        let indicatorheight = parseInt(indicatorstyle.height);

        let heightcorrection = parseInt( ( indicatorheight + 1 ) /2 );

        let left  = tab.offsetLeft;
        let width = tab.offsetWidth;
        let height = tablistwrapper.offsetHeight;

        tabindicator.style.top =  '0px';
        tabindicator.style.marginLeft = left + 'px';
        tabindicator.style.width = width + 'px';
    }

    adjustIndicatorLeft( tablistwrapper, tab, tabindicator ) {

        let tabliststyle     = getComputedStyle( tablistwrapper );
        let indicatorstyle   = getComputedStyle( tabindicator );
        let tabstyle         = getComputedStyle( tab );

        let width = tabliststyle.width;
        width = parseInt( width ) - 3;

        let height = tablistwrapper.offsetHeight;

        tabindicator.style.top = tab.offsetTop + 'px';
        tabindicator.style.marginLeft = width + 'px';
        tabindicator.style.width = '3px';
        tabindicator.style.height = tabstyle.height;
    }

    adjustIndicatorRight( tablistwrapper, tab, tabindicator ) {

        let tabliststyle     = getComputedStyle( tablistwrapper );
        let indicatorstyle   = getComputedStyle( tabindicator );
        let tabstyle         = getComputedStyle( tab );

        let width = tabliststyle.width;
        width = parseInt( width ) - 3;

        let height = tablistwrapper.offsetHeight;

        tabindicator.style.top = tab.offsetTop + 'px';
        tabindicator.style.marginLeft = '0px';
        tabindicator.style.width = '3px';
        tabindicator.style.height = tabstyle.height;
    }
}
