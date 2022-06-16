/*
 * Copyright (c) 2021.
 */

/**
 *
 *
 * @author: Martin Neitz
 */

import AuroraFormElement        from "./auroraformelement.mjs";

export default class AuroraStepper extends AuroraFormElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-stepper';
    }

    /*
     * aurora element features
     */

    static get observedAttributes() {
        return [...super.observedAttributes, "start_step"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'start_step':
                this.attributeChangedCallbackForStartStep( oldValue, newValue );
                break;
        }
        return super.attributeChangedCallback(name, oldValue, newValue);
    }

    attributeChangedCallbackForStartStep( oldValue, newValue ) {

        let steps = ( this.container )
            ? Array.from( this.auroraChildNodes() )
            : Array.from( this.children );

        steps.forEach ( step => {
            if ( step.getAttribute('step_id') == newValue ) {
                step.classList.remove('hidden');
            } else {
                step.classList.add('hidden');
            }
        });
    }

    // theme ... component... templates

    get componentConfiguration() {
       return {
           theme: 'material',
           component: 'component-stepper',
           templates: ['stepper'],
       }
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            start_step: {
                default:        '',
                type:           'text',
                description:    'Id of the step the stepper should start with',
                group:          'behavior',
                example:        '01'
            }
        });
    }

    propertiesAsBooleanRequested() {
        return {};
    }

    getDefaultWidth() { return false; }

    /**
     *  routine to add all needed classes.
     *  This only can be done on the element level as it will be differ from element to element
    */
    collectClasses() {
        //--- 1: first get the classes added from the dom element
        //--- 2: analyse the transferred attributes
        let classes = [];
        let propertiesValues = this.propertiesValues();

        return classes;
    }

    async existsConnect() {
        const steps = this.childAuroraElements;
    }

    navigate( step, action ) {
        let steps            = this.childAuroraElements;
        let position         = steps.indexOf(step);
        let number_of_steps  = steps.length;
        let position_to_show = position;

        switch ( action ) {
            case 'next':
                position_to_show =  ( position + 2 > number_of_steps )
                                    ? position
                                    : position + 1;
                break;
            case 'back':
                position_to_show =  ( position - 1 >= 0 )
                                    ? position - 1
                                    : position;
                break;
            default:
                position_to_show =  position;
                break;
        }

        let step_to_show  = steps[position_to_show];

        steps.forEach ( step => {
            if ( step == step_to_show ) {
                step.classList.remove('hidden');
            } else {
                step.classList.add('hidden');
            }
        });
    }

    async calculatedValues() {
        let propertiesValues = this.propertiesValues();

        return {};
    }

    async adjustContent(container) {
        container.classList.add("aurora-stepper-wrapper");
    }

    get appliedTemplateName() {
        return 'stepper';
    }

    use(obj, attr) {
        this.input.setAttribute('value', obj[attr]);
    }

    connectedCallback() {
        super.connectedCallback();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('click', this._clickhandler);
    }
}

AuroraStepper.defineElement();
