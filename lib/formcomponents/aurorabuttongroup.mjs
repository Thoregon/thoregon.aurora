/**
 *
 *
 * @author: Bernhard Lukassen
 */

import AuroraFormElement        from "./auroraformelement.mjs";

export default class AuroraButtonGroup extends AuroraFormElement {


    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-buttongroup';
    }

    /*
     * aurora element features
     */

    get isTrigger() {
        return true;
    }

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

    isRightDrawerToggle() { return this.propertiesValues()['@togglerightdrawer']; }
    isLeftDrawerToggle()  { return this.propertiesValues()['@toggleleftdrawer']; }
    isRightDrawerOpener() { return this.propertiesValues()['@openrightdrawer']; }
    isLeftDrawerOpener()  { return this.propertiesValues()['@openleftdrawer']; }

    async renderForMount() {
        if ( this.isDrawerToggleTrigger() ) {
            this.getAuroraBlueprint().registerDrawerToggle( this );
        }
        if ( this.isDrawerOpenerTrigger() ) {
            this.getAuroraBlueprint().registerDrawerOpener( this );
        }

    }

    // theme ... component... templates

    get componentConfiguration() {
       return {
           theme: 'material',
           component: 'form-buttongroup',
           templates: ['buttongroup'],
       }
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            align          : {
                default    : 'center',
                type       : 'string',
                description: 'Horizontal alignment the buttons within the tabs container',
                group      : 'Behavior',
                example    : 'left | center | right | justify'
            },
            orientation    : {
                default    : 'horizontal',
                type       : 'string',
                description: 'orientation of the buttons',
                group      : 'Behavior',
                example    : 'horizontal | vertical'
            },
            ':options' : {
                default    : '',
                type       : 'string',
                description: 'define the function of the ViewModel which is responsible to return the used options',
                group      : 'Content',
                example    : 'myOptions'
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

        if ( propertiesValues['orientation'] )  { classes.push('orientation-' + propertiesValues['orientation']); }
        if ( propertiesValues['align'] )        { classes.push('align-' + propertiesValues['align']); }

        if ( propertiesValues['disabled'] )  { classes.push('disabled'); }
        if ( propertiesValues['fullwidth'] ) { classes.push('fullwidth'); }
        if ( propertiesValues['flat'] )      { classes.push('flat'); }
        if ( propertiesValues['dense'] )     { classes.push('dense'); }
        classes.push('color-' + propertiesValues['color']);

        classes.push( propertiesValues['borderstyle'] );
        return classes;
    }

    async adjustContent(container) {
        container.classList.add("aurora-buttongroup-wrapper");
    }

    get appliedTemplateName() {
        return 'buttongroup';
    }

    options(options) {
        let propertiesValues = this.propertiesValues();
        let group            = this.container.querySelector('.aurora-buttongroup');

        for ( const [key, value] of Object.entries( options ) ) {
            let div   = document.createElement('div');
            let label = document.createElement('label');
            let input = document.createElement('input');

            div.setAttribute("id", "button_" + key );
            div.setAttribute( "class", "aurora-buttongroup-button" );

            label.setAttribute("for", key );
            let labelInnerHTML = '<i aria-hidden="true" class="material-icons">check</i>' + value;
            label.innerHTML = labelInnerHTML;

            input.setAttribute("type", "radio" );
            input.setAttribute("id", key );
            input.setAttribute("name", propertiesValues?.['name'] );
            input.setAttribute("value", value );

            div.append ( input );
            div.append ( label );
            group.append ( div );
        }
    }

    async existsConnect() {
        await super.existsConnect();

/*
        let propertiesValues = this.propertiesValues();
        let functionOptions  = propertiesValues[':options'];
        let vm               = this.viewModel || this.parentViewModel();

        if ( functionOptions != "" &&
            !vm[functionOptions]) {
            return;
        } else {
            let group   = this.container.querySelector('.aurora-buttongroup');
            let options = await vm[functionOptions]();

            for ( const [key, value] of Object.entries( options ) ) {
                let div   = document.createElement('div');
                let label = document.createElement('label');
                let input = document.createElement('input');

                div.setAttribute("id", "button_" + key );
                div.setAttribute( "class", "aurora-buttongroup-button" );

                label.setAttribute("for", key );
                let labelInnerHTML = '<i aria-hidden="true" class="material-icons">check</i>' + value;
                label.innerHTML = labelInnerHTML;

                input.setAttribute("type", "radio" );
                input.setAttribute("id", key );
                input.setAttribute("name", propertiesValues?.['name'] );
                input.setAttribute("value", value );

                div.append ( input );
                div.append ( label );
                group.append ( div );
            }
        }
*/

        this.behavior.attach(this);
    }

    get value() {
        // debugger;
    }

    set value(value) {
        // debugger;
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

AuroraButtonGroup.defineElement();
