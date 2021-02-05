/**
 *
 * @see [MutationObserver](https://developer.mozilla.org/de/docs/Web/API/MutationObserver)
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */
import ModelItem from "./modelitem.mjs";


export default class AttributeItem extends ModelItem {

    constructor(viewModel) {
        super();
        this.viewModel = viewModel;
    }

    static itemFor(viewModel) {
        let vmitem = new this(viewModel);
        return vmitem;
    }

    attachView(view, attribute) {
        this.view      = view;
        this.attribute = attribute;
        this.observer  = new MutationObserver((mutations) => this.attributeChanged(mutations));
        this.observer.observe(view, { attributes: true, attributeFilter: [attribute] });
        return this;
    }

    get name() {
        return this.attribute;
    }


    // to east -> update view
    mutate(mutation) {
        console.log('AttributeItem->2east', JSON.stringify(mutation));
        this.view.setAttribute(this.name, mutation.value);
    }

    // to west -> update model
    mutated(value) {
        console.log('AttributeItem->2west', value);
        let mutation = { vm: this.viewModel, identifier: this.identifier, name: this.name, value };
        this.viewModel.toWest(mutation);
    }

    attributeChanged(mutations) {
        if (mutations.length === 0) return;
        let value = mutations[0].target.getAttribute(this.attribute);
        this.mutated(value);
    }
}
