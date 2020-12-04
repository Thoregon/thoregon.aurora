/**
 *
 *
 * @author: Martin Neitz
 */

import doT                      from "/dot";
import AuroraFormElement        from "./auroraformelement.mjs";

export default class AuroraChatMessage extends AuroraFormElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-chat-message';
    }

    /*
     * aurora element features
     */

    get isTrigger() {
        return true;
    }


    // theme ... component... templates

    get templateElements() {
       return {
           theme: 'material',
           component: 'formcomponents',
           templates: ['chatmessage'],
       }
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,

        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            message: {
                default:        '',
                type:           'string array',
                description:    'the message text as array of lines',
                group:          'Content',
                example:        'Hi Bernhard...'
            },
        });
    }

    propertiesAsBooleanRequested() {
        return {
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
        let classes = [];
        let propertiesValues = this.propertiesValues();

        if ( propertiesValues['usesleadingicon'] )  { classes.push('with-leading-icon'); }
        if ( propertiesValues['disabled'] ) { classes.push('disabled'); }
        if ( propertiesValues['fullwidth'] ) { classes.push('fullwidth'); }

        return classes;
    }

    applyContent(container) {
        console.log(this.propertiesValues());
        let properties = this.propertiesValues();
        properties['classes'] = this.collectClasses().join(' ');
        let tplsrc = this.templates;
        let tempFn = doT.template( tplsrc['chatmessage'] );
        let element = tempFn( properties );

        container.innerHTML = element;
        container.classList.add("aurora-chat-message-wrapper");
        container.style.width = this.getStyleWidth();

        this.attachBehavior();
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
