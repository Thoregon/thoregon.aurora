/**
 * decorator for action items which users can trigger
 *
 * @author: Bernhard Lukassen
 */

export default class ViewItemActions {

    constructor(vmitem) {
        this.vmitem = vmitem;
        this.triggerHandler = async (evt) => this.actionTriggered(evt);
    }

    attachView(view) {
        const triggerView = this.vmitem.view;
        let eventname = triggerView.actionsTiggerEventName || 'item-actions';
        triggerView.addEventListener(eventname, this.triggerHandler);
        // triggerView.addEventListener('action', async (evt) => this.actionTriggered(evt));
        return this;
    }

    dispose() {
        const triggerView = this.vmitem.view;
        let eventname = triggerView.actionsTiggerEventName || 'item-actions';
        triggerView.addEventListener(eventname, this.triggerHandler);
    }

    async actionTriggered(evt) {
        evt.stopPropagation();
        if (!await this.validate(evt)) return;
        // only trigger action if validation id OK
        if (evt.target) {

        }
        let result = await this.vmitem.triggerItemActions(evt, this);
        // todo: route link?
    }


    /*
     * Validations
     */

    validate(evt) {
        // validation level 'transaction'
        // universe.logger.info(`ViewActionItem > 'transaction' validation, name '${name}'`);
        // todo [OPEN]: do more in-depth and coherent validations. send up to the viewmodel itself

        return true;
    }

}
