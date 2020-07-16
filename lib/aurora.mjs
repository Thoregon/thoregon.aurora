
/**
 *
 *
 * @author: Bernhard Lukassen
 */

import ViewModel        from "./viewmodel/viewmodel.mjs";

export default class Aurora {
    /*
     * Service
     */

    install() {
        universe.aurora = {};
        // universe.aurora.ViewModelBuilder = ViewModelBuilder;
        universe.aurora.ViewModel = ViewModel;
    }

    uninstall() {
        delete universe.aurora;
    }

    resolve() {
    }

    async start() {
        // todo [REFACTOR]: use global object 'thoregon' as event source, rename event to 'thoregon.aurora'
        if (globalThis.document) globalThis.document.dispatchEvent(new CustomEvent('universe.aurora', { detail: this }));
    }

    stop() {
        // todo [REFACTOR]: use global object 'thoregon' as event source, rename event to 'thoregon.aurora:stop'
        if (globalThis.document) globalThis.document.dispatchEvent(new CustomEvent('universe.aurora.stop', { detail: this }));
    }

    update() {
    }

}
