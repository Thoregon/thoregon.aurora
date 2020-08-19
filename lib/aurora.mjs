
/**
 *
 *
 * @author: Bernhard Lukassen
 */

import { doAsync, timeout }         from '/evolux.universe';

import ViewModel                    from "./viewmodel/viewmodel.mjs";

export default class Aurora {
    /*
     * Service
     */

    install() {
    }

    uninstall() {
        delete universe.aurora;
    }

    resolve() {
    }

    async start() {
        universe.aurora = {};
        // universe.aurora.ViewModelBuilder = ViewModelBuilder;
        universe.aurora.ViewModel = ViewModel;

        // todo [REFACTOR]
/*
        if (globalThis.document) {
            await doAsync();
            globalThis.document.dispatchEvent(new CustomEvent('universe.aurora', { detail: this }));
        }
*/

        Object.defineProperty(HTMLElement.prototype, 'viewElements', {
            configurable: false,
            enumerable: false,
            get: function () {    // don't use () => {} because it binds this to undefined!
                return [...this.children];
            }
        })
        HTMLElement
    }

    stop() {
        // todo [REFACTOR]: use global object 'thoregon' as event source, rename event to 'thoregon.aurora:stop'
        if (globalThis.document) globalThis.document.dispatchEvent(new CustomEvent('universe.aurora.stop', { detail: this }));
    }

    update() {
    }

}
