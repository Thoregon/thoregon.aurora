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

export default class CollectionViewModel {

    constructor({
                    model,
                    view,
                    behavior,
                    text = "Fehlt"
                } = {}) {
        Object.assign(this, { model, view, behavior });
    }

    x(obj) {
        Object.assign(this, { text2: "2" },  obj);
    }
}
