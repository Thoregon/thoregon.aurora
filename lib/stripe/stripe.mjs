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
        return [...super.observedAttributes, 'active', 'method'];
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
                'card-elements'  : {
                    default      : 'card',
                    type         : 'string',
                    description  : 'Presentation form of the input fields',
                    group        : 'Spec',
                    example      : 'card | '
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

    getDefaultWidth() { return '300px'; }

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

    busy() {
        this.behavior.busy();
    }

    ready() {
        this.behavior.ready();
    }

    //
    // Stipe
    //

    static async getStripeAPI(publishableKey) {
        if (!stripeapi) stripeapi = await loadStripe(publishableKey);
        return stripeapi;
    }

    async getStripeAPI() {
        return this.constructor.getStripeAPI(this.publishableKey);
    }

    start() {
        if (this.stripeElement) return;  // already started
        (async () => {
            await this.getStripeAPI();
            const method = this.method;
            if (!method) return;
            const slot = this.container.querySelector('slot');
            slot.setAttribute('name', this.slotname);
            this.mountcontroller = MountController.forHost(this, this.slotname);
            const elements = stripeapi.elements();
            var options = { style };
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
