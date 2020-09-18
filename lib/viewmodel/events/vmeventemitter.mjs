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

    removeEventListener(eventname, listener) {
        let reg = this._listners[eventname];
        if (!reg) return;
        let i = reg.indexOf(listener);
        if (i > -1) reg.splice(i,1);
    }

    dispatchEvent(eventname, data) {
        let listeners = this._listners[eventname];
        if (!listeners || listeners.length === 0) return;
        let event = new CustomEvent(eventname, { detail: data });
        listeners.forEach((listener) => listener(event));
    }
}

export default VmEventEmitter;
