/**
 * common observer behavior
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

export default class Observer {

    constructor() {
        this.observable = null;
    }

    //
    // Observable
    //

    observe(observable) {
        this.observable = observable;
        this.subscribeOn(observable);
    }

    subscribeOn(observable) {
        // implement by subclass
    }
}
