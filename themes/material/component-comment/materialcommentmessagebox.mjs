
/*
 * Copyright (c) 2021. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

/**
 *
 *
 * @author: Bernhard Lukassen
 */

import ThemeBehavior            from "../../themebehavior.mjs";
// import { validationLevel }      from "../../../lib/common.mjs";

export default class MaterialCommentMessageBox extends ThemeBehavior {

    elementVisibility() {
        this.visElemContEntryBox();
    }

    async attach(jar) {
        // --- attach to UI Actions
        // --- attach DOM Elements Visibility

        this.identity = await universe.Identity.saveIdentity();
        this.jar = jar;
        this.container = this.jar.container;

    }

    callbackClickedToggleShowComments ( event, action_toggle_comments ) {
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

    /**
     * Visibility protocol
     */

    visElemContEntryBox() {
        let elements = this.container.querySelectorAll(".aurora-comment-entrybox");
        let visible  = ! this.identity.isGhost();

        this.switchElementVisibility( elements ,visible, 'block' );
    }

    switchElementVisibility ( elements, visible, displayValue = 'block' ) {
        elements.forEach( (element) => element.style.display = (visible) ? displayValue: "none" );
    }

    setElementContent ( elements, content ) {
        elements.forEach( (element) => element.innerHTML = content );
    }


    /*
     * Event handlers
     */
    async ownerChanged(identity) {
        this.identity = await universe.Identity.saveIdentity();
        this.visElemContEntryBox();
    }
}
