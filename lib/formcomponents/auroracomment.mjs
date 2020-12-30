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
           i18n:          true,
           templates:     [
               'comment01',
               'comment02',
               'comment03',
               'comment04',
               'comment05',
               'comment06',
               'comment07',
               'comment08',
               'comment09',
               'materialcommententrybox01',
           ],
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
            likes_count: {
                default:        '0',
                type:           'number',
                description:    'number of likes the comment received',
                group:          'Content',
                example:        '42'
            },
            likes_count_txt: {
                default:        'gefällt mir',
                type:           'text',
                description:    'text to be displayed for the number of likes received',
                group:          'Content',
                example:        '42 gefällt mir'
            },
        });
    }

    propertiesAsBooleanRequested() {
        return {
            likes_count: 'haslikes',
            messages:    'hascomments',
        };
    }

    async calculatedValues() {
  //      let propertiesValues = this.propertiesValues();

        // todo: MN calculate visability...
        // todo: MN actions available if only viewer... so without temp browser ssi
        let dcfsummary  = '';
        let dcflikes    = '';
        let dcfcomments = '';

        let givenalike  =  'like-given';

        return {
            'current_user:'     : await universe.Identity.find('bobB'),
            'feedback_likes'    : this.i18n('feedback_likes', 42),
            'feedback_comments' : this.i18n('feedback_comments', 2),
            'txt_action_like'   : this.i18n('txt_action_like'),
            'txt_action_comment': this.i18n('txt_action_comment'),

            'feedback_summary_display_class' : dcfsummary,
            'feedback_likes_display_class'   : dcflikes,
            'feedback_comments_display_class': dcfcomments,

            'actions_available': true,
            'given_a_like'     : givenalike,
        };
    }


    transformPropertyAsBooleanValue( property, value ) {
        let booleanvalue = super.transformPropertyAsBooleanValue( property, value  );

        switch (property) {
            case 'likes_count':
                if (    value != '' &&
                        value > 0 ) { return true;}
                return false;
                break;
            default:
                return booleanvalue;
                break;
        }
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
        // todo: select the correct template....  zoe
        let propertiesValues = this.propertiesValues();
        let level = 'lvl_' + propertiesValues.level;
        console.log( this.config );

        return 'comment01';
    }

    adjustContent(container) {
        let temp = this.propertiesValues()['messages'];
        console.log( temp );
        container.classList.add("aurora-comment-wrapper");
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
