/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */
import Observer from "./observer.mjs";

const observeOptions     = {
    childList            : true,
    subtree              : true,
    attributes           : true,
    attributeOldValue    : true,
    characterData        : true,
    characterDataOldValue: true
};

export default class ViewObserver extends Observer {

    //
    // Observable
    //

    subscribeOn(view, opt) {
        // listen to mutations of the view
        this._mutationobserver = new MutationObserver((mutations) => this.viewMutated(mutations) );
        this._mutationobserver.observe(this.shadowRoot, observeOptions);

        // analyze the existing view,
        this.analyzeView(view, opt);
    }

    analyzeView(view, opt) {

    }

    //
    // mutations
    //

    viewMutated(mutations) {

    }

}
