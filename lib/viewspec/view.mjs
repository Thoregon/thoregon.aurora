/**
 *
 * todo [OPEN]: listen on any model mutations, update view (template placeholders)
 * todo [REFACTOR]: check if a custom element is needed to encapsulate style... -> connect viewmodel after content is displayed!
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

const _tpl      = {};
const _style    = {};
const _vmmodule = {};

export default class View {

    constructor(viewpath, approot) {
        this.approot          = approot;
        this.viewpath         = viewpath;
    }

    static async from(viewpath, approot) {
        let view = new this(viewpath, approot);
        return view;
    }

    async render(parent, ref) {
        if (parent.awaitRendering) await parent.awaitRendering();
        // add <aurora-view> to parent, with 'ref' and 'view' attribute
        let view = document.createElement('aurora-view');
        view.view = this.viewpath;
        view.ref = ref;
        // show
        this.view = view;
        if (parent.viewContentElement) {
            parent.viewContentElement(view);
        } else {
            parent.innerHTML = '';
            parent.appendChild(view);
            this.container = parent;
        }
        // wait until all child elements exists -> connect view model @see view.existsConnect()
    }

    addRenderFn(fn) {
        if (this.view?.addRenderFn) this.view.addRenderFn(fn);
    }

    dispose() {
        this.view.viewModel?.eventDispose?.();
        this.view.eventDispose?.()
        this.view.dispose?.();
    }

    destroy() {
        // invoked when element is disconnected from the DOM e.g. view closes
        // implement by subclass
    }

    async modelMutated(mutation) {
        return true;
    }
}
