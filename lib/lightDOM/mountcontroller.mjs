/**
 * supply a mount element to third party libs which can't be used
 * in shadow DOMs to be used in a shadow DOM
 *
 * mounts exactly one element
 *
 * create a mount element for a 'SLOT' in the topmost document,
 * add it in every shadow DOM down to the target shadow DOM,
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

export default class MountController {

    constructor({ host, slotname } = {}) {
        this.mountId  = `mount-point-${universe.random()}`;
        this.slotname = slotname;
        this.host     = host;
    }

    static forHost(host, slotname) {
        const controller = new this({ host, slotname });
        controller.initShadowMountPoints();
        return controller;
    }

    get mount() {
        return document.getElementById(this.mountId);
    }


    createMountPoint() {
        const node = document.createElement('div');
        node.id    = this.mountId;
        // node.classList.add(`${this.host.tagName.toLowerCase()}-mount`);
        return node;
    }

    createSlot(slotname) {
        const node = document.createElement('slot');
        node.slot  = slotname;
        node.name  = slotname;
        return node;
    }

    appendTemplate(target, node = this.createMountPoint()) {
        target.nodeAppendChild ? target.nodeAppendChild(node) : target.appendChild(node);
        return node;
    }

    /**
     * Prepares to mount Stripe Elements in light DOM.
     */
    initShadowMountPoints() {
        // trace each shadow boundary between us and the document
        let host         = this.host;
        this.shadowHosts = [host];
        while (host = host.getRootNode().host) this.shadowHosts.push(host);

        const { shadowHosts, slotname } = this;

        // Prepare the shallowest breadcrumb slot at document level
        const hosts = [...shadowHosts];
        const root  = hosts.pop();
        if (!root?.querySelector(`[slot="${slotname}"]`)) {
            const div = document.createElement('div');
            div.slot  = slotname;
            root.nodeAppendChild ? root.nodeAppendChild(div) : root?.appendChild(div);
        }

        const container = root?.querySelector(`[slot="${slotname}"]`);

        // Render the form to the document, so that the slotted content can mount
        this.appendTemplate(container);

        // Append breadcrumb slots to each shadowroot in turn,
        // from the document down to the <stripe-elements> instance.
        hosts.forEach(host => this.appendTemplate(host, this.createSlot(slotname)));
    }
}
