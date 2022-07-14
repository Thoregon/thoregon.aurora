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
import {    AuroraActionBuilderIconContainer,
            AuroraActionBuilderMenu,
            AuroraActionBuilderIconList } from "../component-actions/auroaactionsbuilder.mjs";

export default class AuroraActions extends AuroraFormElement {

    constructor() {
        super();
        this._actions = {};
    }

    get actions() { return this._actions;}
    set actions( actions ) { this._actions = actions; }

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

    static get observedAttributes() {
        return [...super.observedAttributes, 'visible', 'mode'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if ( ! this.container ) return super.attributeChangedCallback(name, oldValue, newValue);
        let actions = this.container.querySelector('.aurora-actions-wrapper');

        switch (name) {
            case 'visible' :
                this.propertiesValues()['visible'] = newValue;
                this.removeClassesWithPrefix(actions, 'visible-');
                actions.classList.add( this.getClassVisible( newValue ) );
                break;
            case 'mode':
                this.propertiesValues()['mode'] = newValue;
                this.removeClassesWithPrefix(actions, 'mode-');
                actions.classList.add( 'mode-' + newValue );
                break;
        }
        return super.attributeChangedCallback(name, oldValue, newValue);
    }


    async existsConnect() {
        super.existsConnect();
        let properties = this.propertiesValues();

        let menumode = properties.mode;
        let builder;

        switch ( menumode ) {
            case 'iconcontainer' :
                builder = new AuroraActionBuilderIconContainer;
                break;
            case 'iconlist' :
                builder = new AuroraActionBuilderIconList;
                break;
            default:
                builder = new AuroraActionBuilderMenu;
                break;
        }
        let menuHTML = builder.renderActions( this.actions );   // todo [$$@AURORACLEANUP]: no viewmodel available

        let wrapper = this.container.querySelector('.aurora-actions-wrapper');
        wrapper.innerHTML = menuHTML;

        this.behavior.connectActions( this.actions );
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

    get viewmodel()     { return this._vm; }
    set viewmodel( vm ) { this._vm = vm; }

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
        classes.push( 'mode-' + propertiesValues['mode'] );

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

