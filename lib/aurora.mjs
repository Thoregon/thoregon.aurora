/**
 *
 * todo [OPEN]:
 *  - scan document for 'aurora-elements' and import it dynamically
 *  - protocoll for aurora-elements: scan for 'aurora-elements' and import it dynamically
 *  - registry tagname - element
 *
 *  extended methods for HTMLElements are defined in 'auroraelement.mjs'
 *
 * @author: Bernhard Lukassen
 */

import { doAsync, timeout } from '/evolux.universe';
import ViewModel            from "./viewmodel/viewmodel.mjs";
import UIRouter             from "./routes/uirouter.mjs";
import AuroraElement        from "./auroraelement.mjs";

export default class Aurora {

    static withElements(elements) {
        universe.aurora = {};
        universe.uirouter = new UIRouter();
        // universe.aurora.ViewModelBuilder = ViewModelBuilder;
        universe.aurora.ViewModel = async (options) => await ViewModel.with(options);
        AuroraElement.withElements(elements);
        return new this();
    }

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
/*
        universe.aurora = {};
        universe.uirouter = new UIRouter();
        // universe.aurora.ViewModelBuilder = ViewModelBuilder;
        universe.aurora.ViewModel = async (options) => await ViewModel.with(options);
*/
    }

    stop() {
        // todo [REFACTOR]: use global object 'thoregon' as event source, rename event to 'thoregon.aurora:stop'
        if (globalThis.document) globalThis.document.dispatchEvent(new CustomEvent('universe.aurora.stop', { detail: this }));
    }

    update() {
    }

}
