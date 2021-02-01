
/**
 *
 *
 * @author: Bernhard Lukassen
 */

import ThemeBehavior            from "../../themebehavior.mjs";
// import { validationLevel }      from "../../../lib/common.mjs";

export default class Materialcomment01 extends ThemeBehavior {

    elementVisibility() {
        this.visElemPermCommentActions();
        this.visElemPermActionReaction();
        this.visElemPermActionAddComment();

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
        let action_like            = this.container.getElementsByClassName("aurora-comment-action-like");
        let action_toggle_comments = this.container.getElementsByClassName("aurora-comment-action-toggle-comments")[0];

        //---  Actions clicked  ------------------------------------------------------------------------this.container.querySelectorAll('.aurora-chat-entrybox-action').forEach(item => {
        action_like[0].addEventListener('click', this.callbackClickedLike, false);
        action_add_comment.addEventListener('click', (event)     => this.callbackClickedAddComment(event, this.container ), false);
        action_toggle_comments.addEventListener('click', (event) => this.callbackClickedToggleShowComments(event, action_toggle_comments), false);

        //---  KEYUP event for the message field  ------------------------------------------------------------------------
 //       textarea[0].addEventListener('keyup', (event) => this.callbackKeyup(event), false);
    }

    callbackClickedToggleShowComments ( event, action_toggle_comments ) {
        let status = true;
        action_toggle_comments.classList.toggle('open');
        event.stopPropagation();
        //-- Todo: MN check status of the toggle.... to show the comments
        this.jar.showComments( status );
    }

    callbackClickedAddComment (event, comment ) {
        let response = comment.getElementsByClassName("aurora-comment-response-wrapper")[0];
        response.classList.toggle('open');
        event.stopPropagation();
    }

    callbackClickedLike ( event ) {
        // alert("I like this comment...");
        event.stopPropagation();
    }

    /**
     * Visibility protocol
     */

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

    visElemContFeedbackSummary() {
        let elements = this.container.querySelectorAll(".aurora-comment-feedback-summary");
        let reactions = this.jar.viewModel.reactions;
        let replies   = this.jar.viewModel.replies;
        let visible =  reactions.length + replies.length > 0;

        this.switchElementVisibility( elements ,visible, 'block' );
    }

    visElemContReactions() {
        let reactions = this.jar.viewModel.reactions;
        let elements = this.container.querySelectorAll(".aurora-comment-feedback-likes");
        let visible  = reactions.length > 0;

        this.switchElementVisibility( elements ,visible, 'block' );
        if ( visible ) {
            let txtElements = this.container.querySelectorAll(".aurora-comment-feedback-likes");
            let content     = this.jar.i18n('feedback_likes', reactions.length);
            this.setElementContent ( txtElements, content );
        }
    }
    visElemContComments() {

        let replies  = this.jar.viewModel.replies;
        let elements = this.container.querySelectorAll(".aurora-comment-feedback-likes");
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

    /*
     * Event handlers
     */
    async ownerChanged(identity) {
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

}
