/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

// import BrowserRouter from "/evolux.ui/lib/router/browserrouter.mjs";
const runtime   = globalThis;
const container = document;

const defaultoptions = {};

export default class UiRouter /*extends BrowserRouter*/ {

    constructor(options) {
        this.options = Object.assign({}, defaultoptions, options);
        runtime.onpopstate = (event) => this.pop(event);
        runtime.history.replaceState({ current: null, title: "Thoregon" }, "Thoregon", '');
        container.title = "Thoregon";
    }

    pop(event) {
        console.log(event);
        let state   = event.state;
        if (!state) return false;
        let id      = state.current;
        let title   = state.title;
        this.toPage(id, title);
        return true;
    }

    restore() {
        // get params from URL and display referenced view
    }

    /*
     * API
     */

    routeTo(route) {
        // r contains the entity, t ... target, v ... view path
        let { r, t, v } = route;
        // get view, style, viewmodel (behavior)
        // get target
        // render template
        // show content
    }


    /*async*/ view(route) {
        return new Promise(((resolve, reject) => {
            let ui = this.appregistry.forRoute(route);
            let top = this.envelop;
            let widget = document.createElement(ui.widget.elementTag);  // todo [REFACTOR]: not only widgets!
            top.appendChild(widget);
            // create view model and connect
            widget.addEventListener('exists', (evt) => {
                let vm = universe.aurora.ViewModel();
                vm.view = widget;
                vm.model = universe.observe(ui.app);
                resolve(vm);
            });
        }));
    }

    /**
     *
     */
    /* async */ request(route, event) {
        return new Promise(async (resolve, reject) => {
            let vm = await this.view(route);
            // wait for done
            if (vm.model.on) {
                vm.model.on(event, (evt) => {
                    // remove UI
                    this.envelop.removeChild(vm.east);
                    resolve();
                })
            }
            /*
                        vm.done = (state) => {
                            resolve(state);
                            // remove UI
                            this.envelop.removeChild(widget);
                        }
            */
        }) ;
    }

    get appregistry() {
        return universe.dorifer.appregistry;
    }

    get envelop() {
        return universe.dorifer.appElement;
    }

}
