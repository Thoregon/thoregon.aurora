/**
 *
 *
 * @author: Bernhard Lukassen
 */
import ViewModel from "./viewmodel.mjs";
// import PropertyViewModel from "./propertyviewmodel.mjs";
// import ActionViewModel from "./actionviewmodel.mjs";

export default class ViewModelBuilder {

    constructor() {
        this.properties = [];
        this.actions    = [];
    }

    /**
     * this defines the root element
     * @param uielement
     */
    use(uielement) {
        this.root = uielement;
        // crawl all child elements including this with a name and match it with an Observable
        // match -> name.asIdentifier().toLowerCase()
    }

    // addProperty(propertypath, viewselector) {
    //     this.properties.push({ propertypath, viewselector });
    //     return this;
    // }

    // addAction(actionfn, viewselector) {
    //     this.actions.push({ actionfn, viewselector });
    //     return this;
    // }

    from(viewmodeldef) {
        // todo [OPEN]: view model as JSON
        return this;
    }

    observe(observable) {
        let vm = ViewModel.observe(observable);
        vm.root = this.root;

        vm.properties = this.properties
            .map(({ propertypath, viewselector }) => new Propertyitem(vm, propertypath, viewselector));
        // vm.actions = this.actions
        //     .map(({ actionfn, viewselector }) => ActionViewModel(vm, actionfn, viewselector));

        return vm;
    }
}
