/**
 *
 *
 * @author: Bernhard Lukassen
 */

export default class ModelDelegate {

    constructor(viewModel) {
        this.viewModel = viewModel;
    }

    /**
     * answer true if the class can observe the object
     * implement by subclass
     *
     * @param observable
     * @return {boolean}
     */
    static observes(observable) {
        return false;
    }

    attachModel(model) {
        this.model = model;
    }

    attachIdentifier(identifier) {
        // implement by subclasses
    }

    async mutate(mutation) {
        // implement by subclasses
    }

    async mutated(mutation) {
        await this.viewModel.toEast(mutation);
    }

}
