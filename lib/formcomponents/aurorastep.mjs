/*
 * Copyright (c) 2021.
 */

/**
 *
 *
 * @author: Martin Neitz
 */

import AuroraFormElement        from "./auroraformelement.mjs";

export default class AuroraStep extends AuroraFormElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-step';
    }

    /*
     * aurora element features
     */

    get isTrigger() {
        return true;
    }


    /*
     * Exposed Events
     */

/*
    exposedEvents() {
        return Object.assign(super.exposedEvents(), {
            click: {
                select  : 'button'
            }
        });
    }
*/

    // theme ... component... templates

    get componentConfiguration() {
       return {
           theme: 'material',
           component: 'component-stepper',
           templates: ['step'],
       }
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            step_id: {
                default:        '',
                type:           'number',
                description:    'ID of the single step within the stepper',
                group:          'Control',
                example:        '01 | one '
            },
            default_navigation: {
                default:        'true',
                type:           'boolean',
                description:    'Show the default next previous navigation',
                group:          'Control',
                example:        'true | false '
            },
            position: {
                default:        'middle',
                type:           'text',
                description:    'The position describes the possbile actions',
                group:          'Control',
                example:        'first | middle | last '
            },
        });

    }

    propertiesAsBooleanRequested() {
        return {
            default_navigation: 'usedefaultnavigation',
        };
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

        classes.push( propertiesValues['position'] );
        return classes;
    }

    listenTo(childcontainer) {
        let buttons = childcontainer.querySelectorAll('*[stepper-action]');
        [...buttons].forEach(button => {
            let action = button.getAttribute("stepper-action");
            if (action && !button.hasAttribute("aurora-action")) {
                button.addEventListener('click', (evt) => this.stepperAction(action));
            }
        })
    }

    handleActionTriggered(mutation) {
        let action = mutation.event.target.getAttribute("stepper-action");
        if (!action) return false;
        return this.stepperAction(action);
    }

    stepperAction(action) {
        console.log(action);
        let stepper = this.parentAuroraElement();
        debugger;
    }

    async calculatedValues() {
        let propertiesValues = this.propertiesValues();

        return {};
    }

    async adjustContent(container) {
        container.classList.add("aurora-step-wrapper");
    }

    get appliedTemplateName() {
        return 'step';
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

AuroraStep.defineElement();
