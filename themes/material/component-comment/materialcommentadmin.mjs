
/**
 *
 *
 * @author: Bernhard Lukassen
 */

import ThemeBehavior            from "../../themebehavior.mjs";
// import { validationLevel }      from "../../../lib/common.mjs";

export default class Materialcomment01 extends ThemeBehavior {

    elementVisibility() {
        this.visElemPermAdministrationActions();
        this.visElemPermCommentActions();
        this.visElemPermActionReaction();
        this.visElemPermActionAddComment();
        this.visElemPermActionAttach();

        this.visElemContFeedbackSummary();
        this.visElemContReactions();
        this.visElemContComments();
        /*

        this.visElemPermActionEdit();
        this.visElemPermActionDelete();

        this.visElemPermActionAttachFile();

*/
    }

    async attach(jar) {
        // --- attach to UI Actions
        // --- attach DOM Elements Visibility

        this.identity = await universe.Identity.saveIdentity();
        this.jar = jar;
        this.container = this.jar.container;

        let action_add_comment     = this.container.getElementsByClassName("aurora-comment-action-comment")[0];
        let action_like            = this.container.getElementsByClassName("aurora-comment-action-like")[0];
        let action_toggle_comments = this.container.getElementsByClassName("aurora-comment-action-toggle-comments")[0];

        let action_toggle_menu     = this.container.getElementsByClassName( "aurora-comment-administration-actions-trigger")[0];
        //---  Actions clicked  ------------------------------------------------------------------------this.container.querySelectorAll('.aurora-chat-entrybox-action').forEach(item => {
        action_like.addEventListener('click', this.callbackClickedLike, false);
        action_add_comment.addEventListener('click', (event)     => this.callbackClickedAddComment(event, this.container ), false);
        action_toggle_comments.addEventListener('click', (event) => this.callbackClickedToggleShowComments(event, action_toggle_comments), false);
        action_toggle_menu.addEventListener('click', (event) => this.callbackClickedToggleMenu(event, action_toggle_menu), false);

        //---  KEYUP event for the message field  ------------------------------------------------------------------------
 //       textarea[0].addEventListener('keyup', (event) => this.callbackKeyup(event), false);
    }

    resize ( ) {
        this.jar.emitResize();
    }

    callbackClickedToggleShowComments ( event, action_toggle_comments ) {
        let status = !action_toggle_comments.classList.contains('open');
        let replies = this.container.getElementsByClassName("aurora-comment-replies")[0];

        action_toggle_comments.classList.toggle('open');
        replies.classList.toggle('open');

        event.stopPropagation();
        //-- Todo: MN check status of the toggle.... to show the comments
        this.jar.setAttribute('replies_expanded', status);
        this.jar.showComments( status );
    }

    callbackClickedAddComment (event, comment ) {
        let response = comment.getElementsByClassName("aurora-comment-response-wrapper")[0];
        response.classList.toggle('open');
        event.stopPropagation();
        this.resize();
    }

    callbackClickedLike ( event ) {
        // alert("I like this comment...");
        event.stopPropagation();
    }

    callbackClickedToggleMenu ( event, trigger ) {
        let menu = this.container.getElementsByClassName("aurora-comment-administration-menu")[0];
        menu.classList.toggle("hidden");
    }
    /**
     * Visibility protocol
     */

    visElemPermAdministrationActions() {
        let elements = this.container.querySelectorAll(".aurora-comment-administration-actions");
        let visible  = true;

        if ( visible &&
            ( this.visElemPermAdministrationActionEdit() ||
                this.visElemPermAdministrationActionDelete() ) ) {
            visible = true;
        } else {
            visible = false;
        }

        this.switchElementVisibility( elements ,visible, 'flex' );
    }

    visElemPermAdministrationActionEdit() {
        let elements = this.container.querySelectorAll(".aurora-comment-action-edit");
        let visible  = false;

        this.switchElementVisibility( elements ,visible, 'block' );
        return visible;
    }
    visElemPermAdministrationActionDelete() {
        let elements = this.container.querySelectorAll(".aurora-comment-action-delete");
        let visible  = true;

        this.switchElementVisibility( elements ,visible, 'block' );
        return visible;
    }

