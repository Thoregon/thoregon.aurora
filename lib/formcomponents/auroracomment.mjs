/**
 *
 *
 * @author: Martin Neitz
 */

import doT                      from "/dot";
import AuroraFormElement        from "./auroraformelement.mjs";
import simpleDateFormat         from "../formating/simpledateformat.mjs";

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
               'comment03'
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
                type:           'JSON DateTime',
                description:    'Creation timestamp string as JSON String',
                group:          'Content',
                example:        '2014-01-01T23:28:56.782Z'
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
            replies_expanded: {
                default:        false,
                type:           'boolean',
                description:    'expand the replies to the comment',
                group:          'Behavior',
                example:        ''
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

        let numberOfLikes = this.numberOfLikes();

        let dateTimeFormat = this.elemconfig.datetime['format'].slice(1, -1);
        let formater       = new simpleDateFormat(dateTimeFormat, "de_DE");
        let dateTime       = this.getAttribute('stamp');

        let date = new Date(dateTime);
        let formatedDateTime = formater.format(date);

        let messages = this.propertiesValues()['messages'];
        let test = [];

        for ( var i in messages ) {
            test[i] =  this.transmuteMessage( messages[i] );
        }

        let current_user = {
            "alias": 'martin',
            "avatar": 'https://getready.kongress-suite.com/wp-content/uploads/2017/11/martin_300x300.jpg',
        };


        return {
            'transmute_messages'       : test,
            'stamp'                    : formatedDateTime,
            'current_user'             : current_user,
            'feedback_likes'           : this.i18n('feedback_likes', numberOfLikes),
            'feedback_comments'        : this.i18n('feedback_comments', 0),
            'txt_action_like'          : this.i18n('txt_action_like'),
            'txt_action_comment'       : this.i18n('txt_action_comment'),
            'txt_action_submit_comment': this.i18n('txt_action_submit_comment'),
            'txt_feedback_number_likes': this.i18n('feedback_number_likes', numberOfLikes),
            'txt_comment_age_formated' : this.i18n('',0),
        };
    }

    transmuteMessage(message) {
        let formulas = [
            {
                regex  : /=== (.+?) ===/m,
                replace: "<h3>$1</h3>"
            },
            {
                regex  : /== (.+?) ==/m,
                replace: "<h2>" + "$1" + "</h2>"
            },
            {
                regex  : /= (.+?) =/m,
                replace: "<h1>" + "$1" + "</h1>"
            },
            {
                regex  : /\*\*(.+?)\*\*/m,
                replace: "<b>" + "$1" + "</b>"
            },
            {
                regex  : /\'\'(.+?)\'\'/m,
                replace: "<i>" + "$1" + "</i>"
            },
            {
                regex  : /__(.+?)__/m,
                replace: "<u>" + "$1" + "</u>"
            },
            {
                regex  : /^----+(\s*)$/m,
                replace: "<hr>"
            }, // Indentations
            {
                regex  : /[\n\r]: *.+([\n\r]:+.+)*/m,
                replace: "<dl>" + "$1" + "</dl>"
            },
            {
                regex  : /^:(?!:) *(.+)$/m,
                replace: "<dd>" + "$1" + "</dd>"
            },
            {
                regex  : /([\n\r]:: *.+)+/,
                replace: "<dd><dl>" + "$1" + "</dl></dd>"
            },
            {
                regex  : /^:: *(.+)$/m,
                replace: "<dd>" + "$1" + "</dd>"
            }, // Ordered list
            {
                regex  : /[\n\r]?#.+([\n|\r]#.+)+/,
                replace: "<ol>$0</ol>"
            },
            {
                regex  : /[\n\r]#(?!#) *(.+)(([\n\r]#{2,}.+)+)/,
                replace: "<li>$1<ol>$2</ol></li>"
            },
            {
                regex  : /[\n\r]#{2}(?!#) *(.+)(([\n\r]#{3,}.+)+)/,
                replace: "<li>$1<ol>$2</ol></li>"
            },
            {
                regex  : /[\n\r]#{3}(?!#) *(.+)(([\n\r]#{4,}.+)+)/,
                replace: "<li>$1<ol>$2</ol></li>"
            },

        ];
        formulas.forEach(function (formula, i) {
            if (message.match(formula.regex)) {
                message = message.replace(formula.regex, formula.replace);
            }
        });
        return message;
    }

    transformPropertyAsBooleanValue( property, value ) {
        let booleanvalue = super.transformPropertyAsBooleanValue( property, value  );

        switch (property) {
            case 'likes_count':
                if (    value != '' &&
                        value > 0 ) { return true;}
                return false;
            case 'replies_expanded':
                return !( value === '' || value === 'false' || value === '0' );
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
        let level = this.getAttribute( 'level' );

        if (  parseInt( level ) > 9 ) {
            level = "plus";
        }
        return this.elemconfig.level['lvl_' + level ];
    }

    adjustContent(container) {
        let temp = this.propertiesValues()['messages'];
        // console.log( temp );
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
    }

    attachViewModel(vm) {
        super.attachViewModel(vm);
        this.refreshVisibility();
    }

    // todo [REFACTOR]: review replies loaded
    refreshVisibility() {
        this.behavior.elementVisibility();
        if ( this.transformPropertyAsBooleanValue('replies_expanded', this.getAttribute('replies_expanded')) ) {
            this.viewModel.repliesLoaded = false;
            this.showComments(true);
        }
    }

    async refresh() {
        // console.log('AuroraComment.refresh()', 'Level: ' + this.getAttribute('level'), this.getAttribute('messages'));
        await super.refresh();
        if (this.viewModel) this.refreshVisibility();
    }

    /*
     * update UI
     */

    numberOfLikes() {
        return this.getAttribute( 'likes_count' ) || 0;
    }

    ageFormated() {
        let format = this.viewModel.ageFormated();
        return this.i18n(format.display, format.age);
    }

    showComments( displayStatus ) {
        if (this.viewModel) {
            this.viewModel.showComments( displayStatus, parseInt(this.getAttribute( 'level' ) ) );
            if (displayStatus) this.behavior.repliesVisible();
        }
    }

    showReply( element ) {
        this.behavior.showReply( element );
    }

    /*
     * actions
     */

    commitReply(reply) {
        this.viewModel.commitReply(reply);
    }

    commitReaction() {
        this.viewModel.commitReaction();
    }

    // todo [OPEN]: dropReply, dropReaction

    /*
     * Event handlers
     */
    identityChanged(identity) {
        this.behavior.identityChanged(identity);
    }
    reactionChanged() {
        this.behavior.reactionChanged();
    }

    updateAge() {
        this.behavior.updateAge();
    }


}

AuroraComment.defineElement();
