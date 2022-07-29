/**
 *
 *
 * @author: Bernhard Lukassen
 */

import AuroraFormElement        from "./auroraformelement.mjs";

export default class AuroraCard extends AuroraFormElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-card';
    }

    /*
     * aurora element features
     */

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
           component: 'component-card',
           templates: ['card'],
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
                default:        'outlined',
                type:           'string',
                description:    'defines the rich media url',
                group:          'Behavior',
                example:        'outlined | filled'
            },
            media: {
                default:        '',
                type:           'string',
                description:    'defines the rich media url',
                group:          'Content',
                example:        'https://myimage.jpg'
            },
            mediasize: {
                default    : 'cover',
                type       : 'string',
                description: 'how should the image be positioned',
                group      : 'Behavior',
                example    : 'cover | contained'
            },
            title: {
                default:        '',
                type:           'string',
                description:    'The primary title shown in the card',
                group:          'Content',
                example:        'Banana'
            },
            subtitle: {
                default:        '',
                type:           'string',
                description:    'The secondary text shown below the title',
                group:          'Content',
                example:        'Me want banana!'
            },
            supportingtext: {
                default:        '',
                type:           'string',
                description:    'Supporting text for the card',
                group:          'Content',
                example:        'please buy more banana.'
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
        //--- 1: first get the classes added from the dom element
        //--- 2: analyse the transferred attributes
        let classes = [];
        let propertiesValues = this.propertiesValues();

        if ( propertiesValues['mode'] )      { classes.push('mode-' + propertiesValues['mode'] ); }
        if ( propertiesValues['mediasize'] ) { classes.push('mediasize-' + propertiesValues['mediasize'] ); }


        if ( propertiesValues['disabled'] ) { classes.push('disabled'); }
        return classes;
    }

    async adjustContent(container) {
        container.classList.add("aurora-card-wrapper");
    }

    get appliedTemplateName() {
        return 'card';
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

AuroraCard.defineElement();
