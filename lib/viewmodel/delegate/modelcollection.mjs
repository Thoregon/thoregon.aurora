/**
 * View Model for Collections
 *
 * @author: Bernhard Lukassen
 */
import ViewModel                from "../viewmodel.mjs";
import ModelDelegate            from "./modeldelegate.mjs";

export default class ModelCollection extends ModelDelegate {

    static observes(observable) {
        return Array.isArray(observable);
    }

}

ViewModel.add2factoryRegister(ModelCollection);
