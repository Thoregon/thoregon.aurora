/**
 *  subclass to implement an app base seamless
 *
 *  an aurora app is always embedded in another element.
 *  if standalone the element is an AppEnvelop
 *
 * @author: Bernhard Lukassen
 */
import { ErrNotImplemented } from "../errors.mjs";

export default class AuroraApp {

    async connectUI(uielement) {
        this.ui = uielement;
        let main = this.mainComponentName;
        let mainComponent = this.uiComponents[main];

    }

    /**
     * implement by subclass
     */
    get uiComponents() {
        throw ErrNotImplemented('uiComponents');
    }

    /**
     * implement by subclass
     */
    get mainComponentName() {
        throw ErrNotImplemented('mainComponentName');
    }

    async componentBehavior(element) {

    }

}
