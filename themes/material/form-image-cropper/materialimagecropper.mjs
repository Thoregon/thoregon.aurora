/**
 * Material behavior for <aurora-image-cropper>, based on the in-house ImageCropper
 * (replaces the Slim wrapper)
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import ThemeBehavior from "../../themebehavior.mjs";
import ImageCropper  from "./imagecropper/imagecropper.mjs";

export default class MaterialImageCropper {

    attach(jar) {
        this.jar       = jar;
        this.container = this.jar.container;
        this.cropper   = this.container.querySelector('.aurora-image-cropper');

        const width = this.cropper.getAttribute('data-width') || '100%';
        this.cropper.style.width = width;

        const align = this.cropper.getAttribute('data-align') || 'center';
        this.container.classList.add(align);

        this.attachCropper();

        // value may have been set before attach
        if (this.jar._ufd) this.loadCropper(this.jar._ufd);
    }

    /**
     * Aurora may call destroy() while the element stays in use (e.g. when it is re-parented during
     * page setup) and does not attach() again -> don't tear down the DOM, just release resources.
     */
    destroy() {
        this.ic?.release();
    }

    attachCropper() {
        const elem   = this.cropper;
        const ratio  = elem.getAttribute('data-ratio') || '1:1';
        const label  = elem.getAttribute('data-label') || '';
        const size   = elem.getAttribute('data-size');            // e.g. '300,300', empty = native crop resolution
        const layout = elem.getAttribute('data-layout') || 'square';

        elem.classList.add(`ic-${layout}`);

        this.ic = new ImageCropper(elem, {
            ratio,
            size    : size ? size.split(',').map(Number) : null,
            label,
            onChange: (output) => this.imageChanged(output),
            onError : (error)  => this.jar.showError(error),
        });
    }

    /*
     * value handling
     */

    /** the last cropped result: { image: dataUrl, name, type, width, height } or null */
    get imageDescriptor() {
        return this.ic.data;
    }

    /** display an existing image (ufd) without triggering a change */
    set imageDescriptor(ufd) {
        this.loadCropper(ufd);
    }

    async loadCropper(ufd) {
        if (!ufd || !this.ic) return;
        try {
            // getDataUrl() fetches via the storage adapter (may point to another host, e.g. production while developing
            // on localhost -> 404); fall back to the plain uri, which is what <img> elements in the app use anyway
            const url = (await ufd.getDataUrl()) || ufd.uri;
            if (url) await this.ic.load(url, ufd.name);
        } catch (e) {
            console.error("[ImageCropper] load failed", e);
        }
    }

    /** user cropped a new image (output) or removed it (null) */
    async imageChanged(output) {
        if (!output) return this.jar.removeImage();
        this.ic.element.dataset.state = 'busy';
        try {
            await this.jar.saveImage(output);
        } catch (e) {
            console.error('[ImageCropper] saveImage failed', e);
            this.jar.showError(e);
        } finally {
            this.ic.element.dataset.state = 'preview';
        }
    }

    showFileDialog() {
        if (!this.ic.isEmpty) return;
        return this.ic.openFileDialog();
    }
}
