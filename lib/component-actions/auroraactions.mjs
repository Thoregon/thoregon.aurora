/*
 * Copyright (c) 2021.
 */

/**
 *
 * @author: Martin Neitz, Bernhard Lukassen
 */

import AuroraFormElement      from "../formcomponents/auroraformelement.mjs";
import AuroraAttributeSupport from "../auroraattributes/auroraattributesupport.mjs";

import {    AuroraActionBuilderIconContainer,
            AuroraActionBuilderMenu,
            AuroraActionBuilderIconList,
            AuroraActionBuilderView } from "../component-actions/auroaactionsbuilder.mjs";

export default class AuroraActions extends AuroraAttributeSupport(AuroraFormElement) {

    constructor() {
        super();
        this._actions    = {};
        this._actionView = undefined;
    }

    get actions() { return this._actions;}
    set actions( actions ) {
        this._actions = actions;
        this.renderActions()
    }

    get actionView() { return this._actionView;}
    set actionView( actionView ) { this._actionView = actionView; }


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
        this.renderActions();

    }

    renderActions() {
        if (this.actions.is_empty) return;
        let actionView = this.applyActionView();
        let actions    = this.applyActions();

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
            case 'view' :
                builder      = new AuroraActionBuilderView;
                builder.view = actionView;
                break;
            case 'iconmenu':
                builder = new AuroraActionBuilderMenu;
                builder.showIcons = true;
                break;
            case 'menu' :
                builder = new AuroraActionBuilderMenu;
                break;
        }
        let actionsHTML = builder.renderActions( this.actions );   // todo [$$@AURORACLEANUP]: no viewmodel available

        let wrapper = this.container.querySelector('.aurora-actions-wrapper');
        wrapper.innerHTML = actionsHTML;

        this.behavior.connectActions( this.actions );

    }

    applyActionView() {
        return this.querySelector('view')?.innerHTML;

    }
    applyActions() {}


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
                example    : 'menu | iconcontainer | view'
            },
            'visible': {
                default    : 'on',
                type       : 'string',
                description: 'should the actions be visible',
                group      : 'Behavior',
                example    : 'on | off'
            },

            'align': {
                default    : 'right',
                type       : 'string',
                description: 'The position will have an impact on the alignment of the actions',
                group      : 'Behavior',
                example    : 'right | middle | left'
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

        classes.push( 'visible-' + propertiesValues['visible'] );
        classes.push( 'align-'   + propertiesValues['align'] );
        classes.push( 'mode-'    + propertiesValues['mode'] );

        return classes;
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

