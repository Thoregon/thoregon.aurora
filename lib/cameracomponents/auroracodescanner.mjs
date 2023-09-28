/**
 *
 * @see:
 *  - https://github.com/mebjas/html5-qrcode
 *  - https://scanapp.org/html5-qrcode-docs/docs/apis
 *  - https://github.com/scanapp-org/imagecodes
 *  - https://blog.minhazav.dev/research/html5-qrcode.html
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import AuroraCamElement from "./auroracamelement.mjs";
import MountController  from "../lightDOM/mountcontroller.mjs";
import scanner          from "../qrlib/html5-qrcode.min.mjs";

const Html5QrcodeScanner  = scanner.Html5QrcodeScanner;
const Html5QrcodeScanType = scanner.Html5QrcodeScanType;

export default class AuroraCodeScanner extends AuroraCamElement {

    constructor() {
        super();
    }

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-codescanner';
    }

    /*
     * API
     */

    start() {
        this.setAttribute('active', 'true');
    }

    stop() {
        this.setAttribute('active', 'false');
    }

    /*
     * Element internals
     */

    async elementStyle() {
        return `
            ${await super.elementStyle()}
            #scanner { width: ${Math.max(640, this.offsetWidth)}px; margin: 0 auto; }
            @media(max-width: 600px) { #scanner { width: 330px; } }
        `;
    }

    buildElement() {
        const root = this.builder.newSlot('scanner');
        return root;
    }

    get appliedTemplateName() {
        return 'codescanner';
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
/*
                busy             : {
                    default      : false,
                    type         : 'boolean',
                    description  : 'during payment',
                    group        : 'Spec',
                    example      : 'true | false'
                },
*/
            }
        };
    }

    static get observedAttributes() {
        return [...super.observedAttributes, 'active'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'active') {
            if (newValue === "false") {
                this.stopScan();
            } else {
                this.startScan();
            }
        }
    }

    get slotname() {
        if (!this._slotname) this._slotname = /*this.stripeReference ??*/ `codescanner-slot-${universe.random()}`;
        return this._slotname;
    }

    async applyContent(container) {
        this.skeletonOn(container);
        const scannerslot = this.scannerslot = this.buildElement();
        scannerslot.setAttribute('name', this.slotname);
        container.appendChild(scannerslot);
        this.mountcontroller = MountController.forHost(this, this.slotname);
        const mountpoint = this.mountcontroller.mount;
        // const scannerid = `scanner-${universe.random()}`;
        // const div = this.builder.newDiv({ id: scannerid });
        // this.scannerelement = this.buildElement();
        // mountpoint.appendChild(div);
        let config = {
            fps: 10,
            qrbox: {width: 100, height: 100},
            rememberLastUsedCamera: true,
            // Only support camera scan type.
            supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
        };
        const html5QrcodeScanner = this.scanner = new Html5QrcodeScanner(mountpoint.id, config, false);
        html5QrcodeScanner.render((...arg) => onScanSuccess(...arg));
        this.skeletonOff(container);
    }

    onScanSuccess(evt) {
        debugger;
    }

}

AuroraCodeScanner.defineElement();
