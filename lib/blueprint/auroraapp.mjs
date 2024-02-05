/**
 * AuroraApp is a mixin to extend your app with basic aurora behavior
 *
 * override or subclass to implement special behavior
 *
 * an aurora app is always embedded in another element.
 * if standalone the element is an AppEnvelop
 *
 * @author: Bernhard Lukassen
 */

export default (base) => class AuroraApp extends (base || Object) {

    set done(fn) {
        this._doneFn = fn;
    }

    get done() {
        return (!this._doneFn)
               ? () => {}
               : this._doneFn;
    }

    get uiRoot() {
        return this.uiComponentRoot;
    }

    get appelement() {
        return this;
    }

    isAppElement() {
        return true;
    }

    getAuroraAppElement() {
        return this;
    }

    getAppViewRoot() {
        return this.uiComponentRoot;
    }

    urlParams() {
        return universe.dorifer.urlParams;
    }

    /**
     * There can only be one 'blueprint'
     * @param bp
     */
    registerBlueprint(bp) {
        this._blueprint = bp;
    }

    get blueprint() {
        return this._blueprint;
    }

    /**
     * @deprecated
     * @returns {*}
     */
    getBlueprint() {
        return this._blueprint;
    }

    registerBlueprintContainer(bc) {
        if (!this._blueprintContainers) this._blueprintContainers = [];
        if (!this._blueprintContainers.includes(bc)) this._blueprintContainers.push(bc);
    }

    getBlueprintContainer(name) {
        return this._blueprintContainers;
    }

    getBlueprintContainer(name) {
        if (!this._blueprintContainers) return;
        let bc = this._blueprintContainers.find(bc => bc.auroraname === name);
        return bc ? bc : this._blueprintContainers.length > 0 ? this._blueprintContainers[0] : undefined;
    }

    getBlueprintElementWithName(name) {
        const elem = this._blueprint?.getBlueprintElementWithName(name);
        return elem ? elem : this.getBlueprintContainer(name);
    }

    /**
     * answer the name of the route to this element
     */
/*
    static get route() {
        throw ErrNotImplemented();
    }
*/

    /**
     * called if the app is the top most
     * create an envelop for the app itself
     * the envelop provides basic UI elements like menu, indicators and status displays
     */
    prepareEnveloping() {
        // override by subclasses
    }


    /**
     * called if the app is embedded in another app
     * the app can decide which range of functions it offers
     */
    prepareEmbedded() {

    }

    set envelop(uielement) {
        this._envelop = uielement;
    }

    /*
     * override by subclasses if needed
     */
    async awaken(state) {
        // default implementation: NOP

        this.resizeObserver = new ResizeObserver( entries => this.emitSizeEvent( ) );
        this.resizeObserver.observe( this );
        this.isInIframe = (window.parent !== window);
        this.emitWidgetEvent({ type: 'initialized' });
    }

    prepareWidgetEvents() {
        window.addEventListener('resize', (evt) => this.emitSizeEvent(evt));
    }

    emitWidgetEvent(evt) {
        // console.log(">> emit widget event");
        if (window.parent !== window) window.parent.postMessage(evt, '*');
    }

    emitSizeEvent(elewidth, elemheight) {
        let width = this.container.offsetWidth;
        let height = this.container.offsetHeight;

        this.emitWidgetEvent({ type: 'resize', width, height });
    }

    sleep() {
        // default implementation: NOOP
        // check if resize events or clicks should be forwarded
    }

}
