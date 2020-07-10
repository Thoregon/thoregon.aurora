/**
 *
 *
 * @author: Bernhard Lukassen
 */

const VmEventEmitter = (base) => class extends base {

    constructor() {
        super();
        this._listners = {};
    }

    /**
     * add
     * @param {String}      eventname
     * @param {Function}    listener
     */
    addEventListener(eventname, listener) {
        let reg = this._listners[eventname];
        if (!reg) {
            reg = [];
            this._listners[eventname] = reg;
        }
        reg.push(listener);
    }

    // todo [OPEN]: add remove listener

    dispatchEvent(eventmane, data) {
        let listeners = this._listners[eventname];
        if (!listeners || listeners.length === 0) return;
        let event = new CustomEvent(eventmane, { detail: data });
        listeners.forEach((listener) => listener(event));
    }
}

export default VmEventEmitter;
