/*
 * Copyright (c) 2021.
 */

/**
 *
 * @author: Martin Neitz, Bernhard Lukassen
 */

import AuroraFormElement from "../formcomponents/auroraformelement.mjs";
import { asyncWithPath } from "/evolux.util/lib/pathutils.mjs";
import ListItemViewModel from "../viewmodel/listitemviewmodel.mjs";
import { AuroraActionBuilderIconContainer, AuroraActionBuilderMenu } from "../component-actions/auroaactionsbuilder.mjs";

export default class AuroraActions extends AuroraFormElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-actions';
    }

    /*
     * aurora element features
     */

    get isTrigger() {
        return true;
    }

    async existsConnect() {
        super.existsConnect();
        let properties = this.propertiesValues();
        let builder = new AuroraActionBuilderMenu;

        let menuHTML = builder.renderActions(this.parentViewModel(), 'default' )
    }

    get isCollectionItem() {
        return true;
    }

    // theme ... component... templates

    get componentConfiguration() {

        return {
            theme    : 'material',
            component: 'component-actions',
            templates: ['actions'],
        }
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            'mode': {
                default    : 'table',
                type       : 'string',
                description: 'Type of representation',
                group      : 'Behavior',
                example    : 'menu | grid'
            },
        });
    }

    propertiesAsBooleanRequested() {
        return {};
    }

    getDefaultWidth() {
        return false;
    }

    /**
     *  routine to add all needed classes.
     *  This only can be done on the element level as it will be differ from element to element
     */
    collectClasses() {
        let classes          = [];
        let propertiesValues = this.propertiesValues();


        return classes;
    }

    async adjustContent(container) {
        container.classList.add("aurora-actions-wrapper");
    }

    get appliedTemplateName() {
        return 'actions';
    }

    use(obj, attr) {
        this.input.setAttribute('value', obj[attr]);
    }
}

AuroraActions.defineElement();

