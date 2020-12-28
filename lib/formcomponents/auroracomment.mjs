/**
 *
 *
 * @author: Martin Neitz
 */

import doT                      from "/dot";
import AuroraFormElement        from "./auroraformelement.mjs";

export default class AuroraComment extends AuroraFormElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-comment';
    }

    static get observedAttributes() {
        return ['messages'];
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
           theme:         'material',
           component:     'component-comment',
           configuration: 'config',
           i18n:          '',
           templates:     ['comment'],
       }
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,

        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            sent: {
                default:        false,
                type:           'boolean',
                description:    'Render as a sent message (so from current user)',
                group:          'Behavior',
                example:        ''
            },
            label: {
                default:        '',
                type:           'string',
                description:    'Label of message. e.g.: the Date',
                group:          'content',
                example:        'Thursday, 23th'
            },
            avatar: {
                default:        '',
                type:           'string',
                description:    'URL to the avatar image of the creator',
                group:          'Content',
                example:        ''
            },
            name: {
                default:        '',
                type:           'string',
                description:    'Name of the message creator',
                group:          'Content',
                example:        ''
            },
            stamp: {
                default:        '',
                type:           'string',
                description:    'Creation timestamp string',
                group:          'Content',
                example:        ''
            },
            messages: {
                default:        '',
                type:           'array',
                description:    'the message text as array of lines',
                group:          'Content',
                example:        'Hi Bernhard...'
            },
            level: {
                default:        '1',
                type:           'number',
                description:    'Depth of Comment',
                group:          'Behavior',
                example:        '3'
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

        if ( propertiesValues['sent'] ) {
            classes.push('sent');
        } else {
            classes.push('received');
        }

        return classes;
    }

    get appliedTemplateName() {
        return 'comment';
    }

    adjustContent(container) {
        let temp = this.propertiesValues()['messages'];
        console.log( temp );
        container.classList.add("aurora-chat-message-wrapper");
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

    attributeChangedCallback(name, oldValue, newValue) {
        this.refresh();
        // implement by subclass
    }

}

AuroraComment.defineElement();
