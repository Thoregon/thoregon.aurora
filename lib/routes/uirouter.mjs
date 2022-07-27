/**
 *
 * todo [OPEN]: support multiple app roots to enable UI meshups
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import { View }       from "/thoregon.aurora";
import { isFunction } from "/evolux.util/lib/objutils.mjs";
import { parseRoute } from "/evolux.util/lib/formatutils.mjs"

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

        this.routeListeners        = [];
    }

    pop(event) {
        console.log(event);
        let state   = event.state;
        let route = state?.current ?? this.urlrouter.extractRoute(window.location);
        if (!route) return false;
        this.routePath0(route);
        return true;
    }

    back() {
        history.back();
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

    async restore() {
        const route = this.urlrouter.extractRoute(window.location);
        if (!route) return;
        await this.routePath0(route);
    }

    //
    // blueprint control API
    //

    openLeftDrawer() {
        const appelement = this.appelement;
        const blueprint  = appelement.getBlueprint();
        blueprint.openLeftDrawer();
    }

    closeLeftDrawer() {
        const appelement = this.appelement;
        const blueprint  = appelement.getBlueprint();
        blueprint.closeLeftDrawer();
    }

    openRightDrawer() {
        const appelement = this.appelement;
        const blueprint  = appelement.getBlueprint();
        blueprint.openRightDrawer();
    }

    closeRightDrawer() {
        const appelement = this.appelement;
        const blueprint  = appelement.getBlueprint();
        blueprint.closeRightDrawer();
    }

    setRightDrawerWidth( width ) {
        const appelement = this.appelement;
        const blueprint  = appelement.getBlueprint();
        blueprint.drawerRight?.setAttribute('width', width );
        blueprint.adjustBlueprint();
    }

    setLeftDrawerWidth( width ) {
        const appelement = this.appelement;
        const blueprint  = appelement.getBlueprint();
        blueprint.drawerLeft?.setAttribute('width', width );
        blueprint.adjustBlueprint();
    }

    //
    // routes API
    //

    async showView(route, appelement) {
        if (!route || route.is_empty) return;

        appelement = appelement || this.appelement;

        if (currentView) currentView.dispose();

        // r contains the entity, t ... target, v ... view path
        let { ref, target, view } = route;
        let appuiroot = appelement.getAppViewRoot();
        // get view, style, viewmodel (behavior)
        let viewElement = await View.from(view, appuiroot);
        let title = viewElement.name;
        // get target
        let targetElement = appelement.getBlueprintElementWithName(target);
        if (!targetElement) {
            console.log("No view target found!", route);
            return;
        }
        // render template
        await viewElement.render(targetElement, ref);
        currentView = viewElement;
        // no error, now notify route sources
        this.viewWasRendered(route, appelement);
        return title;
    }

    async followRoute({ path, route, ids, origin }, routeSpec) {
        debugger;
        // analyze the route
    }

    async routePath0(route, origin) {
        let routematch = this.matchRoute(route);
        let blueprint = this.appelement.getBlueprint();
        // todo [OPEN]: get title
        if (routematch) {
            this.currentroute = Array.isArray(route) ? route.join('/') : route;
            routematch.handler({ path: route, route: routematch.route, ids: routematch.ids, origin: !!origin }, blueprint, this);
            return true;
        }
        return false;
    }

    async routePath(route, origin) {
        if (!route) return;
        runtime.history.pushState({ current: route, title: route }, route, this.urlrouter.routeForHistory(route));
        this.routePath0(route, origin);
    }

    //
    // route listeners
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

        // invoke insteners
        this.routeListeners.forEach(listener => {
            try {
                listener({ current: this.currentroute });
            } catch (e) {
                // console.log("Listener error:", e);
            }
        });

        // todo [REFACTOR]: check is obsolete
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

    addRouteListener(listener) {
        this.routeListeners.push(listener);
        if (!this.currentroute) return;
        // if there is a current route invoke the listener immediately
        try {
            listener({ current: this.currentroute });
        } catch (e) {
            // console.log("Listener error:", e);
        }
    }

    removeRouteListener(listener) {
        this.routeListeners = this.routeListeners.filter(rlistener => rlistener !== listener);
    }

    //
    // app structure
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

    route(route, routeSpecOrHandler) {
        route = parseRoute(route);
        let handler = isFunction(routeSpecOrHandler) ? routeSpecOrHandler : ({ path, route, ids, origin }) => this.followRoute({ path, route, ids, origin }, routeSpecOrHandler);

        this.routes.push({ route, handler });
    }

    /**
     *
     * @param path
     */

    matchRoute(pathname) {
        if (!pathname) return;
        if (!Array.isArray(pathname) && pathname.startsWith('/')) pathname = pathname.substring(1);
        const path  = Array.isArray(pathname) ? pathname : parseRoute(pathname);
        let matches = this.routes.filter(item => item.route.length === path.length);
        let i       = 0;

        path.forEach((part) => {
            matches = this.matchingRoutes(i++, part, matches);
        });
        if (matches.length === 0) return;

        // well, take the first route found
        const match = matches[0];

        // map variables
        const ids   = {};
        const route = match.route;
        for (i in route) {
            const part = route[i].trim();
            if (! part.startsWith('{')) continue;
            let id = part.slice(1,-1);
            ids[id] = path[i];
        }

        return { ids, handler: match.handler, route: match.route };
/*
        let match = this.routes.find((item) => pathname.match(item.rx));
        if (!match) return;
        let vals = [...pathname.match(match.rx)];    // refactor
        vals.shift();    // drop first element, it contains to whole path
        let ids = {};
        for (let i in vals) {
            ids[match.ids[i]] = vals[i];
        }
        return { ids, handler: match.handler, rx: match.rx, route: match.route };
*/
    }

    matchingRoutes(i, part, routes) {
        const matches = routes.filter((item) => item.route[i] === part || item.route[i]?.startsWith('{'));
        return matches;
    }

    // used by links with route (AuroraList, NavItem)
    // todo [REFACTOR]: simplify this method
    getRouteFor(pathname) {
        if (!pathname) return;
        if (pathname.startsWith('/')) {
            const path  = parseRoute(pathname.substring(1));
            let matches = this.routes.filter(item => item.route.length === path.length);
            let i       = 0;
            path.forEach((part) => {
                matches = this.matchingRoutes(i++, part, matches);
            });
            if (matches.length === 0) return;

            // well, take the first route found
            const match = matches[0];
            return { route: [...match.route], handler: match.handler };
        } else {
            // process relative route
            const path  = parseRoute(pathname);
            const curr  = parseRoute(this.currentroute);
            let route   = [...path];
            if (route[0] === '.') route.shift();     // remove selector
            const stop   = route[0];
            const prefix = [];
            let part     = curr.shift();
            while (part && part !== stop) {
                prefix.push(part);
                part = curr.shift();
            }
            route = [...prefix, ...route];
            let matches = this.routes.filter(item => item.route.length === route.length);
            let i       = 0;
            route.forEach((part) => {
                matches = this.matchingRoutes(i++, part, matches);
            });
            if (matches.length === 0) return;
            const match = matches[0];
            return { route: [...route], handler: match.handler };
        }

    }

    buildRelativeRoute(pathname) {
        if (pathname.startsWith('/')) return parseRoute(pathname.substring(1));
        const path   = parseRoute(pathname);
        const curr   = parseRoute(this.currentroute);
        let route    = [...path];
        if (route[0] === '.') route.shift();     // remove selector
        const stop   = route[0];
        const prefix = [];
        let part     = curr.shift();
        while (part && part !== stop) {
            prefix.push(part);
            part = curr.shift();
        }
        route = [...prefix, ...route];
        return route;
    }

    // used by links with route (AuroraList, NavItem)
    buildRoute(pathname, ids) {
        Object.entries(ids).forEach(([name, val]) => pathname = pathname.replaceAll('{'+name+'}', val));
        return pathname;
    }

    buildFullRoute(path, params) {
        const ids = [...params];
        for (let i = 0; i < path.length; i++) {
            const part = path[i];
            if (part.startsWith('{')) path[i] = ids.shift()
        }
        return "/" + path.join('/');
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
