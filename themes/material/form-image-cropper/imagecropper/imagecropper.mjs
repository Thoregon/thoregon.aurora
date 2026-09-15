/**
 * ImageCropper - lightweight, dependency free image prompter/cropper
 *
 * Replacement for Slim image cropper, reduced to what upay.me needs:
 *  - pick a file (click, drag & drop) or load an existing image (data url)
 *  - crop to a fixed ratio in a dialog (pan & zoom the image inside a fixed frame, rotate 90°)
 *  - render the result to a target size -> base64 data url
 *  - preview with edit / remove buttons
 *
 * Options (all optional):
 *   ratio          '1:1' | '16:9' | ... | 'free'   'free' = take the image as is, no crop dialog
 *   size           [width, height] target size of the result in px
 *                  for 'free': max bounds (never upscaled) and the proportion of the empty placeholder
 *   label          text shown in the empty state
 *   labels         { edit, remove, rotate, cancel, confirm, title, loading }
 *   icons          { upload, edit, remove, rotate }  material icon ligature names
 *   iconClass      css class of the icon font, default 'material-icons'
 *   maxFileSize    bytes, default 25 MB
 *   maxInputSize   longest side in px the working image is reduced to before editing, default 4096
 *   jpegQuality    0..1, default .9
 *   onChange(output)   result changed (after crop or remove -> output is null)
 *   onError(error)     something went wrong (e.g. file too large)
 *
 * Result (output):
 *   { image: dataUrl, name, type, width, height }
 *
 * @licence: MIT
 */

const DEFAULT_LABELS = {
    title   : 'Bild zuschneiden',
    edit    : 'Bearbeiten',
    remove  : 'Entfernen',
    rotate  : 'Drehen',
    cancel  : 'Abbrechen',
    confirm : 'Ok',
    loading : 'Wird geladen …',
};

/*
 * Icons: Material Icons ligatures (https://fonts.google.com/icons), the font must be loaded by the app.
 * Override per instance with options.icons = { upload, edit, remove, rotate } (ligature names)
 * or options.iconClass (default 'material-icons', e.g. 'material-symbols-outlined').
 */
const DEFAULT_ICONS = {
    upload : 'add',
    edit   : 'edit',
    remove : 'delete',
    rotate : 'rotate_90_degrees_cw',
};

const MB = 1024 * 1024;

