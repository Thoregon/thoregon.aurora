/**
 * Connects a model collection with a view collection
 *
 * Drives and communicates with the view collection by events.
 *
 * View model - View
 * =================
 *  View Model
 *  - provides items via an events
 *  View
 *  - answers if more items can be displayed now
 *  - todo: answer if prevoius items can be displayed
 *  - sends selection and action requests to the view model
 *
 * View Model - Model
 * ==================
 *  View Model
 *  - requests from the model where (which item) to start displaying
 *  - forwards action (and selection) events
 *  Model
 *  - provides items
 *
 * Plugins for View and Model
 * ==========================
 *  - translates between model and view model
 *  - special behavior for view model - view
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */
import ViewModel from "./viewmodel.mjs";

export default class CollectionViewModel extends ViewModel {

    constructor({
                    model,
                    modelRef,
                    query,
                    view,
                    behavior,
                    parent
                } = {}) {
        super({ model, modelRef, query, view, behavior, parent });
    }

    static async with({
                          model,
                          modelRef,
                          query,
                          view,
                          behavior,
                          parent
                      } = {}) {
        let vm = super.with({ model, modelRef, query, view, behavior, parent });
        vm.query = query;
        return vm;
    }

    set query(query) {
        this._query = query;
        // todo: handle update mutations
        query.addMutationListener((mutation) => this.mutation(mutation));
        // if (this.east) this.render();
        let ModelClass = ViewModel.selectVMClass(observable);
        if (!ModelClass) {
            this.logger.warn(`no responsible handler for ${className(observable)}`);
            return;
        }
        this._model = universe.observe(observable);
        this.west = new ModelClass(this);
        this.west.attachModel(observable);
        this.matchEastWest();
    }

    async mutation(mutation) {
        // implement by subclass
    }
}
