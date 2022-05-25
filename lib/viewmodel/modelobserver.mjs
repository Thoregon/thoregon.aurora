/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import Observer            from "./observer.mjs";
import MetaClass           from "/thoregon.archetim/lib/metaclass/metaclass.mjs";

export default class ModelObserver extends Observer {

    //
    // Observable
    //

    subscribeOn(model, opt) {
        if (missing(model.addEventListener)) return;
        model.addEventListener('change', (mutations) => this.modelMutated(mutations));
        this.analyzeModel(model, opt);
    }

    analyzeModel(model, { parent, parentproperty } = {}) {
        // meta info

        // properties

    }

    async deepAnalyseModel(model, { parent, parentproperty, depth = 0, } = {}) {
        // todo
    }

    analyzeMeta(model) {
        const meta = missing(model.metaClass) ? MetaClass.pseudoMeta(model) : model.metaClass;
    }

    //
    // mutations
    //

    modelMutated(mutations) {

    }
}
