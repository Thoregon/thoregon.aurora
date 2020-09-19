/**
 * An indicator showing the validation status of all
 * aurora form elements in the document
 *
 * todo [OPEN]: watch document if an aurora element is added or removed
 *
 * @author: Bernhard Lukassen
 */

import { doAsync }   from "/evolux.universe";

import AuroraElement from "../auroraelement.mjs";

const validsign = '☑';
const invalidsign = '☒';
    // '  ⃝ ⃞'

export default class AuroraValidationIndicator extends AuroraElement {

    constructor() {
        super();
        this.stateListener = (evt) => this.validStateChanged(evt);
        this.elements      = [];
    }
    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-validation-indicator';
    }

    elementStyle() {
        return `
            :host(aurora-validation-indicator) { display: inline-block; }
            ${super.elementStyle()}
            .indicator { width: 1.2em; height: 1.2em; font-size: 150%; text-align: center; font-weight: bold; font-family: -apple-system,'BlinkMacSystemFont','Segoe UI','Roboto','Lato','Helvetica','Arial',sans-serif; }
            .indicator:before { content: '☒'; color: red; }
            .valid:before { content: '☑'; color: green; }
        `;
    }

    static get observedAttributes() {
        return [...super.observedAttributes, 'is-valid'];
    }

    static forwardedAttributes() {
        return { ...super.forwardedAttributes(), 'is-valid': {} };
    }

    applyContent(container) {
        container.classList.add('indicator', 'valid');
        this.setAttribute('is-valid', true);
        (async () => {
            await doAsync();
            this.scanDocument();
        })();
    }

    adjustElements(mutations) {
        if (mutations.length === 0) return;
        mutations.forEach(mutation => {
            this.addNodes(mutation.addedNodes);
            this.removeNodes(mutation.removedNodes);
        });
    }

    scanDocument() {
        let auroraNodes = [];
        this.addAuroraChildNodes(auroraNodes, document.body);
        this.addNodes(auroraNodes);
    }

    addAuroraChildNodes(collection, element) {
        element.childNodes.forEach(elem => {
            if (elem.isAuroraFormElement) collection.push(elem);
            this.addAuroraChildNodes(collection, elem);
        });
    }

    addNodes(nodes) {
        nodes.forEach(node => {
            if (node.isAuroraFormElement) {
                node.addEventListener('valid-state',  this.stateListener);
                this.elements.push(node);
            }
        });
    }

    removeNodes(nodes) {
        nodes.forEach(node => {
             if (node.isAuroraElement) {
                 node.removeEventListener('valid-state', this.stateListener);    // maybe this is unnecessary because the event listeners are removed automatically -> check
                 let i = this.elements.indexOf(node);
                 if (i > -1) this.elements.splice(i,1);
             }
        });
    }

    validStateChanged(evt) {
        if (this.hasErrors()) {
            this.container.classList.remove('valid');
        } else {
            this.container.classList.add('valid');
        }
    }

    hasErrors() {
        return !!this.elements.find(elem => elem.hasErrors());
    }

    get errors() {
        return this.elements.reduce((errors, elem) => {
            if (elem.hasErrors()) errors.set(elem, elem.structuredErrors());
            return errors;
        }, new Map()) ;
    }

    connectedCallback() {
        super.connectedCallback();
        let mutationobserver = new MutationObserver((mutations) => this.adjustElements(mutations));
        mutationobserver.observe(document.body, { childList: true, subtree: true });
        this.mutationobserver = mutationobserver;
    }

    disconnectedCallback() {
        // todo [OPEN]: remove all event listeners
    }

    attributeChangedCallback(name, oldValue, newValue) {
    }

    get auroraname() {
        return 'validationindicator';
    }

    /*
     * View models
     * todo [OPEN]: attach to validation events of the view model
     */

    attachViewModel(viewModel) {
        // this.viewModel = viewModel;
        viewModel.addEventListener('valid-state',  this.stateListener);
        this.elements.push(viewModel);
    }

    detachViewModel(viewModel) {
        delete this.viewModel;
    }

}

AuroraValidationIndicator.defineElement();
