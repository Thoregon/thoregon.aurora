
/**
 *
 *
 * @author: Bernhard Lukassen
 */

import ThemeBehavior            from "../../themebehavior.mjs";
// import { validationLevel }      from "../../../lib/common.mjs";

export default class Materialcomment01 extends ThemeBehavior {

    actions() {
  //      this.jar.viewModel.viewmodeltest();
        let actions = {
            'edit'       : '.aurora-comment-action-like',
            'delete'     : 'selectore',
            'attach_file': 'selectore',
            'add_comment': '.aurora-comment-action-comment',
            'react'      : 'aurora-comment-action-like'
        };

        // add comment
        // react
        // edit
        // delete
        // attach file

    }
    elementVisibility() {
        this.elementActionLike();
        /*
        this.elementActionAddComment();
        this.elementActionEdit();
        this.elementActionDelete();
        this.actionAttachFile();
*/

    }

    attach(jar) {
        // --- attach to UI Actions
        // --- attach DOM Elements Visibility

        this.jar = jar;
        this.container = this.jar.container;

        let action_add_comment     = this.container.getElementsByClassName("aurora-comment-action-comment")[0];
        let action_like            = this.container.getElementsByClassName("aurora-comment-action-like");
        let action_toggle_comments = this.container.getElementsByClassName("aurora-comment-action-toggle-comments")[0];

        //---  Actions clicked  ------------------------------------------------------------------------this.container.querySelectorAll('.aurora-chat-entrybox-action').forEach(item => {
        action_like[0].addEventListener('click', this.callbackClickedLike, false);
        action_add_comment.addEventListener('click', (event)     => this.callbackClickedAddComment(event, this.container ), false);
        action_toggle_comments.addEventListener('click', (event) => this.callbackClickeToggleShowComments(event, action_toggle_comments), false);

        //---  KEYUP event for the message field  ------------------------------------------------------------------------
 //       textarea[0].addEventListener('keyup', (event) => this.callbackKeyup(event), false);

        this.elementVisibility();
    }

    callbackClickeToggleShowComments ( event, action_toggle_comments ) {
        action_toggle_comments.classList.toggle('open');
        event.stopPropagation();
    }

    callbackClickedAddComment (event, comment ) {
        let response = comment.getElementsByClassName("aurora-comment-response-wrapper")[0];
        response.classList.toggle('open');
        event.stopPropagation();
    }

    callbackClickedLike ( event ) {
        alert("I like this comment...");
        event.stopPropagation();
    }

    elementActionLike() {
        let elements = this.container.querySelectorAll(".aurora-comment-action-like");
        let visible  = true;

        //--- SSI check if available and which kind of
        //--- Changes in authorization

        //--- Content changes
        //--- - Likes added from DB
        //--- - Comments added from DB  ( as an reply to an existing Comment )

        for ( let i in elements ) {
            this.switchElementVisibility( elements[i] ,visible );
        }
    }

    switchElementVisibility ( element, visible ) {
        if ( visible ) {
            element.style.display = "initial";
        } else {
            element.style.display = "none";
        }
    }


}
