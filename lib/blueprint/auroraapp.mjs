import { ErrNotImplemented } from "../errors.mjs";

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

    }

    /**
     * called if the app is embedded in another app
     * the app can decide which range of functions it offers
     */
    prepareEmbedded() {

    }

    set envelop(uielement) {
        this.envelop = uielement;
    }

    /*
     * override by subclasses if needed
     */
    async awaken(state) {
        // default implementation: NOP
    }

    sleep() {
        // default implementation: NOP
    }

}
