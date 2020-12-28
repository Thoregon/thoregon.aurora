/**
 * QR Code scanner element. Fits automatically to screen, but can be sized.
 *
 * Usage:
 * - place the tag &lt;aurora-qrscanner&gt; just once (!) in the HTML
 * - the scanner can be switched on an off
 *   - by the attribute 'active' ('true', 'false') directly in the HTML
 *   - by elem.start() and elem.stop() on the element object
 *
 * Events emitted by this element:
 * - qrcode
 * - qrerror
 * - qrvideoerror
 *
 * use listeners as usual with
 *   addEventLisener('qrcode', () => {})
 *   elem.onqrcode = fn
 *   &lt;aurora-qrscanner onqrcode="//js code here"&gt;
 *
 * Basically this is a wrapper to Html5Qrcode from
 * - mebjas <minhazav@gmail.com>    @see https://blog.minhazav.dev/
 * - lazarsoft                      @see https://github.com/LazarSoft/jsqrcode
 * - ZXing                          @see https://github.com/zxing/zxing
 * fitted into aurora as a custom element
 *
 * @licence Apache License 2.0 -> https://github.com/mebjas/html5-qrcode/blob/master/LICENSE
 *
 * @author: Bernhard Lukassen
 */

import AuroraCamElement         from "./auroracamelement.mjs";
import Html5Qrcode              from "../qrlib/html5qrcode.mjs";

export default class AuroraQRScanner extends AuroraCamElement {

    constructor() {
        super();
    }

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-qrscanner';
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
            #qrroot { width: ${Math.max(640,this.offsetWidth)}px; margin: 0 auto; }
            @media(max-width: 600px) { #qrroot { width: 330px; } }
        `;
    }
    buildElement() {
        const root = this.builder.newDiv({ id: 'qrroot' });
        return root;
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

    applyContent(container) {
        this.qrbase = this.builder.newDiv();
        container.appendChild(this.qrbase);
        this.qrscanner = new Html5Qrcode(this.qrbase);
    }

    /*
     * QR code scanner operating
     */
    async startScan() {
        if (!this.hasCamera()) {
            await this.selectCamera();
        }
        try {
            await this.qrscanner.start(
                this.cameraId,
                {
                    fps: 1,
                    qrbox: 300
                },
                (qrcode) => this.scanResult(qrcode),
                (error)  => this.scanError(error)
            );
        } catch (e) {
            // todo [OPEN]: video error
            this.emit('qrvideoerror', e.message);
        }
    }

    hasQRcode() {
        return !!this._qrcode;
    }

    get qrcode() {
        return this._qrcode;
    }

    scanResult(qrcode) {
        this._qrcode = qrcode;      // can be retreived with elem.qrcode
        this.emit('qrcode', qrcode);
    }

    scanError(message) {
        this.emit('qrerror', message);
    }

    async stopScan() {
        this.qrscanner.stop();
    }

    hasCamera() {
        return !!this.cameraId;
    }

    // todo [OPEN]: add a camera selector element
    async selectCamera() {
        let cameras = await Html5Qrcode.getCameras();
        if (cameras.length === 0) {
            return setFeedback("Error: Zero cameras found in the device");
        }
        let cameraId = cameras[0].id;
        for (var i = 0; i < cameras.length; i++) {
            const camera = cameras[i];
            const id = camera.id;
            const name = !camera.label ? id : camera.label;
            if (name.toUpperCase().indexOf('REAR')) cameraId = id;
        }
        this.cameraId = cameraId;
    }
}

AuroraQRScanner.defineElement();