    visElemPermCommentActions() {
        let elements = this.container.querySelectorAll(".aurora-comment-actions");
        let visible  = ! this.identity.isGhost();

        this.switchElementVisibility( elements ,visible, 'block' );
    }

    visElemPermActionReaction() {
        let elements = this.container.querySelectorAll(".aurora-comment-action-like");
        let visible  = ! this.identity.isGhost();

        this.switchElementVisibility( elements ,visible, 'flex' );
    }
    visElemPermActionAddComment() {
        let elements = this.container.querySelectorAll(".aurora-comment-action-comment");
        let visible  = ! this.identity.isGhost();

        this.switchElementVisibility( elements ,visible, 'flex' );
    }

    visElemPermActionAttach() {
        let elements = this.container.querySelectorAll(".aurora-comment-response-action.type-attach");
        let visible  = false;

        this.switchElementVisibility( elements ,visible, 'inline-block' );
    }


    visElemContFeedbackSummary() {
        let elements = this.container.querySelectorAll(".aurora-comment-feedback-summary");
        let reactions = this.jar.viewModel.reactions;
        let replies   = this.jar.viewModel.replies;
        let visible =  reactions.length + replies.length > 0;

        this.switchElementVisibility( elements ,visible, 'block' );
    }

    visElemContReactions() {

        let reactions     = this.jar.viewModel.reactions;
        let givenreaction = this.jar.viewModel.containsReaction(universe.identity, 'like');
        let elements      = this.container.querySelectorAll(".aurora-comment-feedback-likes");
        let visible       = reactions.length > 0;

        this.switchElementVisibility( elements ,visible, 'block' );
        if ( visible ) {
            let txtElements = this.container.querySelectorAll(".aurora-comment-feedback-likes");
            let content     = this.jar.i18n('feedback_likes', reactions.length);
            this.setElementContent ( txtElements, content );
        }

        if ( givenreaction ) {
            this.container.querySelectorAll(".aurora-comment-action-like")[0].classList.add('liked');
        } else {
            this.container.querySelectorAll(".aurora-comment-action-like")[0].classList.remove('liked');
        }

    }
    visElemContComments() {

        let replies  = this.jar.viewModel.replies;
        let elements = this.container.querySelectorAll(".aurora-comment-feedback-comments");
        let visible  = replies.length > 0;

        this.switchElementVisibility( elements ,visible, 'block' );
        if ( visible ) {
            let txtElements = this.container.querySelectorAll(".aurora-comment-feedback-comments span");
            let content     = this.jar.i18n('feedback_comments', this.jar.viewModel.totalReplies() );
            this.setElementContent ( txtElements, content );
        }
    }

    switchElementVisibility ( elements, visible, displayValue = 'block' ) {
        elements.forEach( (element) => element.style.display = (visible) ? displayValue: "none" );
    }

    setElementContent ( elements, content ) {
        elements.forEach( (element) => element.innerHTML = content );
    }

    showReply( element ) {
        let replies = this.container.querySelectorAll(".aurora-comment-replies")[0];
        replies.appendChild(element);
    }

    repliesVisible() {
        let action_toggle_comments = this.container.getElementsByClassName("aurora-comment-action-toggle-comments")[0];
        let replies = this.container.getElementsByClassName("aurora-comment-replies")[0];
        action_toggle_comments.classList.add('open');
        replies.classList.add('open');
    }

    /*
     * Event handlers
     */
    async identityChanged(identity) {
        this.identity = await universe.Identity.saveIdentity();
        this.visElemPermCommentActions();
 //       this.visElemPermActionReaction();
 //       this.visElemPermActionAddComment();
    }
    async reactionChanged() {
        let reactions = this.jar.viewModel.reactions;
        let size = reactions.length;
        this.visElemPermCommentActions();
        //       this.visElemPermActionReaction();
        //       this.visElemPermActionAddComment();
    }

    updateAge() {}

}
