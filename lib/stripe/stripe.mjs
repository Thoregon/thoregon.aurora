/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import AuroraElement   from "../auroraelement.mjs";
import { loadStripe }  from './ext/stripe.esm.js';
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

let stripeapi;

export default class Stripe extends AuroraElement {

    constructor() {
        super();
        this._complete = false;
    }

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-stripe';
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
                inlinenotify     : {
                    default      : true,
                    type         : 'boolean',
                    description  : 'show stripe messages within the element',
                    group        : 'Spec',
                    example      : 'true | false'
                },
                'publishable-key': {
                    default      : '',
                    type         : 'string',
                    description  : 'payment method',
                    group        : 'Spec',
                    example      : 'pk_jegrebo2t80z1io45h'
                },
                'payment-method' : {
                    default      : 'card',
                    type         : 'string',
                    description  : 'payment method',
                    group        : 'Spec',
                    example      : 'card | iban'
                },
                'element'  : {
                    default      : 'card',
                    type         : 'string',
                    description  : 'Presentation form of the input fields',
                    group        : 'Spec',
                    example      : 'card | iban | cardNumber | cardExpiry | cardCvc'
                },
                slotwidth  : {
                    default      : '100%',
                    type         : 'string',
                    description  : 'the width of the slow in case it does not autofit to parent div',
                    group        : 'Spec',
                    example      : '10px'
                }
                /*
                                'stripe-reference' : {
                                    // default      : '',
                                    type         : 'string',
                                    description  : 'reference to the same stripe element',
                                    group        : 'Spec',
                                    example      : ''
                                },
                                slotname         : {
                                    // default    : '',
                                    type         : 'string',
                                    description  : 'name of the slot used to mount the stripe elements',
                                    group        : 'Spec',
                                    // example      : 'stripe-slot-h4565jzm6k67ewj565'
                                },
                */
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
            case 'element':
                this.useElement(newValue);
                break;
            case 'payment-method':
                this.useMethod(newValue);
                break;
            case 'publishable-key':
                this.usePublishableKey(newValue);
                break;
            default:
                super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    get componentConfiguration() {
        return {
            theme            : 'material',
            component        : 'stripe',
            templates        : ['stripe'],
        }
    }

    get appliedTemplateName() {
        return 'stripe';
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

    get publishableKey() {
        if (!this._pk) {
            const pk = this.getAttribute("publishable-key");
            if (pk != undefined && pk != '') this._pk = pk;
        }
        return this._pk;
    }

    async usePublishableKey(pk) {
        this._pk = pk;
    }

    get inlinenotify() {
        return this.getAttribute("inlinenotify") === 'true';
    }

    set inlinenotify(state) {
        this.setAttribute("inlinenotify", state);
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

    get element() {
        if (!this._element) {
            const element = this.getAttribute("element")
        }
        return this._element ? this._element : "card";
    }

    useElement(element ) {
        this._element = element;
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

    /**
     * must be called from outside with a publishable key
     *
     * @param publishableKey
     * @returns {Promise<*>}
     */
    static async getStripeAPI(publishableKey) {
        if (!stripeapi) stripeapi = await loadStripe(publishableKey);
        return stripeapi;
    }

    start() {

        if (this.stripeElement) return;  // already started
        (async () => {
            if (!stripeapi) {
                console.log("$$ StripeElement: stripe API not available. init with 'StripeElement.getStripeAPI(publishableKey)' first");
                return;
            }

            const method = this.element;
            if (!method) return;
            const slot = this.container.querySelector('slot');
            const slotstyle = {
                width: this.propertiesValues().slotwidth,
            };

            slot.setAttribute('name', this.slotname);
            this.mountcontroller = MountController.forHost(this, this.slotname, slotstyle);
            const elements = stripeapi.elements();
            let options = { style };
            if (method === 'iban') options.supportedCountries = ['SEPA'];
            let methodelement = elements.create(method, options );
            this.stripeElement = methodelement;
            const mountpoint = this.mountcontroller.mount;
            methodelement.mount(mountpoint);
            methodelement.on('change', (event) => {
                if (event.error) {
                    if (this.inlinenotify) this.showError(event.error.message);
                    this.checkStripeError(event);
                } else {
                    if (this.inlinenotify) this.showMessage("");
                    this.checkStripeEvent(event);
                }
            });

        })();
    }

    checkStripeError(event) {
        if (!event.error) return;
        this._complete = false;
        const evt = { brand: event.brand, type: event.elementType, value: event.value, error: event.error };
        this.emit('error', evt);
    }

    checkStripeEvent(event) {
        if (!event.complete && !this._complete) return;
        this._complete = event.complete;
        const evt = { complete: event.complete, brand: event.brand, type: event.elementType, value: event.value };
        this.emit('complete', evt);
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

Stripe.defineElement();
