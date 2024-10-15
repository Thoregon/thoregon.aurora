/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import AuroraElement   from "../auroraelement.mjs";
import MountController from "../lightDOM/mountcontroller.mjs";

const style = {
    base: {
        fontFamily: '"Inter var", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "18px",
        width: '100%',
        border: '1px solid red',
        color: 'blue',
    },
    invalid: {
        fontFamily: '"Inter var", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, sans-serif',
        color: "#fa755a",
        iconColor: "#fa755a"
    }
};

export default class Paypal extends AuroraElement {

    constructor() {
        super();
        this._complete = false;
    }

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-paypal';
    }

    static get observedAttributes() {
        return [...super.observedAttributes, 'active', 'method', 'element'];
    }

    propertiesDefinitions() {
        let parentPropertiesDefinitions = super.propertiesDefinitions();
        return {
            ...parentPropertiesDefinitions,
            ...{
                active           : {
                    default      : false,
                    type         : 'boolean',
                    description  : 'activate or deactivate',
                    group        : 'Spec',
                    example      : 'true | false'
                },
                busy             : {
                    default      : true,
                    type         : 'boolean',
                    description  : 'during payment',
                    group        : 'Spec',
                    example      : 'true | false'
                },
                'clientid': {
                    default      : '',
                    type         : 'string',
                    description  : 'clientid',
                    group        : 'Spec',
                    example      : 'pk_jegrebo2t80z1io45h'
                },
/*
                'amount': {
                    default      : '',
                    type         : 'integer',
                    description  : 'amount for payment',
                    group        : 'Spec',
                    example      : '100'
                },
*/
                'payment-method' : {
                    default      : 'paypal',
                    type         : 'string',
                    description  : 'payment method',
                    group        : 'Spec',
                    example      : 'papal | pay-later'
                },
                slotwidth  : {
                    default      : '100%',
                    type         : 'string',
                    description  : 'the width of the slow in case it does not autofit to parent div',
                    group        : 'Spec',
                    example      : '10px'
                }
            }
        };
    }

    async applyContent(container) {
        return super.applyContent(container);
    }

    // get stripeReference() {
    //     return this.getAttribute('stripe-reference');
    // }

    get slotname() {
        if (!this._slotname) this._slotname = /*this.stripeReference ??*/ `stripe-slot-${universe.random()}`;
        return this._slotname;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        let fn;
        switch (name) {
            case 'active':
                fn = (newValue === "true") ? () => this.start() : () => this.stop();
                this.addInitFn(fn);
                break;
            case 'busy':
                fn = (newValue === 'true') ? this.busy() : this.ready();
                this.addInitFn(fn);
                break;
            case 'payment-method':
                this.useMethod(newValue);
                break;
            case 'clientid':
                this.useClientId(newValue);
                break;
            default:
                super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    get componentConfiguration() {
        return {
            theme            : 'material',
            component        : 'paypal',
            templates        : ['paypal'],
        }
    }

    get appliedTemplateName() {
        return 'paypal';
    }

    collectClasses() {
        //--- 1: first get the classes added from the dom element
        //--- 2: analyse the transferred attributes
        let classes = [];
        let propertiesValues = this.propertiesValues();

        classes.push(propertiesValues['element']);

        return classes;
    }

    getDefaultWidth() { return '100%'; }

    async connect() {
        this.ready();
    }

    //
    // Attributes
    //

    get clientId() {
        if (!this._clientid) {
            const clientid = this.getAttribute("clientid");
            if (clientid != undefined && clientid != '') this._clientid = clientid;
        }
        return this._clientid;
    }

    useClientId(id) {
        this._clientid = id;
    }

    get active() {
        return this.getAttribute("active") === 'true';
    }

    set active(state) {
        this.setAttribute("active", state);
    }

    get method() {
        if (!this._method) {
            const pk = this.getAttribute("payment-method");

        }
        return this._method ? this._method : "card";
    }

    useMethod(method) {
        this._method = method;
    }

    busy() {
        this.behavior.busy();
    }

    ready() {
        this.behavior.ready();
    }

    //
    // Stipe
    //

    start() {

        if (this.paypalElement) return;  // already started
        if (!window.paypal) return; // paypal not loaded
        (async () => {
            this.paypalElement = true;
            const slot = this.container.querySelector('slot');
            const slotstyle = {
                width: this.propertiesValues().slotwidth,
            };

            slot.setAttribute('name', this.slotname);
            this.mountcontroller = MountController.forHost(this, this.slotname, slotstyle);
            // let paypalenvelop = document.querySelector('#paypal-button-container');
            const mountpoint = this.mountcontroller.mount;
            const handler = this;
            window.paypal.Buttons({
                      fundingSource: paypal.FUNDING.PAYPAL, // Display only the PayPal button
                      style: {
                          shape: 'rect',
                          //color:'blue', change the default color of the buttons
                          layout: 'vertical', //default value. Can be changed to horizontal
                          label: 'paypal',
                      },
                      async createOrder() {
                          try {
                              const order = await handler.requestPaypalOrder({});
                              // tood [OPEN]: display OK, disable paypal button ?
                              return order.id;
                          } catch (error) {
                              handler.reportPaypalError(error);
                          }
                      },
                      async onApprove(data, actions) {
                          try {
                              const paypalId = data.orderID;
                              const orderData = await handler.requestPaypalApprove({ paypalId });
                              const errorDetail = orderData?.details?.[0];

                              if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                                  // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                                  // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
                                  return actions.restart();
                              } else if (errorDetail) {
                                  // (2) Other non-recoverable errors -> Show a failure message
                                  throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
                              } else if (!orderData.purchase_units) {
                                  throw new Error(JSON.stringify(orderData));
                              } else {
                                  // (3) Successful transaction -> Show confirmation or thank you message
                                  // Or go to another URL:  actions.redirect('thank_you.html');
                                  const transaction =
                                            orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
                                            orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
                                  // resultMessage(
                                  //     `Transaction ${transaction.status}: ${transaction.id}<br><br>See console for all available details`,
                                  // );
                                  console.log(
                                      "Capture result",
                                      orderData,
                                      JSON.stringify(orderData, null, 2),
                                  );
                              }
                          } catch (error) {
                              handler.reportPaypalError(error);
                          }
                      },
                      onCancel(data){
                          const paypalId = data.orderID;
                          handler.reportPaypalCancel(paypalId, data);
                      },
                      async onError(error){
                          handler.reportPaypalError(error);
                      }
                  })
                  // .render("#paypal-button-container");
                  .render(mountpoint);
        })();
    }

    reportPaypalCancel(paypalId, data) {
        this._complete = false;
        delete this._onCreated;
        delete this._onApproved;
        const evt = { type: 'cancel', paypalId, data };
        this.emit('cancel', evt);
    }

    reportPaypalError(error) {
        if (!error) return;
        this._complete = false;
        delete this._onCreated;
        delete this._onApproved;
        const evt = { type: 'error', error };
        this.emit('error', evt);
    }

    requestPaypalOrder() {
        return new Promise((resolve, reject) => {
            console.log("-- Paypal Elem::requestPaypalOrder");
            const evt = { type: 'order', paypal: this };
            this._onCreated = { resolve, reject };
            this.emit('order', evt);
        });
    }

    async orderCreated(order) {
        if (!this._onCreated) {
            console.log("-- Paypal: create was not requested");
            return;
        }
        console.log("-- Paypal Elem::orderCreated", order);
        if (order.status !== 'CREATED') {
            this._onCreated.reject(order);
        } else {
            this._onCreated.resolve(order);
        }
    }

    async orderError(error) {
        this._onCreated?.reject(error);
    }

    requestPaypalApprove(data) {
        return new Promise((resolve, reject) => {
            console.log("-- Paypal Elem::requestPaypalApprove", data);
            const evt = { type: 'approved', paypalId: data.paypalId, paypal: this };
            this._onApproved = { resolve, reject };
            this.emit('approve', evt);
        });
    }

    async orderApproved(order) {
        if (!this._onApproved) {
            console.log("-- Paypal: approve was not requested");
            return;
        }
        console.log("-- Paypal Elem::orderApproved", order);
        if (order.status !== 'COMPLETED') {
            this._onApproved.reject(order);
        } else {
            this._onApproved.resolve(order);
        }
    }

    async approveError(error) {
        this._onApproved?.reject(error);
    }

    showMessage(message) {
        this.behavior.showMessage(message);
    }

    showError(message) {
        this.behavior.showError(message);
    }

    stop() {
        //
    }

    startPayment() {
        debugger;
    }

    getPaymentElementEnvelope() {
        return this.behavior.getPaymentElementEnvelope();
    }
}

Paypal.defineElement();
