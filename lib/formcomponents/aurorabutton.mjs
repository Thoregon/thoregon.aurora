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
        return [...super.observedAttributes, 'disabled', 'autofocus', 'label' ];
    }

    static forwardedAttributes() {
        return Object.assign(super.forwardedAttributes(), {
            disabled: { select: 'button' },
            autofocus: { select: 'button' },
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if ( ! this.container ) return;

        switch (name) {
            case 'label' :
                this.behavior?.setAttributeLabel(newValue);
                break;
            case 'autofocus' :
                let button = this.container.querySelector('.aurora-button');
                button.addAttribute('value', 'default');
                break;
        }
        return super.attributeChangedCallback(name, oldValue, newValue);
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

    isDrawerOpenTrigger() {
        let properties = this.propertiesValues();
        if ( properties['@openrightdrawer']  ||
             properties['@openleftdrawer'] ) {
            return true;
        } else {
            return false;
        }
    }

    isDrawerCloseTrigger() {
        let properties = this.propertiesValues();
        if ( properties['@closerightdrawer']  ||
             properties['@closeleftdrawer'] ) {
            return true;
        } else {
            return false;
        }
    }

    isDrawerCollapseTrigger() {
        let properties = this.propertiesValues();
        if ( properties['@collapserightdrawer']  ||
            properties['@collapseleftdrawer'] ) {
            return true;
        } else {
            return false;
        }
    }
    isDrawerExpandTrigger()   {
        let properties = this.propertiesValues();
        if ( properties['@expandrightdrawer']  ||
            properties['@expandleftdrawer'] ) {
            return true;
        } else {
            return false;
        }
    }

    isRightDrawerToggleTrigger()    { return this.propertiesValues()['@togglerightdrawer']; }
    isLeftDrawerToggleTrigger()     { return this.propertiesValues()['@toggleleftdrawer']; }
    isRightDrawerOpenTrigger()      { return this.propertiesValues()['@openrightdrawer']; }
    isLeftDrawerOpenTrigger()       { return this.propertiesValues()['@openleftdrawer']; }
    isRightDrawerCloseTrigger()     { return this.propertiesValues()['@closerightdrawer']; }
    isLeftDrawerCloseTrigger()      { return this.propertiesValues()['@closeleftdrawer']; }
    isLeftDrawerCollapseTrigger()   { return this.propertiesValues()['@collapseleftdrawer']; }
    isRightDrawerCollapseTrigger()  { return this.propertiesValues()['@collapserightdrawer']; }
    isLeftDrawerExpandTrigger()     { return this.propertiesValues()['@expandleftdrawer']; }
    isRightDrawerExpandTrigger()    { return this.propertiesValues()['@expandrightdrawer']; }
    isOverlayOpenTrigger()          { return this.propertiesValues()['@openoverlay']; }
    isOverlayCloseTrigger()         { return this.propertiesValues()['@closeoverlay']; }


    async renderForMount() {
        if ( this.isDrawerToggleTrigger() ) {
            this.getAuroraBlueprint().registerDrawerToggleTrigger( this );
        }
        if ( this.isDrawerOpenTrigger() ) {
            this.getAuroraBlueprint().registerDrawerOpenTrigger( this );
        }
        if ( this.isDrawerCloseTrigger() ) {
            this.getAuroraBlueprint().registerDrawerCloseTrigger( this );
        }
        if ( this.isDrawerExpandTrigger() ) {
            this.getAuroraBlueprint().registerDrawerExpandTrigger( this );
        }
        if ( this.isDrawerCollapseTrigger() ) {
            this.getAuroraBlueprint().registerDrawerCollapseTrigger( this );
        }
        if ( this.isOverlayOpenTrigger() ) {
            this.getAuroraBlueprint().registerOverlayOpenTrigger( this );
        }
        if ( this.isOverlayCloseTrigger() ) {
            this.getAuroraBlueprint().registerOverlayCloseTrigger( this );
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
            mode: {
                default:        'filled',
                type:           'string',
                description:    'flat button style',
                group:          'Style',
                example:        'elevated | filled | filledtonal | outlined | text '

            },
            flat: {
                default:        false,
                type:           'boolean',
                description:    'flat button style',
                group:          'Style',
                example:        'true'
            },
            color: {
                default:        'primary',
                type:           'text',
                description:    'name of the color to be used',
                group:          'Style',
                example:        'primary | secondary | negative'
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
            value: {
                default:        '',
                type:           'string',
                description:    '',
                group:          'Behavior',
                example:        'default'
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
            },
            '@closeoverlay': {
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
            value   : 'hasvalue',
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

        classes.push('mode-'  + propertiesValues['mode']);
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

    focus()  { this.addInitFn( ()=> this.behavior.focus() ) }
    select() { this.addInitFn( ()=> this.behavior.select() ) }

}

AuroraButton.defineElement();
