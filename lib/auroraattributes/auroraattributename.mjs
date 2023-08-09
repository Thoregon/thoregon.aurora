/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

// import { timeout }     from "/evolux.universe";
// import { isUFD }       from "/thoregon.truCloud";

import AuroraElement   from "../auroraelement.mjs";
import AuroraAttribute from "./auroraattribute.mjs";

const SHORTCODE = '$';

const debuglog = (...args) => {}; // {};   // console.log(...args);

export default class AuroraAttributeName extends AuroraAttribute {

    constructor(...args) {
        super(...args);
        this._modelcurrentvalue = undefined;
        this.elementListener    = (evt) => this.elementValueChanged(evt);
        this.modelListener      = (evt) => this.modelValueChanged(evt);
    }

    static get name() {
        return "name";
    }

    static get supportsSelector() {
        return true;
    }

    static attrCompare() {
        const names = [this.auroraName, this.auroraShortName];
        return (attrname) => (attrname.startsWith(SHORTCODE) || names.findIndex(name => (name === attrname || attrname.startsWith(name+':') || attrname.startsWith(name+'.'))) > -1);
    }

    adjustName(name) {
        return name === SHORTCODE
               ? this.auroraName
               : super.adjustName(name);
    }

    parseAttributeSelector() {
        let name = this.attribute?.name;
        if (!name || !name.startsWith(SHORTCODE)) return super.parseAttributeSelector();
        let selector = name.substring(1), subselector;
        let parts = selector.split('.');
        if (parts.length > 1) {
            selector = parts[0];
            subselector = parts[1];
        }
        if (selector === '') selector = undefined;
        return { name: this.auroraName, selector, subselector };
    }

    connectElementListeners(element) {
       // debuglog("**> connectElementListeners ", this.auroraName, this.attribute.name, this.attribute.value);
        element = element ?? this.element;
        if (!element) return;  // can't connect
        const eventname = this.subselector ?? element.valueEventName ?? 'change';
        element.addEventListener(eventname, this.elementListener);

        this.elementType = ( 'type' in element )
            ? element.type ?? element.getAttribute('type')
            : 'html';
    }

    connectViewModelListeners(viewModel) {
        // debuglog("**> connectViewModelListeners ", this.auroraName, this.attribute.name, this.attribute.value);
        const selector  = this.getNormalizedSelector();
        // todo [OPEN]: get the path, enveloping elements may define a scope
        viewModel.addPathListener(this.attribute.value, selector, this.modelListener);
    }

    elementValueChanged(evt){
        if (this._active) return;
        if (!evt.target) return;

        const target = evt.target;
        let value = 'ufd' in target ? target.ufd : target.value;  // if the target has a unified file descriptor use it as value
        if (value == undefined) return;

        switch (this.elementType) {
            case 'checkbox':
                const element = this.element;
                if ( ! element.checked ) {
                    value = element.getAttribute('uncheckedvalue') || "";
                }
                break;
        }

        this._active = true;
        try {
            const viewModel = this.getAttachedViewModel();
            if (!viewModel) return;
            this._modelcurrentvalue = value;    // avoid roundtrip
            debuglog("** aurora-name > elementValueChanged ", this.auroraName, this.attribute.name, this.attribute.value, value);
            // todo [OPEN]: check validations
            const path     = this.attribute.value;
            const selector = this.getNormalizedSelector();
            switch (selector) {
                case 'model'        :
                    viewModel.setValueModelPath(path, value);
                    break;
                case 'meta'         :
                    viewModel.setValueMetaModelPath(path, value);
                    break;
                case 'viewmodel'    :
                    viewModel.setValueViewModelPath(path, value);
                    break;
                case 'viewmodelmeta':
                    viewModel.setValueViewModelMetaPath(path, value);
                    break;
            }
        } catch (e) { }
        delete this._active;
    }

    modelValueChanged(evt) {
        if (this._active) return;

        let value = evt.value;
        if (value == undefined) value = '';
        if (this._modelcurrentvalue === value) return;
        this._modelcurrentvalue = value;    // avoid roundtrip

        const element = this.element;
        if (!element) return;
        this._active = true;

        switch (this.elementType) {
            case 'checkbox':
            case 'radio':
                const elementValue = element.getAttribute('value');
                if (elementValue == value) {
                    element.checked = true;
                } else {
                    element.checked = false;
                }
                break;
            case 'select-multiple':
                // todo
                // break;
            case 'select-one':
                element._modelvalue = value;
                if (element.options.length > 0) element.value = value;
                break;
            default:
                if ('ufd' in element) {     // if the element supports a unified file descriptor use it
                    element.ufd = value;
                } else if ('value' in element) {
                    element.value = value;
                } else {
                    element.innerHTML = value;
                }
                break;
        }

        debuglog("** aurora-name > modelValueChanged ", this.auroraName, this.attribute.name, this.attribute.value, value);
        delete this._active;
    }


    detachViewModel() {
        const oldViewModel = this.getAttachedViewModel();
        return super.detachViewModel();
        // const selector  = this.getNormalizedSelector();
        // oldViewModel?.removePathListener(this.attribute.value, selector, this.modelListener);
    }

    async firstSyncModelValue() {
        const selector  = this.getNormalizedSelector();
        const viewModel = this.getAttachedViewModel();
        if (!viewModel.hasModel && (selector === 'model' || selector === 'meta')) return;
        const value = await this.getModelValue();
        this.modelValueChanged({ value });
    }

    doFirstSync() {
        // debuglog("**> doFirstSync ", this.auroraName, this.attribute.name, this.attribute.value);
        if (!this.element.addInitFn) {
            this.debounceDelay(() => this.firstSyncModelValue());
        } else {
            this.element.addInitFn(async () => this.firstSyncModelValue());
        }
    }

    getNormalizedSelector() {
        switch (this.selector) {
            case '':
            case 'model':
                return 'model';
            case 'meta':
                return 'meta';
            case 'vm':
            case 'viewmodel':
                return 'viewmodel';
            case 'vmeta':
            case 'viewmeta':
                return 'viewmeta';
        }
        return 'model';
    }

    async getModelValue() {
        const viewModel = this.getAttachedViewModel();
        if (!viewModel) return;
        const path      = this.attribute.value;
        const selector  = this.getNormalizedSelector();
        let value;
        switch (selector) {
            case 'model':
                value = await viewModel.getValueModelPath(path);
                break;
            case 'meta'         :
                value = viewModel.getValueMetaModelPath(path);
                break;
            case 'viewmodel'    :
                value = viewModel.getValueViewModelPath(path);
                break;
            case 'viewmodelmeta':
                value = viewModel.getValueViewModelMetaPath(path);
                break;
        }
        return value;
    }

}

AuroraElement.useAuroraAttribute(AuroraAttributeName);
