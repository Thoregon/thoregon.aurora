/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import { timeout }     from "/evolux.universe";

import AuroraElement   from "../auroraelement.mjs";
import AuroraAttribute from "./auroraattribute.mjs";

const debuglog = (...args) => {}; // {};   // console.log(...args);

export default class AuroraAttributeName extends AuroraAttribute {

    constructor(...args) {
        super(...args);
        this.elementListener = (evt) => this.elementValueChanged(evt);
        this.modelListener   = (evt) => this.modelValueChanged(evt);
    }

    static get name() {
        return "name";
    }

    static get supportsSelector() {
        return true;
    }

    connectElementListeners(element) {
       // debuglog("**> connectElementListeners ", this.auroraName, this.attribute.name, this.attribute.value);
        element = element ?? this.element;
        if (!element) return;  // can't connect
        const eventname = this.subselector ?? element.valueEventName ?? 'change';
        element.addEventListener(eventname, this.elementListener);
    }

    connectViewModelListeners(viewModel) {
        // debuglog("**> connectViewModelListeners ", this.auroraName, this.attribute.name, this.attribute.value);
        const selector  = this.getNormalizedSelector();
        viewModel.addPathListener(this.attribute.value, selector, this.modelListener);
    }

    elementValueChanged(evt){
        const value = evt.target?.value;
        if (value == undefined) return;
        const viewModel = this.getAttachedViewModel();
        if (!viewModel) return;
        debuglog("** aurora-name > elementValueChanged ", this.auroraName, this.attribute.name, this.attribute.value, value);
        // todo [OPEN]: check validations
        const path      = this.attribute.value;
        const selector  = this.getNormalizedSelector();
        switch (selector) {
            case 'model'        : viewModel.setValueModelPath(path, value); break;
            case 'meta'         : viewModel.setValueMetaModelPath(path, value); break;
            case 'viewmodel'    : viewModel.setValueViewModelPath(path, value); break;
            case 'viewmodelmeta': viewModel.setValueViewModelMetaPath(path, value); break;
        }

    }

    modelValueChanged(evt) {
        if (this._active) return;
        this._active = true;

        let value = evt.value;
        if (value == undefined) value = '';
        const element = this.element;
        if (!element) return;
        debuglog("** aurora-name > modelValueChanged ", this.auroraName, this.attribute.name, this.attribute.value, value);
        if ('value' in element) {
            element.value = value;
        } else {
            element.innerHTML = value;
        }
        delete this._active;
    }


    detachViewModel() {
        const oldViewModel = this.getAttachedViewModel();
        return super.detachViewModel();
        const selector  = this.getNormalizedSelector();
        oldViewModel?.removePathListener(this.attribute.value, selector, this.modelListener);
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
            this.firstSyncModelValue();
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
