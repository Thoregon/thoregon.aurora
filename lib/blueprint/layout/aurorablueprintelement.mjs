/**
 *
 *  Base class for all parts building a blueprint
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import { halt }      from "/evolux.universe";

import AuroraElement   from "../../auroraelement.mjs";
import AuroraAttribute from "../../auroraattributes/auroraattribute.mjs";

const observeOptions     = {
    childList            : true,
    subtree              : true,
    attributes           : true,
    attributeOldValue    : true,
    characterData        : false,
    characterDataOldValue: false
    };

export default class AuroraBlueprintElement extends AuroraElement {

    constructor() {
        super();
        this.app = this.getAuroraAppElement();
        this.auroraAttributes = [];
    }

    async applyContent(container) {
        await super.applyContent(container);
        // find aurora attributes
        this.connectAuroraAttributes(container);
    }

    viewContentElement(element) {
        let target = this.target;
        target.innerHTML = '';
        target.appendChild(element);
        return target;
    }

    get containerContent() {
        let target = this.container; // this.target;
        return target ? target.innerHTML : '';
    }

    set containerContent(content) {
        let target = this.container; // this.target;
        if (target) target.innerHTML = content;
    }

    get target() {
        // if (this._target) return this._target;
        this._target = this.container.querySelector('*[aurora-slot="main"]') || this.container;
        return this._target;
    }

    getAuroraBlueprint() {
        this.blueprint = super.getAuroraBlueprint();
        return this.blueprint;
    }

    propertiesDefinitions() {
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            view: {
                default:        '',
                type:           'string',
                description:    'View to be displays inside this part',
                group:          'Structure',
                example:        ''
            },
        });
    }

    //
    // aurora element
    //

    static get observedAttributes() {
        return [...super.observedAttributes, 'ref', 'property'];
    }

    get isAuroraView() {
        return true;
    }

    //
    // view properties
    //

    get modelRef() {
        return this.getAttribute("model-ref");
    }

    set modelRef(r) {
        this.setAttribute("model-ref", r);
    }

    get property() {
        return this.getAttribute("property");
    }

    set property(p) {
        this.setAttribute("property", p);
    }

    propertiesDefinitions() {
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            'model-ref': {
                default:        '',
                type:           'string',
                description:    'Reference to an entity. Either \'model-ref\' or \'property\' can be used.',
                group:          'Structure',
                example:        ''
            },
            property: {
                default:        '',
                type:           'string',
                description:    "Property of an entity. Either 'model-ref' or 'property' can be used.",
                group:          'Structure',
                example:        ''
            },
        });
    }

    propertiesAsBooleanRequested() { return {} }

    //
    // view structure
    //

    //
    // ViewModel
    //

    attachViewModel(viewModel) {
        this.viewModel = viewModel;
        const auroraAttributes = this.auroraAttributes;
        auroraAttributes.forEach(attribute => attribute.attach(viewModel));
        const container = this.container;
        const elements = [...container.querySelectorAll('*')];
        elements.forEach(element => element.parentViewModelHasBeenAttached?.(viewModel));
    }

    get viewModelToUse() {
        return this.viewModel ?? this.parentViewModel();
    }

    // if required override by subclasses
    get useParentViewmodel() {
        return this.viewModel != undefined;
    }

    parentViewModelHasBeenAttached(viewModel) {
        if (this.useParentViewmodel) return;
        this.attachViewModel(viewModel);
    }

    //
    // AuroraAttributes
    //

    connectAuroraAttributes(container) {
        container = container ?? this.container;
        const elements = [...container.querySelectorAll('*')];
        let auroraAttributes = this.auroraAttributes;
        elements.forEach(element => { auroraAttributes = [...auroraAttributes, ...element.getAuroraAttributes?.()] });
        this.auroraAttributes = auroraAttributes;
        const viewModel = this.viewModelToUse;
        if (viewModel) auroraAttributes.forEach(attribute => attribute.attach(viewModel));
    }

    observerContentChanges(container) {
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
        attribute.detach();
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
        if (viewModel) attribute.attach(viewModel);
    }

    whichAuroraAttribute(element, attributename) {
        const attribute = this.auroraAttributes.find(auroraattribute => auroraattribute.element === element && auroraattribute.hasName(attributename));
        return attribute;
    }

    nodesMutated(mutation) {
        const auroraAttributes = this.auroraAttributes;
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
                    attribute.detach();
                });
        });

        this.auroraAttributes = auroraAttributes.filter(attribute => !removedAuroraAttributes.includes(attribute));

        //
        // now get all added aurora attributes
        //
        const addedElements   = [...mutation.addedNodes];
        let addedAuroraAttributes = [];

        addedElements.forEach(element => { addedAuroraAttributes = [...addedAuroraAttributes, ...element.getAuroraAttributes?.() ?? [] ] });
        this.auroraAttributes = [...this.auroraAttributes, ...addedAuroraAttributes];

        if (viewModel) {
            // attach all aurora attributes to the view model
            addedAuroraAttributes.forEach(attribute => attribute.attach(viewModel));
        }
    }

    disposeView() {
        super.disposeView();
        this._mutationobserver?.disconnect();
    }
}

/*
 * Aurora Behavior Polyfills (Extensions) for HTMLElements
 */

Object.defineProperties(Node.prototype, {
    isAuroraBlueprintElement: { value: false, configurable: true, enumerable: true, writable: true },
});
