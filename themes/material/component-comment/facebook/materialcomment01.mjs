
/*
 * Copyright (c) 2021.
 */

/**
 *
 *
 * @author: Bernhard Lukassen
 */

import ThemeBehavior            from "../../../themebehavior.mjs";
// import { validationLevel }      from "../../../../lib/common.mjs";

export default class MaterialComment01 extends ThemeBehavior {

    elementVisibility() {
 //       this.visElemPermAdministrationActions();
 //       this.visElemPermCommentActions();
        this.visElemPermActionReaction();
        this.visElemPermActionAddComment();
        this.visElemPermActionAttach();

        this.visElemContFeedbackSummary();
        this.visElemContReactions();
        this.visElemContComments();

        /*
        this.visElemPermActionEdit();
        this.visElemPermActionDelete();
        */

    }

    registerPermission() {
        return {
            edit: {
                element   : 'Change the content of an existing comment',
                evaluation: 'CommentOwner | Administrator',
                display   : 'block',
            }
        }
    }

    async attach(jar) {
        // --- attach to UI Actions
        // --- attach DOM Elements Visibility

        this.daf = registerPermission();
        this.identity = await universe.Identity.saveIdentity();
        this.jar = jar;
        this.container = this.jar.container;

        this.dynContActions();

        let actionReplyToComment = this.container.getElementsByClassName("aurora-comment-action-comment")[0];
        let action_like          = this.container.getElementsByClassName("aurora-comment-action-like")[0];
        let action_toggle_comments = this.container.getElementsByClassName("aurora-comment-action-toggle-comments")[0];

        let action_toggle_menu     = this.container.getElementsByClassName( "aurora-comment-administration-actions-trigger")[0];
        //---  Actions clicked  ------------------------------------------------------------------------this.container.querySelectorAll('.aurora-chat-entrybox-action').forEach(item => {
        action_like.addEventListener('click', this.callbackClickedLike, false);
        actionReplyToComment.addEventListener('click', (event)     => this.callbackClickedAddComment(event, this.container ), false);
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

    async callbackClickedAddComment (event, comment ) {

        //--- load the reply comment field in case it is not rendered
        if( ! this.isSlotRendered ( 'response' ) ) {
            await this.dynContResponse();
        }

        let response = comment.getElementsByClassName("aurora-comment-response-wrapper")[0];
        response.classList.toggle('open');
        event.stopPropagation();
        this.resize();
    }

    callbackClickedLike ( event ) {
        this.classList.remove('icon_animation');
        this.classList.add('icon_animation');
        // event.stopPropagation();
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
        let visible  = this.isAdministrator();
/*

        if ( visible &&
            ( this.visElemPermAdministrationActionEdit() ||
                this.visElemPermAdministrationActionDelete() ) ) {
            visible = true;
        } else {
            visible = false;
        }
*/

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
        let visible  = false;

        this.isAdministrator();

        this.switchElementVisibility( elements ,visible, 'block' );
        return visible;
    }

    visElemPermCommentActions() {
        let elements = this.container.querySelectorAll(".aurora-comment-actions");
        let visible  = ! this.needRegistration();

        this.switchElementVisibility( elements ,visible, 'block' );
    }

    visElemPermActionReaction() {
        let elements = this.container.querySelectorAll(".aurora-comment-action-like");
        let visible  = ! this.needRegistration();

        this.switchElementVisibility( elements ,visible, 'flex' );
    }
    visElemPermActionAddComment() {
        let elements = this.container.querySelectorAll(".aurora-comment-action-comment");
        let visible  = ! this.needRegistration();

        this.switchElementVisibility( elements ,visible, 'flex' );
    }

    visElemPermActionAttach() {
        let elements = this.container.querySelectorAll(".aurora-comment-response-action.type-attach");
        let visible  = false;

        this.switchElementVisibility( elements ,visible, 'inline-block' );
    }


    visElemContFeedbackSummary() {
        let elements = this.container.querySelectorAll(".aurora-comment-feedback-summary");
        let reactions = this.jar.hasReactions();
        let replies   = this.jar.hasReplies();
        let visible =  reactions || replies;

        this.switchElementVisibility( elements ,visible, 'block' );
    }

    visElemContReactions() {

        let reactions     = this.jar.hasReactions();
        let givenreaction = this.jar.viewModel.containsReaction(me, 'like');
        let elements      = this.container.querySelectorAll(".aurora-comment-feedback-likes");
        let visible       = reactions;

        this.switchElementVisibility( elements ,visible, 'block' );
        if ( visible ) {
            let txtElements = this.container.querySelectorAll(".aurora-comment-feedback-likes");
            let content     = this.jar.i18n('feedback_likes', this.jar.totalReactions());
            this.setElementContent ( txtElements, content );
        }

        if ( givenreaction ) {
            this.container.querySelectorAll(".aurora-comment-action-like")[0].classList.add('liked');
        } else {
            this.container.querySelectorAll(".aurora-comment-action-like")[0].classList.remove('liked');
        }

    }

    visElemContComments() {

        // let replies  = this.jar.viewModel.replies;
        let elements = this.container.querySelectorAll(".aurora-comment-feedback-comments");
        let visible  = this.jar.totalReplies() > 0; // replies.length > 0;

        this.switchElementVisibility( elements ,visible, 'block' );
        if ( visible ) {
            let txtElements = this.container.querySelectorAll(".aurora-comment-feedback-comments span");
            let content     = this.jar.i18n('feedback_comments', this.jar.totalReplies() );
            this.setElementContent ( txtElements, content );
        }
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

    async dynContResponse() {
        let slot     = 'response';
        let template = "commentsubreplay";
        let visible  = true;

        await this.dynamicContent(slot, template, visible);
    }

    async dynContActions() {
        let slot     = 'actions';
        let template = "commentsubactions";
        let visible  = true;

        await this.dynamicContent(slot, template, visible);
    }


    updateAge() {}

    updateLikes() {
        let elem = this.container.querySelector('.aurora-comment-feedback-likes');
        elem.innerText = this.jar.numberOfLikes();
    }

    needRegistration() {
        return this.identity &&
            ! localStorage.getItem('POCS21Guest');
    }

    isAdministrator() {
        return me && me.alias === 'Theresa / Pioneers of Change';
    }

}
