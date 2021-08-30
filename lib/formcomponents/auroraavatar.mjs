
/*
 * Copyright (c) 2021.
 */

/**
 * @author: Martin Neitz
 */

import AuroraFormElement        from "./auroraformelement.mjs";

export default class AuroraAvatar extends AuroraFormElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-avatar';
    }

    /*
     * aurora element features
     */

    get isTrigger() {
        return true;
    }



    // theme ... component... templates

    get componentConfiguration() {
        return {
            theme: 'material',
            component: 'avatar',
            templates: ['avatar'],
        }
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            icon: {
                default:        '',
                type:           'string',
                description:    'Icon name following Aurora convention; Make sure you have the icon library installed unless you are using \'img:\' prefix\n',
                group:          'Behavior',
                example:        'settings | img:https://thatsme.plus/wp-content/uploads/2020/12/logo.png'
            },
            avatarstyle: {
                default:        'square',
                type:           'string',
                description:    'select the avatar style',
                group:          'Behavior',
                example:        'round | rounded | square'
            },
        });
    }

    propertiesAsBooleanRequested() {
        //--- check if icon or image url ----
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
        let classes = super.collectClasses();
        let propertiesValues = this.propertiesValues();

        return classes;
    }

    getCalculatedProperties() {
        let propertiesValues = this.propertiesValues();
        let iconOrURL        = propertiesValues['icon'];
        let useIconURL       = false;

        if ( iconOrURL.startsWith('img:') ) {
            iconOrURL = iconOrURL.substring(4);
            useIconURL = true;
        }

        return {
            icon: iconOrURL,
            useiconurl: useIconURL,
        }
    }

    async adjustContent(container) {
        container.classList.add("aurora-avatar-wrapper");
    }

    get appliedTemplateName() {
        return 'avatar';
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

AuroraAvatar.defineElement();
