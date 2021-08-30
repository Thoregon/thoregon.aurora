/*
 * Copyright (c) 2021.
 */

import AuroraBlueprintElement from "./aurorablueprintelement.mjs";

export default class AuroraHeader extends AuroraBlueprintElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-header';
    }

    /*
     * Structure
    */

    async connect() {
        this.getAuroraBlueprint().header = this;
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
            component: 'blueprint-header',
            templates: ['header'],
        }
    }

    propertiesDefinitions() {
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            position: {
                default:        'fixed-top',
                type:           'string',
                description:    'How should the header be positioned. ',
                group:          'Behavior',
                example:        'fixed-top | absolute-top'
            },
            separator: {
                default:        'bordered',
                type:           'string',
                description:    'The style of the separator',
                group:          'Behavior',
                example:        'none | bordered | elevated'
            },
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
        let classes = [];
        let propertiesValues = this.propertiesValues();
        let blueprint        = this.getAuroraBlueprint();

        if ( blueprint != undefined ) {
            if (blueprint.isHeaderFixed()) {
                classes.push('fixed-top');
            } else {
                classes.push('absolute-top');
            }
        } else {
            if ( propertiesValues['position'] )  { classes.push( propertiesValues['position'] ); }
        }

        if ( propertiesValues['separator'] )  { classes.push( propertiesValues['separator'] ); }

        return classes;
    }

    get offsetHeight() {
        let header = this.container.querySelector('.aurora-header');
        if ( header ) {
            return header.offsetHeight;
        }
        return "0";
    }

    async adjustContent(container) {
        container.classList.add("aurora-header-wrapper");
    }

    get appliedTemplateName() {
        return 'header';
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

AuroraHeader.defineElement();
