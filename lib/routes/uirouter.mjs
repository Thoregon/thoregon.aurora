/**
 *
 * todo [OPEN]:
 *  - support multiple app roots to enable UI meshups
 *  - parse also query params after '?' of url
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import { timeout, doAsync } from '/evolux.universe';

import View           from "/thoregon.aurora/lib/viewspec/view.mjs";
import { isFunction } from "/evolux.util/lib/objutils.mjs";
import { parseRoute } from "/evolux.util/lib/formatutils.mjs"
import en from "../formating/dayjs/locale/en.js";

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

        this.blueprintQ            = [];

        this.viewState             = {};

        this.activeRoute           = undefined;
    }

    get privateProperties$() {
        return ['routes', 'options', 'routeSources', 'routeListeners', 'blueprintQ', 'viewState', 'activeRoute', 'currentroute', 'app', 'appelement', 'urlrouter'];
    }

    noDeepListeners$() {
        return true;
    }

    pop(event) {
        console.log(event);
        let state   = event.state;
        if (!state) return true;
        let route = state?.current ?? dorifer.urlrouter.extractRoute(window.location);
        if (!route) return false;
        this.routePath0(route);
        return true;
    }

    back() {
        history.back();
    }

    get interfaceSettings() {
        return this.app?.interfaceSettings ?? {};
    }

    applyInterfaceSettings(app) {
        let url = new URL(document.location.href);
        if (url.hash.indexOf("?") > -1) url = new URL("http://127.0.0.1/" + url.hash.substring(1));
        let params = url.searchParams;
        let intSettings = app.interfaceSettings;
        for (let [name, value] of params) {
            intSettings[name] = value;
            // if (name.startsWith("intf-")) {
            //    name = name.substring(5);
            //    if (intSettings[name]) intSettings[name] = value;
            // }
        }
    }

    async restore() {
        const route = dorifer.urlrouter.extractRoute(window.location);
        if (!route) return;
        await this.routePath0(route);
    }

    get currentView() {
        return currentView
    }

    //
    // blueprint control API
    //

    get blueprint() {
        return this.getBlueprint();
    }

    getBlueprint() {
        const appelement = this.appelement;
        return appelement.getBlueprint();
    }

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

    async setDefaultBlueprintConfiguration(blueprintConfiguration) {
        await this.wait4blueprint();
        const appelement = this.appelement;
        const blueprint  = appelement.getBlueprint();
        blueprint.setDefaultConfiguration(blueprintConfiguration);
    }

    async blueprintConfiguration( config, defaultConfig ) {
        await this.wait4blueprint();
        const appelement = this.appelement;
        const blueprint  = appelement.getBlueprint();
        blueprint.setConfiguration( config, defaultConfig );
    }

    blueprintReady() {
        const q = this.blueprintQ;
        this.blueprintQ = undefined;
        for (const fn of q) {
            fn();
        }
    }

    /*async*/ wait4blueprint() {
        return new Promise((resolve, reject) => {
            if (this.blueprintQ == undefined) {
                resolve();
                return;
            }
            this.blueprintQ.push(resolve);
        })
    }

    //
    // redirects and requests
    //

    request(route) {
        const location = window.location;
        this._requestFrom = window.location.href;
        if (route.startsWith('/')) route = route.substring(1);
        let url = `${location.origin}${location.pathname}#${route}`;
        this.redirect(url);
        window.location.reload();
        return url;
    }

    redirect(url) {
        if (url) {
            history.replaceState({ current: window.location.href, title: window.document.title }, "", url);
            window.location.replace(url);
        }
    }

    redirectFromWidget(url) {
        this.appelement.emitWidgetEvent({ type: 'redirect', url });
    }

    //
    // routes API
    //

    handleViewStateChange(target, view, ref) {
        let entry = this.viewState[target];
        if (!entry) entry = this.viewState[target] = {};
        if (entry.view === view &&
            entry.ref === JSON.stringify(ref ?? {})) return false;

        const currentTargetView = entry?.viewElement;
        if (currentTargetView) try { currentTargetView.dispose(); } catch (ignore) { /* log */ }

        entry.view = view;
        entry.ref  = JSON.stringify(ref ?? {});
        delete entry.viewElement;

        return true;
    }

    registerViewForTarget(target, viewElement) {
        let entry = this.viewState[target];
        if (!entry) return;
        entry.viewElement = viewElement;
    }

    async showView(route, appelement) {
        if (!route || route.is_empty) return;

        await this.wait4blueprint();
        let { ref, target, view, elementid } = route;

        appelement = appelement || this.appelement;

        //--- if the view exists already - no need to render it again
        if (!this.handleViewStateChange(target, view, ref)) return;

        // r contains the entity, t ... target, v ... view path
        const blueprint     = appelement.getBlueprint();

        // create view
        const fragmentid  = elementid;
        const appuiroot   = appelement.getAppViewRoot();
        const viewElement = await View.from(view, appuiroot);

        const title         = viewElement.name;

        blueprint.renderViewInTarget(target, viewElement, ref, fragmentid);

        // finalize
        this.registerViewForTarget(target, viewElement);
        if (elementid) blueprint.positionToElement(elementid);  // todo EP-10 [OPEN]: doesn't work because the element is not rendered at this moment
        await this.viewWasRendered(route, appelement);

        return title;
/*
        const appuiroot     = appelement.getAppViewRoot();
        // get view, style, viewmodel (behavior)
        const viewElement   = await View.from(view, appuiroot);
        const title         = viewElement.name;
        // get target
        const targetElement = appelement.getBlueprintElementWithName(target);
        if (!targetElement) {
            console.log("No view target found!", route);
            return;
        }
        // render template
        await viewElement.render(targetElement, ref);
        viewElement.addRenderFn(() => this.getBlueprint().contentChanged());
        this.registerViewForTarget(target, viewElement);
        if (elementid) blueprint.positionToElement(elementid);  // todo EP-10 [OPEN]: doesn't work because the element is not rendered at this moment
        // no error, now notify route sources
        this.viewWasRendered(route, appelement);

        return title;

        */
    }

    async followRoute({ path, route, ids, origin, target } = {}, routeSpec) {
        debugger;
        // analyze the route
    }

    async routePath0(route, wintarget = false, origin) {
        let routematch = this.matchRoute(route);
        let blueprint = this.appelement.getBlueprint();
        if (!routematch && blueprint) {
            const view = blueprint.getDefaultView();
            routematch = this.matchRoute('/'+view);
            await timeout(300);
        }

        // todo [OPEN]: get title
        if (routematch) {
            this.activeRoute = routematch;
            if (wintarget) {
                const url = dorifer.urlrouter.routeForHistory(route);
                window.open(url, wintarget);
            } else {
                this.currentroute = Array.isArray(route) ? route.join('/') : route;
                routematch.handler({ path       : route, route    : routematch.route, ids      : routematch.ids, origin   : !!origin, elementid: routematch.elementid }, blueprint, this);
            }
            return true;
        }
        return false;
    }

    async routePath(route, wintarget = false, { withHistory = true, params } = {}) {
        if (!route) return;

/*
        //    TODO: issue-6   ( EP-6 )
        //--- this is not working right now....
        //    - the #anchor is not shown in the url
        //    - positionToElement was not working

        //    - Issue with the if else  - in case the anchor stays the same but the route is changing it will not work

        const regex = /#(\w+-*\w*)$/; // regular expression to match hashtag at end of string
        const anchor = route.match(regex); // check if there is a match
        if (anchor) {
            let blueprint = this.appelement.getBlueprint();
            blueprint.positionToElement( anchor[0] );
        } else {
            runtime.history.pushState({ current: route, title: route }, route, dorifer.urlrouter.routeForHistory(route));
            this.routePath0(route, origin);
        }
*/
        const i = route.lastIndexOf('#');
        if (i > -1 && route.startsWith(this.baseCurrentRoute())) {
            // this.currentRouteWithElem(route);
            const elementid = route.substring(i+1);
            let blueprint = this.appelement.getBlueprint();
            blueprint.positionToElement(elementid);
            this.invokeRouteListeners();
        } else {
            if (withHistory) runtime.history.pushState({ current: route, title: route }, route, dorifer.urlrouter.routeForHistory(route));
            this.routePath0(route, wintarget);
        }

    }

    baseCurrentRoute() {
        let i = this.currentroute.lastIndexOf('#');
        return (i > -1)
                ? this.currentroute.substring(0, i)
                : this.currentroute
    }

    currentRouteWithElem(route) {
        runtime.history.pushState({ current: route, title: route }, route, dorifer.urlrouter.routeForHistory(route));
        this.currentroute = Array.isArray(route) ? route.join('/') : route;
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
        this.invokeRouteListeners();

        // todo [REFACTOR]: check is obsolete
        let { r, t, v, l } = route;
        const elems = this.getSource4Route(route);
        for (const elem of elems) {
            if (elem.targetShowsView) elem.targetShowsView(route);
        }
    }

    invokeRouteListeners() {
        // invoke insteners
        this.routeListeners.forEach(listener => {
            try {
                listener({ current: this.currentroute });
            } catch (e) {
                // console.log("Listener error:", e);
            }
        });
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

    route(route, routeSpecOrHandler, context = {}) {

        route = parseRoute(route);
        let handler = isFunction(routeSpecOrHandler) ? routeSpecOrHandler : ({ path, route, ids, origin }) => this.followRoute({ path, route, ids, origin }, routeSpecOrHandler);

        this.routes.push({ route, handler, context });
    }

    /**
     *
     * @param path
     */

    matchRoute(pathname) {
        if (!pathname) return;
        if (Array.isArray(pathname)) pathname = '/' + pathname.join('/');
        const p = pathname.lastIndexOf('#');
        let elementid;
        if (p > -1) {
            elementid = pathname.substring(p+1);
            pathname = pathname.substring(0,p);
        }
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

        return { ids, handler: match.handler, route: match.route, elementid, context: match.context };
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

    replaceEntityRouteNewWithRef(modelRef) {
        const cur = this.currentroute;
        const route = cur.replace('/new', `/${modelRef}`);
        if (route === cur) return;
        runtime.history.replaceState({ current: route, title: route }, route, dorifer.urlrouter.routeForHistory(route));
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