export default class ImageCropper {

    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            ratio        : '1:1',
            size         : null,
            label        : '',
            maxFileSize  : 25 * MB,
            maxInputSize : 4096,
            jpegQuality  : .9,
            onChange     : () => {},
            onError      : (e) => console.error('ImageCropper', e),
            iconClass    : 'material-icons',
            ...options,
            labels       : { ...DEFAULT_LABELS, ...(options.labels || {}) },
            icons        : { ...DEFAULT_ICONS,  ...(options.icons  || {}) },
        };

        this._output = null;          // current result
        this._source = null;          // working image { img, name, type }
        this._edit   = null;          // editor state while the dialog is open

        this._build();
        this._setState('empty');
    }

    /*
     * public API
     */

    get data()   { return this._output; }
    get isEmpty(){ return !this._output; }

    /** load an existing image (data url or any url) as result without opening the editor */
    async load(url, name = 'image') {
        this._setState('busy');
        try {
            const img  = await loadImage(url);
            const type = mimeFromDataUrl(url) || 'image/jpeg';
            this._setSource({ img, name, type });
            this._setOutput({ image: url, name, type, width: img.naturalWidth, height: img.naturalHeight }, false);
        } catch (e) {
            this._setState('empty');
            this.options.onError(e);
        }
    }

    remove() {
        this._setSource(null);
        this._setOutput(null);
    }

    openFileDialog() {
        this.fileInput.click();
    }

    /** open the crop editor for the current image */
    edit() {
        if (!this._source) return;
        this._openEditor();
    }

    setRatio(ratio) {
        this.options.ratio = ratio;
        this._applyRatio();
    }

    /** soft teardown: close an open editor but keep the UI usable (the host may call this while the element stays in use) */
    release() {
        if (this.dialog?.open) this._closeEditor();
    }

    /** full teardown, the element is not used anymore afterwards */
    destroy() {
        this._setSource(null);
        if (this.dialog?.open) this.dialog.close();
        this.element.innerHTML = '';
        this.element.classList.remove('ic');
    }

    /*
     * DOM
     */

    /** material icon markup */
    _icon(name) {
        return `<span class="ic-icon ${this.options.iconClass}" aria-hidden="true">${this.options.icons[name]}</span>`;
    }

    _build() {
        const el = this.element;
        const l  = this.options.labels;
        el.classList.add('ic');
        el.innerHTML = `
            <input type="file" accept="image/*" class="ic-file" tabindex="-1">
            <div class="ic-area" role="button" tabindex="0">
                <div class="ic-label">${this._icon('upload')}<span>${escapeHtml(this.options.label)}</span></div>
                <div class="ic-loading">${escapeHtml(l.loading)}</div>
                <img class="ic-preview" alt="">
                <div class="ic-actions">
                    <button type="button" class="ic-btn ic-btn-edit"   title="${escapeHtml(l.edit)}">${this._icon('edit')}</button>
                    <button type="button" class="ic-btn ic-btn-remove" title="${escapeHtml(l.remove)}">${this._icon('remove')}</button>
                </div>
            </div>`;

        this.fileInput = el.querySelector('.ic-file');
        this.area      = el.querySelector('.ic-area');
        this.preview   = el.querySelector('.ic-preview');

        this._applyRatio();

        // pick file
        this.area.addEventListener('click', (e) => {
            if (e.target.closest('.ic-btn')) return;
            if (this._state === 'empty') this.openFileDialog();
        });
        this.area.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && this._state === 'empty') { e.preventDefault(); this.openFileDialog(); }
        });
        this.fileInput.addEventListener('change', () => {
            const file = this.fileInput.files[0];
            this.fileInput.value = '';
            if (file) this._handleFile(file);
        });

        // drag & drop (drop replaces the current image)
        ['dragenter', 'dragover'].forEach(ev => this.area.addEventListener(ev, (e) => { e.preventDefault(); el.dataset.dragover = 'true'; }));
        ['dragleave', 'drop'].forEach(ev => this.area.addEventListener(ev, (e) => { e.preventDefault(); delete el.dataset.dragover; }));
        this.area.addEventListener('drop', (e) => {
            const file = [...e.dataTransfer.files].find(f => f.type.startsWith('image/'));
            if (file) this._handleFile(file);
        });

        el.querySelector('.ic-btn-edit').addEventListener('click', () => this.edit());
        el.querySelector('.ic-btn-remove').addEventListener('click', () => this.remove());
    }

    _applyRatio() {
        const r    = parseRatio(this.options.ratio);
        const size = this.options.size;
        this.element.dataset.ratio = r ? this.options.ratio : 'free';
        // fixed ratio -> crop frame and preview; free -> size only shapes the empty placeholder
        const placeholder = r ? `${r.w} / ${r.h}` : size ? `${size[0]} / ${size[1]}` : '16 / 9';
        this.element.style.setProperty('--ic-ratio', placeholder);
    }

    /** replace the working image, release a previous object url */
    _setSource(source) {
        if (this._source?.url) URL.revokeObjectURL(this._source.url);
        this._source = source;
    }

    _setState(state) {
        this._state = state;
        this.element.dataset.state = state;
    }

    _setOutput(output, notify = true) {
        this._output = output;
        if (output) {
            this.preview.src = output.image;
            this._setState('preview');
        } else {
            this.preview.removeAttribute('src');
            this._setState('empty');
        }
        if (notify) this.options.onChange(output);
    }

    /*
     * file handling
     */

    async _handleFile(file) {
        const o = this.options;
        if (file.size > o.maxFileSize) {
            return o.onError(new Error(`Datei zu groß (${formatBytes(file.size)}, max. ${formatBytes(o.maxFileSize)})`));
        }
        this._setState('busy');
        try {
            let url = URL.createObjectURL(file);
            let img = await loadImage(url);

            // reduce very large images before editing (memory, speed); keep it as blob url, not base64
            const longest = Math.max(img.naturalWidth, img.naturalHeight);
            if (longest > o.maxInputSize) {
                const f      = o.maxInputSize / longest;
                const canvas = draw(img, Math.round(img.naturalWidth * f), Math.round(img.naturalHeight * f));
                const type   = ALPHA_TYPES.includes(file.type) ? 'image/png' : 'image/jpeg';
                const blob   = await new Promise(r => canvas.toBlob(r, type, .95));
                URL.revokeObjectURL(url);
                url = URL.createObjectURL(blob);
                img = await loadImage(url);
            }
            this._setSource({ img, name: file.name, type: file.type, url });

            if (parseRatio(o.ratio)) {
                this._openEditor();
            } else {
                this._takeAsIs();
            }
        } catch (e) {
            this._setState(this._output ? 'preview' : 'empty');
            o.onError(e);
        }
    }

    /** ratio 'free': no crop, only fit into size bounds if given */
    _takeAsIs() {
        const { img, name, type } = this._source;
        const o = this.options;
        let w = img.naturalWidth, h = img.naturalHeight;
        if (o.size) {
            const f = Math.min(1, o.size[0] / w, o.size[1] / h);      // never upscale
            w = Math.round(w * f); h = Math.round(h * f);
        }
        const { image, type: outType } = encode(img, w, h, null, type, o.jpegQuality);
        this._setOutput({ image, name, type: outType, width: w, height: h });
    }

    /*
     * editor dialog
     */

    _openEditor() {
        if (!this.dialog) this._buildDialog();
        const { img } = this._source;
        const ratio   = parseRatio(this.options.ratio) || { w: img.naturalWidth, h: img.naturalHeight };

        this.stageImg.src = img.src;
        this.stageImg.style.width  = img.naturalWidth + 'px';
        this.stageImg.style.height = img.naturalHeight + 'px';

        this._edit = { ratio, s: 1, smin: 1, tx: 0, ty: 0, rot: 0 };
        this.dialog.showModal();
        this._layoutStage();
        this._fit();
    }

    _buildDialog() {
        const l = this.options.labels;
        const d = document.createElement('dialog');
        d.className = 'ic-dialog';
        d.innerHTML = `
            <div class="ic-dialog-head">${escapeHtml(l.title)}</div>
            <div class="ic-stage-wrapper">
                <div class="ic-stage">
                    <img class="ic-stage-img" alt="" draggable="false">
                    <div class="ic-grid"></div>
                </div>
            </div>
            <div class="ic-tools">
                <button type="button" class="ic-tool ic-tool-rotate" title="${escapeHtml(l.rotate)}">${this._icon('rotate')}</button>
                <input type="range" class="ic-zoom" min="0" max="1" step="0.001" value="0" aria-label="Zoom">
            </div>
            <div class="ic-dialog-foot">
                <button type="button" class="ic-dialog-btn ic-cancel">${escapeHtml(l.cancel)}</button>
                <button type="button" class="ic-dialog-btn ic-confirm">${escapeHtml(l.confirm)}</button>
            </div>`;
        // inside the element (not document.body) so it is styled by the same stylesheet, also in a shadow root;
        // showModal() renders it in the top layer regardless of ancestors' overflow/transform
        this.element.appendChild(d);
        this.dialog   = d;
        this.stageWrap= d.querySelector('.ic-stage-wrapper');
        this.stage    = d.querySelector('.ic-stage');
        this.stageImg = d.querySelector('.ic-stage-img');
        this.zoom     = d.querySelector('.ic-zoom');

        d.querySelector('.ic-cancel').addEventListener('click', () => this._closeEditor());
        d.querySelector('.ic-confirm').addEventListener('click', () => this._confirm());
        d.querySelector('.ic-tool-rotate').addEventListener('click', () => this._rotate());
        d.addEventListener('cancel', (e) => { e.preventDefault(); this._closeEditor(); });   // ESC
        d.addEventListener('click', (e) => { if (e.target === d) this._closeEditor(); });   // backdrop

        this.zoom.addEventListener('input', () => {
            const e = this._edit;
            this._zoomTo(e.smin * Math.pow(this._maxZoomFactor(), Number(this.zoom.value)));
        });

        // pan (pointer events cover mouse + touch + pen)
        const pointers = new Map();
        let lastDist = 0;
        this.stage.addEventListener('pointerdown', (ev) => {
            ev.preventDefault();
            this.stage.setPointerCapture(ev.pointerId);
            pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
            this.stage.dataset.dragging = 'true';
            if (pointers.size === 2) lastDist = pointerDistance(pointers);
        });
        this.stage.addEventListener('pointermove', (ev) => {
            if (!pointers.has(ev.pointerId)) return;
            const prev = pointers.get(ev.pointerId);
            const dx = ev.clientX - prev.x, dy = ev.clientY - prev.y;
            pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
            if (pointers.size === 1) {
                this._pan(dx, dy);
            } else if (pointers.size === 2) {
                // pinch zoom around the midpoint, move with the midpoint
                const dist = pointerDistance(pointers);
                const mid  = pointerMid(pointers);
                const rect = this.stage.getBoundingClientRect();
                this._zoomAt(this._edit.s * dist / lastDist, mid.x - rect.left - rect.width / 2, mid.y - rect.top - rect.height / 2);
                this._pan(dx / 2, dy / 2);
                lastDist = dist;
            }
        });
        const up = (ev) => { pointers.delete(ev.pointerId); if (!pointers.size) delete this.stage.dataset.dragging; };
        this.stage.addEventListener('pointerup', up);
        this.stage.addEventListener('pointercancel', up);

        // wheel zoom around cursor
        this.stage.addEventListener('wheel', (ev) => {
            ev.preventDefault();
            const rect = this.stage.getBoundingClientRect();
            const factor = Math.exp(-ev.deltaY * 0.002);
            this._zoomAt(this._edit.s * factor, ev.clientX - rect.left - rect.width / 2, ev.clientY - rect.top - rect.height / 2);
        }, { passive: false });

        window.addEventListener('resize', () => { if (d.open) { this._layoutStage(); this._constrain(); this._render(); } });
    }

    _closeEditor() {
        this.dialog.close();
        this._edit = null;
        this.stageImg.removeAttribute('src');
        this._setState(this._output ? 'preview' : 'empty');
    }

    /** size the stage (= crop frame) to fit the ratio into the available space */
    _layoutStage() {
        const { ratio } = this._edit;
        const maxW = this.stageWrap.clientWidth, maxH = this.stageWrap.clientHeight;
        let w = maxW, h = w * ratio.h / ratio.w;
        if (h > maxH) { h = maxH; w = h * ratio.w / ratio.h; }
        this.stage.style.width  = Math.floor(w) + 'px';
        this.stage.style.height = Math.floor(h) + 'px';
        this._edit.vw = Math.floor(w);
        this._edit.vh = Math.floor(h);
        this._edit.smin = this._minScale();
    }

    /** rotated image dimensions in image px */
    _rotatedSize() {
        const { img } = this._source;
        return this._edit.rot % 180 ? { w: img.naturalHeight, h: img.naturalWidth } : { w: img.naturalWidth, h: img.naturalHeight };
    }

    _minScale() {
        const r = this._rotatedSize();
        return Math.max(this._edit.vw / r.w, this._edit.vh / r.h);
    }

    _maxZoomFactor() { return 4; }   // up to 4x beyond "cover"

    _fit() {
        const e = this._edit;
        e.s = e.smin = this._minScale();
        e.tx = e.ty = 0;
        this._render();
    }

    _pan(dx, dy) {
        this._edit.tx += dx; this._edit.ty += dy;
        this._constrain();
        this._render();
    }

    _zoomTo(s) { this._zoomAt(s, 0, 0); }

    /** zoom keeping the point (px, py relative to stage center) fixed */
    _zoomAt(s, px, py) {
        const e = this._edit;
        s = clamp(s, e.smin, e.smin * this._maxZoomFactor());
        const k = s / e.s;
        e.tx = px - (px - e.tx) * k;
        e.ty = py - (py - e.ty) * k;
        e.s  = s;
        this._constrain();
        this._render();
    }

    _rotate() {
        const e = this._edit;
        e.rot = (e.rot + 90) % 360;
        // keep the relative zoom level, re-fit offsets
        const rel = e.s / e.smin;
        e.smin = this._minScale();
        e.s = e.smin * rel;
        this._constrain();
        this._render();
    }

    /** keep the frame fully covered by the image */
    _constrain() {
        const e = this._edit;
        const r = this._rotatedSize();
        const maxX = (r.w * e.s - e.vw) / 2, maxY = (r.h * e.s - e.vh) / 2;
        e.tx = clamp(e.tx, -maxX, maxX);
        e.ty = clamp(e.ty, -maxY, maxY);
    }

    _render() {
        const e = this._edit;
        this.stageImg.style.transform = `translate(-50%, -50%) translate(${e.tx}px, ${e.ty}px) rotate(${e.rot}deg) scale(${e.s})`;
        this.zoom.value = Math.log(e.s / e.smin) / Math.log(this._maxZoomFactor());
    }

    _confirm() {
        const e = this._edit;
        const { img, name, type } = this._source;
        const o = this.options;

        // output size: given target size, otherwise the native resolution of the crop
        let ow, oh;
        if (o.size) {
            [ow, oh] = o.size;
        } else {
            ow = Math.round(e.vw / e.s); oh = Math.round(e.vh / e.s);
        }
        const k = ow / e.vw;                     // stage px -> output px
        const transform = (ctx) => {
            ctx.translate(ow / 2 + e.tx * k, oh / 2 + e.ty * k);
            ctx.rotate(e.rot * Math.PI / 180);
            ctx.scale(e.s * k, e.s * k);
            ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
        };
        const { image, type: outType } = encode(img, ow, oh, transform, type, o.jpegQuality);

        this.dialog.close();
        this._edit = null;
        this._setOutput({ image, name, type: outType, width: ow, height: oh });
    }
}

