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
        this.constructor.actions = {};
    }

    matchEastWest() {
        return super.matchEastWest();
    }

    attachView(view) {
        return super.attachView(view);
    }

    //
    // ACTIONS
    //

    registerAction( actionspec, set = "default" ) {
        if ( ! this.constructor.actions[set] ) {
            this.constructor.actions[set] = {};
        }
        this.constructor.actions[set][ actionspec.name ] = actionspec;
    }

    getActions( set = "default" ) {
        let result = {
            'all'      : [],
            'primary'  : [],
            'secondary': []
        }

        let actions = Object.values( this.constructor.actions[set] ?? [] );

        for (let i = 0; i < actions.length; i++) {
            let action  = actions[i];
            let sortkey = String(action.order ).padStart(3, '0') + action.label + action.name;
            switch (action.priority ) {
                case 1:
                    result.primary[ sortkey ] = action;
                    break;
                case 2:
                default:
                    result.secondary[ sortkey ] = action;
                    break;
            }
        }

        //--- sort each pocket  ---

        //--- load in sort sequence  ---
        result.primary   = Object.values(result.primary);
        result.secondary = Object.values(result.secondary);

        //--- combine in ALL pocket  ---
        result.all = [ ...result.primary, ...result.secondary ];

        return result;
    }


    isActionAvailable( object, action ) { return true; }
    isActionDisabled( object, action ) { return false; }

}
