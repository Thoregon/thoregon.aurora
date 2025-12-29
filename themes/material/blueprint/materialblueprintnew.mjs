/*
 * Copyright (c) 2021.
 */

/**
 *
 *
 * @author: Bernhard Lukassen
 */

import ThemeBehavior            from "../../themebehavior.mjs";


export default class MaterialBlueprintNew extends ThemeBehavior {

    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;

        this.ids = [];

        this.positions = {
            content    : 0,
            drawerLeft : 0,
            drawerRight: 0,
        };

        this.blueprint = this.container.querySelector('.aurora-blueprint');
        this.header    = this.container.querySelector('.aurora-header');
        this.footer    = this.container.querySelector('.aurora-footer');
        this.content   = this.container.querySelector('.aurora-content');
        this.overlay   = this.container.querySelector('.aurora-overlay');

        this.drawerRight = this.container.querySelector('.aurora-drawer-right');
        this.drawerLeft  = this.container.querySelector('.aurora-drawer-left');

        this.overlay.addEventListener('click', ( event ) => this.callbackOverlayClicked( event, this.container ), false)
        window.addEventListener('resize',   ( event ) => this.callbackResize( event, this.container ), false);

        window.addEventListener('scroll', ( event ) => this.callbackContentScroll( event, this.container ), false);
    }

    getElementWithName(name) {
        if (this.header         && name === 'header')       return this.header;
        if (this.drawerLeft     && name === 'drawer-left')  return this.drawerLeft;
        if (this.drawerRight    && name === 'drawer-right') return this.drawerRight;
        if (this.drawerRight    && name === 'draweright')   return this.uicontainer;
        if (this.footer         && name === 'footer')       return this.footer;
        if (this.content        && name === 'mainpage')     return this.content;
        if (this.overlay        && name === 'overlay')      return this.overlay;

    }

    resetTarget(target) {
        if ( target === 'mainpage' ) {
            this.positions.content = 0;
        }
    }

    getConfiguration() {

        if (this.layoutConfiguration === undefined ||
            this.layoutConfiguration === null) {
            return this.defaultLayoutConfiguration;
        }

        return this.layoutConfiguration;
    }

    setDefaultLayoutConfiguration(defaultConfiguration) {
        this.defaultLayoutConfiguration = defaultConfiguration;
    }

    setLayoutConfiguration(layoutConfiguration) {

        if ( layoutConfiguration.mode ) {
            this.container.querySelector('.aurora-blueprint').dataset.mode = layoutConfiguration.mode;
        }

        this.layoutConfiguration = layoutConfiguration;
        this.blueprint.style.display = "";
        this.blueprint.classList.remove('animate');

        if ( this.layoutConfiguration.overlay.open ) {
            this.openOverlay();
        }

        this.adjustBlueprint();

    }

    openLeftDrawer() {
        const drwDef = this.layoutConfiguration.drawerLeft;
        drwDef.open  = true;
        this.blueprint.classList.add('animate');
        this.adjustBlueprint();
    }
    openRightDrawer() {
        const drwDef   = this.layoutConfiguration.drawerRight;
        drwDef.open = true;
        this.blueprint.classList.add('animate');
        this.adjustBlueprint();
    }
    openOverlay() {
        const ovlDef = this.layoutConfiguration.overlay;
        ovlDef.open  = true;
        ovlDef.closeroute = universe.uirouter.prevroute;

        const scrollPosition   = window.pageYOffset || document.documentElement.scrollTop;
        this.content.style.top = `-${scrollPosition}px`;

        this.blueprint.classList.add('overlay-open');
    }
    closeOverlay() {
        const ovlDef         = this.layoutConfiguration.overlay;
        const scrollPosition = -parseInt(this.content.style.top, 10);

        ovlDef.open  = false;
        this.blueprint.classList.remove('overlay-open');

        if (ovlDef.closeroute) {
            universe.uirouter.back2route(ovlDef.closeroute);
        }

        window.scrollTo(0, scrollPosition);
    }

    closeLeftDrawer() {

        const drwDef   = this.layoutConfiguration.drawerLeft;
        drwDef.open = false;
        this.blueprint.classList.add('animate');
        this.adjustBlueprint();
    }
    closeRightDrawer() {
        const drwDef = this.layoutConfiguration.drawerRight;
        drwDef.open  = false;
        this.blueprint.classList.add('animate');
        this.adjustBlueprint();
    }

    toggleDrawerRight() {
        const drawer = this.layoutConfiguration.drawerRight;
        this.blueprint.classList.add('animate');
        drawer.open  = ! drawer.open;
        this.adjustBlueprint();
    }
    toggleDrawerLeft() {
        const drawer = this.layoutConfiguration.drawerLeft;
        this.blueprint.classList.add('animate');
        drawer.open  = ! drawer.open;
        this.adjustBlueprint();
    }

    registerID( element ) {
        this.ids[ element.id ] = element;
    }
    positionToElement( elementID, options ) {

        if ( ! this.ids[elementID] ) return;
        let positionTop = this.ids[elementID].offsetTop;

        if ( this.header ) {

            const tempElement = document.createElement('div');
            tempElement.style.height = 'var(--aurora-position-padding, 10px)';

            this.blueprint.appendChild(tempElement);

            // Get the height in pixels
            const padding = tempElement.offsetHeight;

            // Remove the temporary element
            this.blueprint.removeChild(tempElement);

            positionTop -= this.header.offsetHeight;
            positionTop -= padding;
        }

        window.scrollTo( {
            top: positionTop,
            behavior: 'smooth'
        });
    }

    callbackResize( e, container ) {}
    callbackOverlayClicked(e, container) {
        if (e.target.classList.contains('aurora-overlay')) {
            this.closeOverlay();
        }
    }
    callbackContentScroll(e, container) {
        const scrollPosition   = window.pageYOffset || document.documentElement.scrollTop;
        this.positions.content = scrollPosition;
    }

    adjustBlueprint() {
        this.adjustHeader();
        this.adjustDrawer('left');
        this.adjustDrawer('right');
        this.adjustFooter();
        this.adjustContent();
        this.adjustOverlay();
    };

    adjustHeader() {
        const lc        = this.getConfiguration();
        const hdr       = this.header;
        const hdrDef    = lc.header;
        const drwLftDef = lc.drawerLeft;
        const drwRgtDef = lc.drawerRight;

        hdr.style.display  = hdrDef.enabled ? ''  : 'none';

        hdr.style.left =    (hdrDef.insetLeft  &&
                             drwLftDef.enabled &&
                             drwLftDef.open
                            ) ? drwLftDef.width : '';

        hdr.style.right =    (hdrDef.insetRight  &&
                              drwRgtDef.enabled  &&
                              drwRgtDef.open
                             ) ? drwRgtDef.width : '';



        hdr.style.minHeight = hdrDef.minHeight;

        const height = Math.max(hdr.offsetHeight, parseInt(hdrDef.height, 10));

        hdrDef.height = height + 'px';

        if ( hdrDef.fixed ) {
            this.replaceClass(hdr,'absolute-top','fixed-top');
        } else {
            this.replaceClass(hdr,'fixed-top','absolute-top');
        }
    }
    adjustContent() {
        const cnt    = this.content;
        const hdrDef = this.layoutConfiguration.header;
        const ftrDef = this.layoutConfiguration.footer;
        const drwLftDef = this.layoutConfiguration.drawerLeft;
        const drwRgtDef = this.layoutConfiguration.drawerRight;

        cnt.style.paddingTop    = hdrDef.enabled ?  hdrDef.height : '0px';
        cnt.style.paddingBottom = ftrDef.enabled ? ftrDef.height  : '0px';

        cnt.style.paddingLeft  = drwLftDef.open ? drwLftDef.width : '0px';
        cnt.style.paddingRight = drwRgtDef.open ? drwRgtDef.width : '0px';

        if ( this.positions.content > 0 ) {
            this.content.style.top = `-${this.positions.content}px`;
        }
    }
    adjustDrawer(position) {

        const hdrDef = this.layoutConfiguration.header;

        let drwDef, drw, hdrInset, drwClosePosition;


        if (position === 'left') {
            drwDef   = this.layoutConfiguration.drawerLeft;
            drw      = this.drawerLeft;
            hdrInset = hdrDef.insetLeft;

            drwClosePosition ='-' + drwDef.width;

        }

        if (position === 'right') {
            drwDef   = this.layoutConfiguration.drawerRight;
            drw      = this.drawerRight;
            hdrInset = hdrDef.insetRight;

            drwClosePosition ='+' + drwDef.width;
        }

        drw.style.width      = drwDef.width;
        drw.style.transform  = drwDef.open ? 'translateX(0px)' : `translateX(${drwClosePosition})`;
        drw.style.top        = hdrInset ? '0px' : hdrDef.height;
        drw.style.bottom     = '0px';
    }
    adjustFooter() {
        const ftr       = this.footer;
        const ftrDef    = this.layoutConfiguration.footer;
        const drwLftDef = this.layoutConfiguration.drawerLeft;
        const drwRgtDef = this.layoutConfiguration.drawerRight;

        ftr.style.display  = ftrDef.enabled ? ''  : 'none';

        ftr.style.left =    (ftrDef.insetLeft  &&
            drwLftDef.enabled &&
            drwLftDef.open
        ) ? drwLftDef.width : '';

        ftr.style.right =    (ftrDef.insetRight  &&
            drwRgtDef.enabled  &&
            drwRgtDef.open
        ) ? drwRgtDef.width : '';

        ftr.style.minHeight = ftrDef.minHeight;
        ftrDef.height = ftr.offsetHeight + 'px';

        if ( ftrDef.fixed ) {
            this.replaceClass(ftr,'absolute-bottom','fixed-bottom');
        } else {
            this.replaceClass(ftr,'fixed-bottom','absolute-bottom');
        }
    }
    adjustOverlay() {}

    analyzeElementPlacement( element ) {
        const style    = window.getComputedStyle(element);
        const display  = style.display;
        const position = style.position;

        // Temporarily show the element to get its height
        element.classList.add('forceVisible');

        const rect = element.getBoundingClientRect();
        const height = element.offsetHeight;
        const width  = element.offsetWidth;

        const x = rect.left;
        const y = rect.top;
        // Hide the element again

        element.classList.remove('forceVisible');

        let clippingBottom;
        let clippingTop    = false;
        let clippingLeft   = false;
        let clippingRight  = false;

        //--- clipping bottom --------
        let elementBottom = y + rect.height;

        const ftrDef = this.layoutConfiguration.footer;
        if (ftrDef.fixed ) { elementBottom += this.footer.offsetHeight; }
        clippingBottom =  elementBottom > window.innerHeight;

        return {
            window   : {
                width : window.innerWidth,
                height: window.innerHeight,
            },
            dimension: {
                width : rect.width,
                height: rect.height,
            },
            position : {
                left: x,
                top : y,
            },
            clipping : {
                top: clippingTop,
                right: clippingRight,
                bottom: clippingBottom,
                left: clippingLeft,
            },
        };
    }

    replaceClass(element, classToRemove, classToAdd) {
        element.classList.remove(classToRemove);  // Remove the class, if it exists
        element.classList.add(classToAdd);        // Add the new class
    }
}