/*
 * helpers
 */

function parseRatio(ratio) {
    if (!ratio || ratio === 'free' || ratio === 'input') return null;
    const [w, h] = String(ratio).split(':').map(Number);
    return (w > 0 && h > 0) ? { w, h } : null;
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload  = () => resolve(img);
        img.onerror = () => reject(new Error('Bild konnte nicht geladen werden'));
        img.src = src;
    });
}

/** formats that may carry transparency; only those get checked for alpha */
const ALPHA_TYPES = ['image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif'];

/**
 * draw and encode: result stays png when it actually contains transparent pixels,
 * everything else becomes jpeg (smaller, no animation/webp/gif passthrough)
 */
function encode(img, w, h, transform, inputType, quality) {
    const canvas = draw(img, w, h, transform);
    const type   = ALPHA_TYPES.includes(inputType) && hasAlpha(canvas) ? 'image/png' : 'image/jpeg';
    if (type === 'image/jpeg') {
        // flatten on white, canvas default is transparent black
        const flat = document.createElement('canvas');
        flat.width = w; flat.height = h;
        const ctx = flat.getContext('2d');
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
        ctx.drawImage(canvas, 0, 0);
        return { image: flat.toDataURL(type, quality), type };
    }
    return { image: canvas.toDataURL(type), type };
}

function hasAlpha(canvas) {
    const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    for (let i = 3; i < data.length; i += 4) if (data[i] < 255) return true;
    return false;
}

function mimeFromDataUrl(url) {
    const m = /^data:([^;,]+)/.exec(url);
    return m ? m[1] : null;
}

/** draw img onto a w x h canvas (with optional custom transform) */
function draw(img, w, h, transform) {
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    if (transform) transform(ctx); else ctx.drawImage(img, 0, 0, w, h);
    return canvas;
}

function formatBytes(n) {
    return n >= MB ? `${(n / MB).toFixed(1)} MB` : `${Math.ceil(n / 1024)} KB`;
}

function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

function pointerDistance(pointers) {
    const [a, b] = [...pointers.values()];
    return Math.hypot(a.x - b.x, a.y - b.y) || 1;
}

function pointerMid(pointers) {
    const [a, b] = [...pointers.values()];
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
