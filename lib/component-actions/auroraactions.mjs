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


    static get observedAttributes() {
        return [...super.observedAttributes, 'visible'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'visible' :
                if ( ! this.container ) return;
                this.propertiesValues()['visible'] = newValue;

                let actions = this.container.querySelector('.aurora-actions-wrapper');
                this.removeClassesWithPrefix(actions, 'visible-');

                actions.classList.add( this.getClassVisible( newValue ) );
                break;
        }
        return super.attributeChangedCallback(name, oldValue, newValue);
    }


    async existsConnect() {
        super.existsConnect();
        let properties = this.propertiesValues();
//        let builder = new AuroraActionBuilderMenu;
        let builder = new AuroraActionBuilderIconContainer;

        let menuHTML = builder.renderActions(this.parentViewModel(), 'default' );

        let wrapper = this.container.querySelector('.aurora-actions-wrapper');
        wrapper.innerHTML = menuHTML;

        this.behavior.connectActions();
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
                default    : 'menu',
                type       : 'string',
                description: 'Type of representation',
                group      : 'Behavior',
                example    : 'menu | iconcontainer'
            },
            'visible': {
                default    : 'on',
                type       : 'string',
                description: 'should the actions be visible',
                group      : 'Behavior',
                example    : 'on | off'
            },
            'position': {
                default    : 'right',
                type       : 'string',
                description: 'The position will have an impact on the alignment of the actions',
                group      : 'Behavior',
                example    : 'right | left'
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

        classes.push( this.getClassVisible( propertiesValues['visible'] ) );
        classes.push( this.getClassPosition( propertiesValues['position'] ) );

        return classes;
    }

    getClassPosition( propertiesValue ) {
        return  ( propertiesValue == "right" )
                ? "position-right"
                : "position-left";
    }

    getClassVisible( propertiesValue ) {
        return  ( propertiesValue == "on")
                ? "visible-on"
                : "visible-off";
    }

    async adjustContent(container) {
 //       container.classList.add("aurora-actions-wrapper");
    }

    get appliedTemplateName() {
        return 'actions';
    }

    use(obj, attr) {
        this.input.setAttribute('value', obj[attr]);
    }
}

AuroraActions.defineElement();

