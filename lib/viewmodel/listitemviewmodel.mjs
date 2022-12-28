/*
 *
 * @author: Martin Neitz
 */
import ViewModel from "./viewmodel.mjs";

export default class ListItemViewModel extends ViewModel {

    // object
    // query
    // columndefinition
    // action status

    constructor() {
        super();

    }

    //
    // traversing
    //

    get parentViewModel() { return this.parent }

    get parentModel() { return this.parentViewModel.model }

    //
    // debugging
    //

    matchEastWest() {
        return super.matchEastWest();
    }

    attachView(view) {
        return super.attachView(view);
    }

    dropElement( element, position ) {
        return;
    }

}
