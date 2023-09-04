/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import ThemeBehavior from "../../themebehavior.mjs";

export default class MaterialStripe extends ThemeBehavior {

    attach(jar) {
        this.jar       = jar;
        this.container = this.jar.container;
    }

    activate() {
        const buttonpay = this.container.querySelector('#buttonpay');
        buttonpay.addEventListener('click', (evt) => this.startPayment());
    }

    getPaymentElementEnvelope() {
        const envelope = this.container.querySelector('#paymentelement')
        return envelope;
    }

    setMessage(message) {
        const messageelement = this.container.querySelector('#message');
    }

    getProgressIndicator() {
        const progressIndicator = this.container.querySelector('.progress');
        return progressIndicator;
    }

    busy() {
        this.getProgressIndicator().style.visibility = 'visible';
    }

    ready() {
        this.getProgressIndicator().style.visibility = 'hidden';
    }

    getMessageBox() {
        const messagebox =  this.container.querySelector('.message');
        return messagebox;
    }

    messageBoxError(state) {
        state
            ? this.getMessageBox().classList.add('error')
            : this.getMessageBox().classList.remove('error');
    }

    showMessage(message) {
        this.messageBoxError(false);
        this.getMessageBox().innerText = message;
    }

    showError(message) {
        this.messageBoxError(true);
        this.getMessageBox().innerText = message;
    }

}
