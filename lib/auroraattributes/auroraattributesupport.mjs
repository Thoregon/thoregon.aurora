import AuroraElement          from "../auroraelement.mjs";
import AuroraAttribute        from "./auroraattribute.mjs";

/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

const observeOptions     = {
    childList            : true,
    subtree              : true,
    attributes           : true,
    attributeOldValue    : true,
    characterData        : false,
    characterDataOldValue: false
};

const SKIP_ELEMENTS = ['VIEW', 'GRID-DEFINITION', 'TABLE-DEFINITION', 'COLUMN'];

const debuglog = (...args) => {}; // {};   // console.log(...args);

export default (base) => class AuroraAttributeSupport extends (base || Object) {

    async applyContent(container) {
        await super.applyContent(container);
        // find aurora attributes
        this.connectAuroraAttributes(container);
    }

    //
    // View
    //

    getSurroundingView() {
        let parentAuroraView = this.parentAuroraElement();
        while (parentAuroraView && !parentAuroraView.vpath) parentAuroraView = parentAuroraView.parentAuroraElement();
        return parentAuroraView;
    }


    //
    // ViewModel
    //

    async attachViewModel(viewModel) {
        const observed = this.observed(viewModel);
        observed.addEventListener('change', (evt) => observed.viewModelChange(evt));
        this.viewModel = observed;
        this.auroraAttributesAttachViewmodel(viewModel);
        const container = this.container;
        const elements = [...container.querySelectorAll('*')];
        await elements.asyncForEach(async (element) => await element.parentViewModelHasBeenAttached?.(viewModel));
    }

    auroraAttributesAttachViewmodel(viewModel) {
        if (!viewModel) return;
        const auroraAttributes = this.auroraAttributes;
        debuglog("## attach view model", this, viewModel);
        auroraAttributes?.forEach(attribute => {
            // don't change the viewmodel of attributes attached to this blueprint element
            // the parent (surrounding) view model is responsible to serve properties and functions
            if (attribute.element !== this) attribute.attachViewModel(viewModel)
        });
    }

    get viewModelToUse() {
        return this.viewModel ?? this.parentViewModel() ?? this.surroundingViewModel();
    }

    // if required override by subclasses
    useParentViewModel() {
        return this.viewModel == undefined;
    }

    parentViewModel() {
        let element = this.parentElement;
        let viewModel;
        while (!viewModel && element) {
            viewModel = element.viewModel;
            element = element.parentElement;
        }
        return viewModel;
    }

    surroundingViewModel() {
        // return this.surroundingViewModel()?.viewModel;
    }

    async parentViewModelHasBeenAttached(viewModel) {
        if (!this.useParentViewModel()) return;
        debuglog("## use parent view model", this, viewModel);
        await this.attachViewModel(viewModel);
    }

    observed(object) {
        return object.__isObserved__ ? object : AccessObserver.observe(object);
    }

    //
    // AuroraAttributes
    //

    getAuroraAttributes() {
        if (this._auroraAttributesCollected) return this.auroraAttributes;
        const auroraattributes = this.auroraAttributes =  [];
        Object.values(AuroraElement.definedAuroraAttributes).forEach((AuroraAttribute) => {
            const found = AuroraAttribute.getAttrs(this);
            if (!found.is_empty) {
                found.forEach(({ name, value }) => {
                    auroraattributes.push(AuroraAttribute.with(this, { name, value }));
                });
            }
        });
        this._auroraAttributesCollected = true;
        return auroraattributes;
    }

    connectAuroraAttributes(container) {
        container = container ?? this.container;
        // const elements = [...container.querySelectorAll('*')].filter(element => !SKIP_ELEMENTS.includes(element.tagName));
        // let auroraAttributes = this.auroraAttributes;
        this.connectSubAuroraAttributes(container, this.auroraAttributes);
        // elements.forEach(element => { auroraAttributes = [...auroraAttributes, ...element.getAuroraAttributes?.()] });
        // this.auroraAttributes = auroraAttributes;
        const viewModel = this.viewModelToUse;
        this.auroraAttributesAttachViewmodel(viewModel);
    }

    disconnectAuroraAttributes(container) {
        container = container ?? this.container;
        const auroraAttributes = this.auroraAttributes;
        auroraAttributes?.forEach((auroraAttribute) => auroraAttribute.disconnect());
    }

    connectSubAuroraAttributes(element, auroraAttributes) {
        if (SKIP_ELEMENTS.includes(element.tagName)) return;
        [...element.getAuroraAttributes?.()].forEach(auroraAttribute => auroraAttributes.push(auroraAttribute));
        const elements = [...element.children];
        elements.forEach(subelement => {
            this.connectSubAuroraAttributes(subelement, auroraAttributes);
        });
    }

    observeContentChanges(container) {
        this._mutationobserver = new MutationObserver((mutations) => this.viewMutated(mutations) );
        this._mutationobserver.observe(container ?? this.shadowRoot, observeOptions);
    }

    viewMutated(mutations) {
        mutations.forEach( (mutation) => {
            switch(mutation.type) {
                case 'childList':
                    this.nodesMutated(mutation);
                    break;
                case 'attributes':
                    this.attributeMutated(mutation);
                    break;
                // not needed to detect changes of aurora-attributes
                // case 'characterData':
                //     break;
            }
        });
    }

    attributeMutated(mutation) {
        const name      = mutation.attributeName;
        const Attribute = AuroraAttribute.whichAuroraAttribute(name);   // is it even an aurora attribute
        if (!Attribute) return;

        const element   = mutation.target;
        const value     = element.getAttribute(name);
        const attribute = this.whichAuroraAttribute(element, name);     // get the matching attribute if it is already used

        // check if the attribute has been added/modified or removed

        // attribute was removed
        if (attribute && !value) return this.removeAuroraAttribute(attribute, element);

        // attribute was modified
        if (attribute && value)  return this.modifyAuroraAttribute(attribute, value);

        // attribute was added
        if (!attribute && value) return this.addAuroraAttribute(Attribute, element, name, value);
    }

    removeAuroraAttribute(attribute, element) {
        this.auroraAttributes = this.auroraAttributes.filter(attr => attr !== attribute);
        if (element.auroraAttributes) {
            element.auroraAttributes = element.auroraAttributes.filter(attr => attr !== attribute);
        }
        attribute.detachViewModel();
        attribute.disconnectElement();
    }

    modifyAuroraAttribute(attribute, value) {
        const viewModel = this.viewModelToUse;
        attribute.update(value, viewModel);
    }

    addAuroraAttribute(Attribute, element, name, value) {
        const viewModel = this.viewModelToUse;
        const attribute = Attribute.with(element, { name, value });
        this.auroraAttributes.push(attribute);
        if (!element.auroraAttributes) element.auroraAttributes = [];
        element.auroraAttributes.push(attribute);
        if (viewModel) attribute.attachViewModel(viewModel);
    }

    whichAuroraAttribute(element, attributename) {
        const attribute = this.auroraAttributes.find(auroraattribute => auroraattribute.element === element && auroraattribute.hasName(attributename));
        return attribute;
    }

    nodesMutated(mutation) {
        const auroraAttributes = this.auroraAttributes ?? [];
        const viewModel = this.viewModelToUse;

        //
        // first remove all removed aurora attributes
        //
        const removedElements = [...mutation.removedNodes];
        const removedAuroraAttributes = [];

        removedElements.forEach(element => {
            auroraAttributes
                .filter(attribute => attribute.isForElement(element))
                .forEach(attribute => {
                    removedAuroraAttributes.push(attribute);
                    attribute.detachViewModel();
                });
        });

        // todo [OPEN]: remove also aurora attributes from child nodes
        this.auroraAttributes = auroraAttributes.filter(attribute => !removedAuroraAttributes.includes(attribute));

        //
        // now get all added aurora attributes
        //
        let addedElements = [...mutation.addedNodes];
        mutation.addedNodes.forEach(addedNode => addedElements = [...addedElements, ...addedNode.querySelectorAll?.('*') ?? []]);

        let addedAuroraAttributes = [];
        addedElements.forEach(element => { addedAuroraAttributes = [...addedAuroraAttributes, ...element.getAuroraAttributes?.() ?? [] ] });
        this.auroraAttributes = [...this.auroraAttributes, ...addedAuroraAttributes];

        if (viewModel) {
            // attach all aurora attributes to the view model
            addedAuroraAttributes.forEach(attribute => attribute.attachViewModel(viewModel));
        }
    }

    dispose() {
        const viewModel = this.viewModelToUse;
        viewModel?.dispose();
        this.disconnectAuroraAttributes();
        this._mutationobserver?.disconnect();
        const elements = [...this.container.querySelectorAll('*')];
        elements.forEach((element) => element.dispose?.());
    }

}
