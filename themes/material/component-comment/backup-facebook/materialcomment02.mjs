
/*
 * Copyright (c) 2021.
 */

/**
 *
 *
 * @author: Bernhard Lukassen
 */

import MaterialComment01        from "./materialcomment01.mjs"
// import { validationLevel }      from "../../../../lib/common.mjs";

export default class MaterialComment02 extends MaterialComment01 {

    elementVisibility() {
        this.visElemPermActionReaction();
        this.visElemPermCommentActions();
        this.visElemContReactions();
        this.visElemContAgeFormated();
        this.visElemPermActionAttach();

        this.visElemPermAdministrationActions();
    }

    ageFormated() {
        return this.jar.ageFormated();
    }

    async attach(jar) {
        this.identity = await universe.Identity.saveIdentity();
        this.jar = jar;
        this.container = this.jar.container;

        let action_add_comment     = this.container.getElementsByClassName("aurora-comment-action-reply")[0];
        action_add_comment.addEventListener('click', (event)     => this.callbackClickedAddComment(event, this.container ), false);

    }

    callbackClickedAddComment (event, comment ) {
        let response = comment.getElementsByClassName("aurora-comment-response-wrapper")[0];
        response.classList.toggle('open');
        event.stopPropagation();
    }


    repliesVisible() {
        // let action_toggle_comments = this.container.getElementsByClassName("aurora-comment-action-toggle-comments")[0];
        let replies = this.container.getElementsByClassName("aurora-comment-replies")[0];
        // action_toggle_comments.classList.add('open');
        replies.classList.add('open');
    }

    /*
     * Event handlers
     */
    async identityChanged(identity) {
        this.identity = await universe.Identity.saveIdentity();
        this.visElemPermCommentActions();
        this.visElemPermActionReaction();
    }

    showReply( element ) {
        let replies = this.container.querySelectorAll(".aurora-comment-replies")[0];
        replies.appendChild(element);
    }

    updateAge() {
        this.visElemContAgeFormated()
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

    visElemPermActionReaction() {
        let elements = this.container.querySelectorAll(".aurora-comment-action-like");
        let visible  = ! this.needRegistration();

        if  ( visible ) {
            elements.forEach( (element) =>  element.classList.add("active") );
        } else {
            elements.forEach( (element) =>  element.classList.remove("active") );
        }
    }
    visElemPermCommentActions() {
        let elements   = this.container.querySelectorAll(".aurora-comment-action-reply");
        let seperators = this.container.querySelectorAll(".aurora-comment-action-separator");
        let visible  = ! this.needRegistration();

        this.switchElementVisibility( elements ,visible, 'inline-block' );
        this.switchElementVisibility( seperators ,visible, 'inline-block' );
    }

    visElemPermActionAttach() {
        let elements = this.container.querySelectorAll(".aurora-comment-response-action.type-attach");
        let visible  = false;

        this.switchElementVisibility( elements ,visible, 'inline-block' );
    }


    visElemContReactions() {
        let reactions = this.jar.viewModel.reactions;
        let elements = this.container.querySelectorAll(".aurora-comment-feedback-likes");
        let visible  = reactions.length > 0;

        this.switchElementVisibility( elements ,visible, 'block' );
        if ( visible ) {
            let txtElements = this.container.querySelectorAll(".aurora-comment-counter-likes");
            let content     = this.jar.i18n('feedback_number_likes', reactions.length);
            this.setElementContent ( txtElements, content );
        }
    }

    visElemContAgeFormated() {
        let elements = this.container.querySelectorAll(".aurora-comment-age-formated");
        let content = this.ageFormated();

        this.setElementContent ( elements, content );

    }

}
