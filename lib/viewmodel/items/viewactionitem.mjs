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
        this.vmitem.view.addEventListener('click', (evt) => this.actionTriggered(evt.target.value));
        return this;
    }

    actionTriggered(evt) {
        this.vmitem.triggerAction(this, evt);
    }

}
