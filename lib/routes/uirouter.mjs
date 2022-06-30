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

const runtime   = globalThis;
const container = runtime.document;

const defaultoptions = {};

let currentView;

export default class UIRouter {

    constructor(options) {
        this.options       = Object.assign({}, defaultoptions, options);
        runtime.onpopstate = (event) => this.pop(event);
        container.title    = "Thoregon";
        // this.apps          = {};
        runtime.history.replaceState({ current: null, title: "Thoregon" }, "Thoregon", '');
        // detect all click anywhere on to window
        document.body.addEventListener('click', (evt) => this.windowClicked(evt), true);
        this._windowClickListeners = [];
        // todo: check if this works with all browsers; maybe 'mouseup' is better
        this.routes                = [];
        this.routeSources          = {};
    }

    pop(event) {
        console.log(event);
        let state   = event.state;
        if (!state) return false;
        let route      = state.current;
        this.showView(route);
        return true;
    }

    applyInterfaceSettings(app) {
        let url = new URL(document.location.href);
        let params = url.searchParams;
        let intSettings = app.interfaceSettings;
        for (let p of params) {
            let name = p[0], value = p[1];
            if (name.startsWith("intf-")) {
                name = name.substring(5);
                if (intSettings[name]) intSettings[name] = value;
            }
        }
    }

    restore() {
        (async () => {
            await doAsync();
            let url = new URL(document.location.href);
            let blueprint = this.appelement.getBlueprint();
            let params = url.searchParams;
            if (params.has("route")) {
                let route = params.get("route");
                const match = await this.routePath0(route);
                if (match) return;
            }
            // get params from URL and display referenced view
            let route = {}
            if (params.has("r")) route.r = decodeURIComponent(params.get("r"));
            if (params.has("t")) route.t = decodeURIComponent(params.get("t"));
            if (params.has("v")) route.v = decodeURIComponent(params.get("v"));
            if (!route.is_empty) {
                await this.showView(route);
            } else {
                // show welcome or default view if no route
                if (!blueprint) return; // no blueprint, no welcome or default route (in blueprint.container!).
                let app = this.app;
                route.v = (await app.isWelcome()) ? blueprint.getWelcomeView() : blueprint.getDefaultView();
                if (!route.v) route.v = blueprint.getDefaultView();
                await doAsync();
                if (!route.is_empty) await this.routeToHist(route);
            }
        })()
    }


    /*
     * API
     */

    async showView(route, appelement) {
        if (!route || route.is_empty) return;

        appelement = appelement || this.appelement;

        if (currentView) currentView.dispose();

        // r contains the entity, t ... target, v ... view path
        let { r, t, v, l } = route;
        let appuiroot = appelement.getAppViewRoot();
        // get view, style, viewmodel (behavior)
        let view = await View.from(v, appuiroot);
        let title = view.name;
        // get target
        let target = appelement.getBlueprintElementWithName(t); // appelement.getBlueprintContainer(t);
        if (!target) {
            console.log("No view target found!", route);
            return;
        }
        // render template
        await view.render(target, r);
        currentView = view;
        // no error, now notify route sources
        this.viewWasRendered(route, appelement);
        return title;
    }

    openLeftDrawer() {
        const appelement = this.appelement;
        const blueprint  = appelement.getBlueprint();
        blueprint.drawerLeft?.open();
    }

    closeLeftDrawer() {
        const appelement = this.appelement;
        const blueprint  = appelement.getBlueprint();
        blueprint.drawerLeft?.close();
    }

    openRigthDrawer() {
        const appelement = this.appelement;
        const blueprint  = appelement.getBlueprint();
        blueprint.drawerRight?.open();
    }

    closeRightDrawer() {
        const appelement = this.appelement;
        const blueprint  = appelement.getBlueprint();
        blueprint.drawerRight?.close();
    }

    async routeToHist(route, appelement) {
        if (!route || route.is_empty) return;
        let title = await this.showView(route, appelement);
        // push history
        runtime.history.pushState({ current: route, title: title }, title, this.routeUrl(route));
    }

    async routeTo(route, appelement) {
        if (!route || route.is_empty) return;
        let title = await this.showView(route, appelement);
    }

    async routePath0(route, origin) {
        let routematch = this.matchRoute(route);
        let blueprint = this.appelement.getBlueprint();
        // todo [OPEN]: get title
        if (routematch) {
            routematch.handler({ path: route, route: routematch.route, rx: routematch.rx, ids: routematch.ids, origin: !!origin }, blueprint, this);
            return true;
        }
        return false;
    }

    async routePath(route, origin) {
        if (!route) return;
        runtime.history.pushState({ current: route, title: route }, route, this.routePathUrl(route));
        this.routePath0(route, origin);
    }

    routePathUrl(path) {
        let url = new URL(document.location.href);
        let params = url.searchParams;
        params.delete("r");
        params.delete("t");
        params.delete("v");
        params.set('route', path);
        let next = url.pathname+url.search;
        return next;
    }

    routeUrl(route) {
        let { r, t, v, l } = route;
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
            widget.addEventListener('exists', async (evt) => {
                let vm = await universe.aurora.ViewModel();
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

    //
    // route sources
    //

    source4route(route, elem) {
        let elems = this.routeSources[route];
        if (!elems) {
            elems = [];
            this.routeSources[route] = elems;
        }
        elems.push(elem);
    }

    removeSource(route, elem) {
        let elems = this.routeSources[route];
        if (!elems) return;
        this.routeSources[route] = elems.filter(item => item !== elem);
    }


    viewWasRendered(route, appelement) {
        if (!route) return;
        let { r, t, v, l } = route;
        const elems = this.getSource4Route(route);
        for (const elem of elems) {
            if (elem.targetShowsView) elem.targetShowsView(route);
        }
    }

    getSource4Route(route) {
        // todo [OPEN]: does not work for recursive (e.g. trees) views!
        const link = Object.keys(this.routeSources).find(l => l.startsWith(route.l));
        const elems = this.routeSources[link];
        return elems ?? [];
    }

    //
    // App structure
    //

    get appregistry() {
        return universe.dorifer.appregistry;
    }

    get envelop() {
        return universe.dorifer.appElement;
    }

    //
    // Routes
    //

    route(route, handler) {
        let rx = new RegExp('^'+route.replaceAll(/{.+}/g, '(.+)')+'$');
        let ids = [...route.matchAll(/{(.+?)}/g)].map((item) => item[1]);

        this.routes.push({ rx, ids, route, handler });
    }

    matchRoute(pathname) {
        let match = this.routes.find((item) => pathname.match(item.rx));
        if (!match) return;
        let vals = [...pathname.match(match.rx)];    // refactor
        vals.shift();    // drop first element, it contains to whole path
        let ids = {};
        for (let i in vals) {
            ids[match.ids[i]] = vals[i];
        }
        return { ids, handler: match.handler, rx: match.rx, route: match.route };
    }

    getRouteFor(pathname) {
        return this.routes.find((item) => pathname === item.route);
    }

    buildRoute(pathname, ids) {
        Object.entries(ids).forEach(([name, val]) => pathname = pathname.replaceAll('{'+name+'}', val));
        return pathname;
    }

    //
    // handle clicks anywhere on the window
    //

    addWindowClickListener(fn) {
        this._windowClickListeners.push(fn);
    }

    removeWindowClickListener(fn) {
        this._windowClickListeners = this._windowClickListeners.filter(listener => listener !== fn);
    }

    windowClicked(evt) {
        this._windowClickListeners.forEach(listener => {
            try {
                listener(evt);
            } catch (e) {
                console.log("Error in window click listener", e)
            }
        })
    }

}
