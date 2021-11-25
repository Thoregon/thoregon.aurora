/*
 * Copyright (c) 2021.
 */

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
    matchEastWest() {
        return super.matchEastWest();
    }

    attachView(view) {
        return super.attachView(view);
    }

    isActionAvailable( object, action ) { return true; }
    isActionDisabled( object, action ) { return false; }

}
 