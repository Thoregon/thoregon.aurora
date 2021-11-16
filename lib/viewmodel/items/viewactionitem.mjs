/**
 * decorator for action items which users can trigger
 *
 * @author: Bernhard Lukassen
 */

export default class ViewActionItem {

    constructor(vmitem) {
        this.vmitem = vmitem;
        this.triggerHandler = async (evt) => this.actionTriggered(evt);
    }

    attachView(view) {
        const triggerView = this.vmitem.view;
        let eventname = triggerView.tiggerEventName || 'click';
        triggerView.addEventListener(eventname, this.triggerHandler);
        // triggerView.addEventListener('action', async (evt) => this.actionTriggered(evt));
        return this;
    }

    dispose() {
        const triggerView = this.vmitem.view;
        let eventname = triggerView.tiggerEventName || 'click';
        triggerView.addEventListener(eventname, this.triggerHandler);
    }

    async actionTriggered(evt) {
        if (!await this.validate(evt)) return;
        // only trigger action if validation id OK
        if (evt.target) {

        }
        let result = await this.vmitem.triggerAction(evt, this);
        // todo: route link?
    }


    /*
     * Validations
     */

    validate(evt) {
        // validation level 'transaction'
        let name = evt.target.auroraname || evt.target.name || evt.target.id;
        // universe.logger.info(`ViewActionItem > 'transaction' validation, name '${name}'`);
        // todo [OPEN]: do more in-depth and coherent validations. send up to the viewmodel itself

        return true;
    }

}
