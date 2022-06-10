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

    static get name() {
        return "name";
    }

    static get supportsSelector() {
        return true;
    }

    connectElementListener(element) {
        debuglog("**> connectElementListener ", this.auroraName, this.attribute.name, this.attribute.value);
        element = element ?? this.element;
        if (!element) return;  // can't connect
        const eventname = this.subselector ?? element.valueEventName ?? 'change';
        element.addEventListener(eventname, (evt) => this.elementValueChanged(evt));
    }

    connectViewModelListeners(viewModel) {
        debuglog("**> connectViewModelListeners ", this.auroraName, this.attribute.name, this.attribute.value);
        const selector  = this.getNormalizedSelector();
        viewModel.addPathListener(this.attribute.value, selector, (evt) => this.modelValueChanged(evt));
    }

    elementValueChanged(evt){
        const value = evt.target?.value;
        if (value == undefined) return;
        const viewModel = this.getAttachedViewModel();
        if (!viewModel) return;
        // todo [OPEN]: check validations
        const path      = this.attribute.value;
        const selector  = this.getNormalizedSelector();
        switch (selector) {
            case 'model'        : viewModel.setValueModelPath(path, value);
            case 'meta'         : viewModel.setValueMetaModelPath(path, value);
            case 'viewmodel'    : viewModel.setValueViewModelPath(path, value);
            case 'viewmodelmeta': viewModel.setValueViewModelMetaPath(path, value);
        }

    }

    modelValueChanged(evt) {
        const value = evt.value;
        if (value == undefined) return;
        const element = this.element;
        if (!element) return;
        if ('value' in element) {
            element.value = value;
        } else {
            element.innerText = value;
        }
    }

    doFirstSync() {
        debuglog("**> doFirstSync ", this.auroraName, this.attribute.name, this.attribute.value);
        if (!this.element.addInitFn) {
            (async () => {
                const value = await this.getModelValue();
                this.modelValueChanged({ value });
            })();
        } else {
            this.element.addInitFn(async () => {
                const value = await this.getModelValue();
                this.modelValueChanged({ value });
            });
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
