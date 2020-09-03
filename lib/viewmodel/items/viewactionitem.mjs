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
        const triggerView = this.vmitem.view;
        triggerView.addEventListener('click', async (evt) => this.actionTriggered(evt));
        return this;
    }

    async actionTriggered(evt) {
        if (!await this.validate(evt)) return;
        // only trigger action if validation id OK
        this.vmitem.triggerAction(this, evt.target.value);
    }


    /*
     * Validations
     */

    validate(evt) {
        // validation level 'transaction'
        let name = evt.target.auroraname || evt.target.name || evt.target.id;
        universe.logger.info(`ViewActionItem > 'transaction' validation, name '${name}'`);
        // todo [OPEN]: do more in-depth and coherent validations. send up to the viewmodel itself

        return true;
    }

}
