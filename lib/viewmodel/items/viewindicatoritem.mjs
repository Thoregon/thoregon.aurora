/**
 * decorator for action items which users can trigger
 *
 * @author: Bernhard Lukassen
 */

export default class ViewActionItem {

    constructor(vmitem) {
        this.vmitem = vmitem;
    }

    attachView(view) {
        const indicatorView = this.vmitem.view;
        return this;
    }

    /*
     * Validations
     */

    get status() {
        return this.vmitem.viewModel.errors;
    }

}
