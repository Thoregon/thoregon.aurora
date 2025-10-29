
/*
 * Copyright (c) 2021.
 */

/**
 * @author: Martin Neitz
 */

import AuroraFormElement from "../formcomponents/auroraformelement.mjs";
import QRCode from "./qrcodegenerator.mjs";

export default class AuroraQRCode extends AuroraFormElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-qrcode';
    }

    /*
     * aurora element features
     */

    constructor() {
        super();
        this._qrcontent = this.textContent;
    }

    static get observedAttributes() {
        return [...super.observedAttributes, 'content'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'content' :
                this.propertiesValues()['content'] = newValue;
                this.buildQRCode();
                break;
        }
        return super.attributeChangedCallback(name, oldValue, newValue);
    }


    // theme ... component... templates

    get componentConfiguration() {
        return {
            theme: 'material',
            component: 'component-qrcode',
            templates: ['qrcode'],
        }
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            options: {
                default:        '',
                type:           'string',
                description:    'is are styling options',
                group:          'styling',
                example:        'dots...'
            },
        });
    }

    propertiesAsBooleanRequested() {
        //--- check if icon or image url ----
        return {};
    }

    getDefaultWidth() { return false; }

    /**
     *  routine to add all needed classes.
     *  This only can be done on the element level as it will be differ from element to element
     */
    collectClasses() {
        //--- 1: first get the classes added from the dom element
        //--- 2: analyse the transferred attributes
        let classes = super.collectClasses();
        let propertiesValues = this.propertiesValues();

        return classes;
    }

    async adjustContent(container) {
        container.classList.add("aurora-qrcode-wrapper");
    }

    get appliedTemplateName() {
        return 'qrcode';
    }

    use(obj, attr) {
        this.input.setAttribute('value', obj[attr]);
    }

    connectedCallback() {
        super.connectedCallback();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('click', this._clickhandler);
    }

    async existsConnect() {
        super.existsConnect();

        this.buildQRCode();
        this.behavior.attach(this);

    }

    buildQRCode() {
        let propertiesValues = this.propertiesValues();

        let qrcode = new QRCode({
            content: this._qrcontent,
            padding: 4,
            width: 100,
            height: 100,
            color: "#3d505a",
            background: "#f1f0dc",
            ecl: "M"
        });

        this.container.innerHTML = qrcode.svg();
    }
}

AuroraQRCode.defineElement();
