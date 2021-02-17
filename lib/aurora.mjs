/**
 *
 *
 *  extended methods for HTMLElements are defined in 'auroraelement.mjs'
 *
 * @author: Bernhard Lukassen
 */

import { doAsync, timeout } from '/evolux.universe';
import ViewModel            from "./viewmodel/viewmodel.mjs";
import UIRouter             from "./routes/uirouter.mjs";

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
        universe.uirouter = new UIRouter();
        // universe.aurora.ViewModelBuilder = ViewModelBuilder;
        universe.aurora.ViewModel = async (options) => await ViewModel.with(options);
    }

    stop() {
        // todo [REFACTOR]: use global object 'thoregon' as event source, rename event to 'thoregon.aurora:stop'
        if (globalThis.document) globalThis.document.dispatchEvent(new CustomEvent('universe.aurora.stop', { detail: this }));
    }

    update() {
    }

}
