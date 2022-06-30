/*
 * Copyright (c) 2022.
 */

/**
 *
 * @author: Martin Neitz, Bernhard Lukassen
 */

import { asyncWithPath } from "/evolux.util/lib/pathutils.mjs";
import AuroraFormElement from "../formcomponents/auroraformelement.mjs";
import VisibilityObserver from "/thoregon.aurora/lib/visibilityobserver.mjs";

export default class AuroraNavigationItem extends AuroraFormElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-navigation-item';
    }

    static get observedAttributes() {
        return [...super.observedAttributes, 'mode' ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if ( ! this.container ) return;

        switch (name) {
            case 'mode' :
                this.propertiesValues()['mode'] = newValue;
                this.determineAndSetHandler( true );
                this.activateWhenReady();
                break;
        }
        return super.attributeChangedCallback(name, oldValue, newValue);
    }


    get componentConfiguration() {

        return {
            theme    : 'material',
            component: 'component-navigationitem',
            templates: ['navigationitem'],
        }
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            mode: {
                default:        'icon-label',
                type:           'string',
                description:    'A text Label that will describe the Field',
                group:          'Content',
                example:        'icon-label | icon | bar'
            },
            label: {
                default:        '',
                type:           'string',
                description:    'A text Label that will describe the Field',
                group:          'Content',
                example:        'FirstName'
            },
            icon: {
                default:        '',
                type:           'string',
                description:    'Name of the icon to be used',
                group:          'Content',
                example:        'globe'
            },
            badge: {
                default:        '',
                type:           'string',
                description:    'Information for the badge in the navigation item',
                group:          'Content',
                example:        '+67'
            },
            route: {
                default:        '',
                type:           'string',
                description:    'Information for the badge in the navigation item',
                group:          'Content',
                example:        '+67'
            }
            // dense
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

        if (propertiesValues['dense']) {
            classes.push('dense');
        }

        if (propertiesValues['fullwidth']) {
            classes.push('fullwidth');
        }

        return classes;
    }

    async adjustContent(container) {
        container.classList.add("aurora-navigationitem-wrapper");
    }

    get appliedTemplateName() {
        return 'navigationitem';
    }

    triggerRoute() {
        return true;
    }

}

AuroraNavigationItem.defineElement();
