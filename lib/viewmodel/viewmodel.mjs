/**
 * A view model connects a view with a (entity) model, where
 * - west side  ... model
 * - east side  ... view
 * - inner      ... behavior
 *
 * The hierarchy - nested objects, nested views - can be different
 *      match automatically
 *      specify match
 *      multiple matches object - view
 * dynamically opened views
 * view builder
 *      generates (aurora) elements
 *      generated mockups
 *
 * todo [OPEN]: headless tesing w/o view. there are no comfort features available. e.g. use mockups for view elements
 * todo [OPEN]: build default view from model, mixed views (part defined, part generated from model)
 * todo [OPEN]: collaboration features
 *  - Someone is editing the same entity or field
 *  - data events: mutations of values
 *  - control events: someone enters/leaves editing; later: someone starts/ends observing, caution: this may cause heavy network load
 *
 * @author: Bernhard Lukassen
 */

import { className }                from "/evolux.util";
import { Reporter }                 from "/evolux.supervise";
import ViewItem                     from "./items/viewitem.mjs";

const factoryregistry = [];

export default class ViewModel extends Reporter(Object) {

    constructor({
                    model,
                    view,
                    behavior
                } = {}) {
        super();
        this._eventlisteners = [];
        Object.assign(this, { model, view, behavior });
    }

    /**
     * implement by subclasses,
     * answer true if the class can observe the object
     * @param observable
     */
    static observes(observable) {
        return false;
    }

    static selectVMClass(observable) {
        return factoryregistry.find(cls => cls.observes(observable));
    }

    /**
     * register your subclass to be selectable.
     * add the class as first item to be asked.
     * todo [OPEN]: add a remove fn
     * @param vmclass
     */
    static add2factoryRegister(vmclass) {
        factoryregistry.unshift(vmclass);
    }

    /*
     * Behavior: Inner
     */
    set behavior(behavior) {
        this._inner = behavior;
    }

    matchEastWest() {
        if (this.mapping) return;   // todo [OPEN]: dynamic view/model changes
        if (!this.east || !this.west) return;

        this.mapping = {};
        this.vmitems.forEach(vmitem => {
            let identifier = vmitem.identifier;
            let modelitem = this.west.attachIdentifier(identifier);
            if (modelitem) this.mapping[identifier] = { vmitem, modelitem };
        });
    }

    /*
     * Model: West Side
     */
    set model(observable) {
        if (!observable) return;
        let ModelClass = ViewModel.selectVMClass(observable);
        if (!ModelClass) {
            this.logger.warn(`no responsible handler for ${className(observable)}`);
            return;
        }
        this.west = new ModelClass(this);
        this.west.attachModel(observable);
        this.matchEastWest();
    }

    // todo [REFACTOR]: the mutation of the model emits again an event which causes a loop. this loop is broken because both sides chech if the new value is different. check if we can stop earlier
    toEast(mutation) {
        // this.logger.info('toEast');
        let m = this.mapping[mutation.identifier];
        if (m) m.vmitem.mutate(mutation);
    }

    toWest(mutation) {
        // this.logger.info('toWest');
        let m = this.mapping[mutation.identifier];
        if (m) m.modelitem.mutate(mutation);
    }

    /*
     * View: East Side
     */
    set view(view) {
        if (!view) return;
        this.east = view;
        this.attachView(view);
        this.matchEastWest();
    }

    attachView(view) {
        let viewElements = view.viewElements;
        this.vmitems = viewElements.map(viewElement => ViewItem.itemFor(viewElement, this).attachView(view));
    }

    viewMutated(mutations) {
        this.logger.info('view mutations');
    }

    /*
     * event listeners
     */

    addEventListener
}
