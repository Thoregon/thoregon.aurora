/**
 *
 *
 * @author: Bernhard Lukassen
 */

import AuroraFormElement        from "./auroraformelement.mjs";

export default class AuroraButton extends AuroraFormElement {



    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-button';
    }

    static get observedAttributes() {
        return [...super.observedAttributes, 'disabled' ];
    }

    static forwardedAttributes() {
        return Object.assign(super.forwardedAttributes(), {
            disabled: { select: 'button' }
        });
    }


    /*
     * aurora element features
     */

    isDrawerToggleTrigger() {
        let properties = this.propertiesValues();
        if ( properties['@toggleleftdrawer']  ||
             properties['@togglerightdrawer'] ) {
            return true;
        } else {
            return false;
        }
    }

    isDrawerOpenerTrigger() {
        let properties = this.propertiesValues();
        if ( properties['@openrightdrawer']  ||
             properties['@openleftdrawer'] ) {
            return true;
        } else {
            return false;
        }
    }

    isDrawerCloserTrigger() {
        let properties = this.propertiesValues();
        if ( properties['@closerightdrawer']  ||
             properties['@closeleftdrawer'] ) {
            return true;
        } else {
            return false;
        }
    }

    isRightDrawerToggle() { return this.propertiesValues()['@togglerightdrawer']; }
    isLeftDrawerToggle()  { return this.propertiesValues()['@toggleleftdrawer']; }
    isRightDrawerOpener() { return this.propertiesValues()['@openrightdrawer']; }
    isLeftDrawerOpener()  { return this.propertiesValues()['@openleftdrawer']; }
    isRightDrawerCloser() { return this.propertiesValues()['@closerightdrawer']; }
    isLeftDrawerCloser()  { return this.propertiesValues()['@closeleftdrawer']; }

    async renderForMount() {
        if ( this.isDrawerToggleTrigger() ) {
            this.getAuroraBlueprint().registerDrawerToggle( this );
        }
        if ( this.isDrawerOpenerTrigger() ) {
            this.getAuroraBlueprint().registerDrawerOpener( this );
        }
        if ( this.isDrawerCloserTrigger() ) {
            this.getAuroraBlueprint().registerDrawerCloser( this );
        }
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
           component: 'form-button',
           templates: ['button'],
       }
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            label: {
                default:        '',
                type:           'string',
                description:    'A text Label that will describe the Field',
                group:          'Content',
                example:        'Save changes'
            },
            icon: {
                default:        '',
                type:           'string',
                description:    'Name of the icon to be used infront of the field',
                group:          'Content',
                example:        'globe'
            },
            flat: {
                default:        false,
                type:           'boolean',
                description:    'flat button style',
                group:          'Style',
                example:        'true'
            },
            color: {
                default:        'secondary',
                type:           'text',
                description:    'name of the color to be used',
                group:          'Style',
                example:        'negative'
            },
            dense: {
                default:        false,
                type:           'boolean',
                description:    'Dense mode; occupies less space',
                group:          'Style',
                example:        'true'
            },
            float: {
                default:        'left',
                type:           'text',
                description:    'Position of the button within the given space',
                group:          'Style',
                example:        'left | right'
            },
            borderstyle: {
                default:        '',
                type:           'string',
                description:    'flat button style',
                group:          'Style',
                example:        'round | rounded '
            },
            '@toggleleftdrawer': {
                default:        false,
                type:           'boolean',
                description:    'trigger',
                group:          'Events',
                example:        'true'
            },
            '@togglerightdrawer': {
                default:        false,
                type:           'boolean',
                description:    'trigger',
                group:          'Events',
                example:        'true'
            },
            '@openrightdrawer': {
                default:        false,
                type:           'boolean',
                description:    'trigger',
                group:          'Events',
                example:        'true'
            },
            '@openleftdrawer': {
                default:        false,
                type:           'boolean',
                description:    'trigger',
                group:          'Events',
                example:        'true'
            }
        });
    }

    propertiesAsBooleanRequested() {
        return {
            icon    : 'useicon',
            label   : 'haslabel',
            disabled: 'isdisabled',
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
        let classes = super.collectClasses();
        let propertiesValues = this.propertiesValues();

        if ( propertiesValues['useicon'] )   { classes.push('with-icon'); }
        if ( propertiesValues['disabled'] )  { classes.push('disabled'); }
        if ( propertiesValues['fullwidth'] ) { classes.push('fullwidth'); }
        if ( propertiesValues['flat'] )      { classes.push('flat'); }
        if ( propertiesValues['dense'] )     { classes.push('dense'); }

        classes.push('float-' + propertiesValues['float']);

        classes.push('color-' + propertiesValues['color']);

        classes.push( propertiesValues['borderstyle'] );
        return classes;
    }

    async adjustContent(container) {
        container.classList.add("aurora-button-wrapper");
    }

    get appliedTemplateName() {
        return 'button';
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

AuroraButton.defineElement();
