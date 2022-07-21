/*
 * Copyright (c) 2022.
 */

/**
 *
 * @author: Martin Neitz, Bernhard Lukassen
 */

import AuroraFormElement from "../formcomponents/auroraformelement.mjs";
import { asyncWithPath } from "/evolux.util/lib/pathutils.mjs";
import ListItemViewModel from "../viewmodel/listitemviewmodel.mjs";
import { AuroraActionBuilderIconContainer, AuroraActionBuilderMenu } from "../component-actions/auroaactionsbuilder.mjs";

export default class AuroraAlert extends AuroraFormElement {
// AuroraList
    _columns = {};

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-alert';
    }

    /*
     * aurora element features
     */


    // theme ... component... templates

    get componentConfiguration() {

        return {
            theme    : 'material',
            component: 'component-alert',
            templates: ['alert'],
        }
    }

    static get observedAttributes() {
        return [...super.observedAttributes, 'content' ];
    }

    attributeChangedCallback(name, oldValue, newValue) {

        if ( ! this.container ) return;

        switch (name) {
            case 'content' :
                let main = this.container.querySelector('[aurora-slot="main"]');
                main.innerHTML = newValue;
                break;
        }
        return super.attributeChangedCallback(name, oldValue, newValue);
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            'type'          : {
                default    : 'info',
                type       : 'string',
                description: 'Type of representation',
                group      : 'Behavior',
                example    : 'info | success | danger | warning'
            },
            'dismissable'         : {
                default    : false,
                type       : 'boolean',
                description: 'can the Alter be dismissed from the user',
                group      : 'Behavior',
                example    : 'true'
            },
            'content' : {
                default    : '',
                type       : 'string',
                description: 'content to be displayed',
                group      : 'Content',
                example    : 'Currently the system is not available'
            }

        });
    }

    propertiesAsBooleanRequested() {
        return {};
    }

    /**
     *  routine to add all needed classes.
     *  This only can be done on the element level as it will be differ from element to element
     */
    collectClasses() {
        let classes          = [];
        let propertiesValues = this.propertiesValues();

        if (propertiesValues['type']) {
            classes.push('type-'+ propertiesValues['type'] );
        }

        if (propertiesValues['fullwidth']) {
            classes.push('fullwidth');
        }

        return classes;
    }

    async adjustContent(container) {
        container.classList.add("aurora-alert-wrapper");
    }

    get appliedTemplateName() {
        return 'alert';
    }

}

AuroraAlert.defineElement();
