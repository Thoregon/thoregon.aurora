/**
 *
 * todo [OPEN]: support multiple app roots to enable UI meshups
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import { View }    from "/thoregon.aurora";
import { doAsync } from "/evolux.universe";

// import BrowserRouter from "/evolux.ui/lib/router/browserrouter.mjs";
const runtime   = globalThis;
const container = runtime.document;

const defaultoptions = {};

let currentView;

export default class UIRouter /*extends BrowserRouter*/ {

    constructor(options) {
        this.options       = Object.assign({}, defaultoptions, options);
        runtime.onpopstate = (event) => this.pop(event);
        container.title    = "Thoregon";
        // this.apps          = {};
        runtime.history.replaceState({ current: null, title: "Thoregon" }, "Thoregon", '');
    }

    pop(event) {
        console.log(event);
        let state   = event.state;
        if (!state) return false;
        let route      = state.current;
        this.toView(route);
        return true;
    }

    restore() {
        // get params from URL and display referenced view
        let url = new URL(document.location.href);
        let params = url.searchParams;
        let route = {}
        if (params.has("r")) route.r = decodeURIComponent(params.get("r"));
        if (params.has("t")) route.t = decodeURIComponent(params.get("t"));
        if (params.has("v")) route.v = decodeURIComponent(params.get("v"));
        (async () => {
            await doAsync();
            if (!route.is_empty) {
                await this.toView(route);
            } else {
                // show welcome or default view if no route
                let blueprint = this.appelement.getBlueprint();
                let app = this.app;
                route.v = (await app.isWelcome()) ? blueprint.getWelcomeView() : blueprint.getDefaultView();
                if (!route.v) route.v = blueprint.getDefaultView();
                if (!route.is_empty) await this.routeTo(route);
            }
        })()
    }


    /*
     * API
     */

    async toView(route, appelement) {
        if (!route || route.is_empty) return;

        appelement = appelement || this.appelement;

        if (currentView) currentView.dispose();

        // r contains the entity, t ... target, v ... view path
        let { r, t, v } = route;
        let appuiroot = appelement.getAppViewRoot();
        // get view, style, viewmodel (behavior)
        let view = await View.from(v, appuiroot);
        let title = view.name;
        // get target
        let target = appelement.getBlueprintContainer(t);
        // render template
        await view.render(target, r);
        currentView = view;
        return title;
    }

    async routeTo(route, appelement) {
        if (!route || route.is_empty) return;
        let title = await this.toView(route, appelement);
        // push history
        runtime.history.pushState({ current: route, title: title }, title, this.routeUrl(route));
    }

    routeUrl(route) {
        let { r, t, v } = route;
        let url = new URL(document.location.href);
        let params = url.searchParams;
        params.delete("r");
        params.delete("t");
        params.delete("v");
        if (r) params.set("r", encodeURIComponent(r));
        if (t) params.set("t", encodeURIComponent(t));
        if (v) params.set("v", encodeURIComponent(v));
        let next = url.pathname+url.search;
        return next;
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
