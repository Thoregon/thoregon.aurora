
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
        this.visElemPermActionAttach();
        this.visElemPermActionEmoji();
        this.visElemPermActionAudio();
        this.visElemPermActionVideo();
        this.visElemPermActionEditorText();
        this.visElemPermActionEditorHTML();
    }

    async attach(jar) {
        // --- attach to UI Actions
        // --- attach DOM Elements Visibility
        this.identity = await universe.Identity.saveIdentity();
        this.jar = jar;
        this.container = this.jar.container;

        let textarea     = this.container.getElementsByClassName("aurora-comment-entrybox-textarea")[0];
        textarea.addEventListener('focus', (event)     => this.callbackFocusTextarea(event, textarea ), false);

        this.elementVisibility();
    }

    callbackFocusTextarea ( event, messagebox  ) {
        messagebox.classList.add('focused');
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

    visElemPermActionAttach() {
        let elements = this.container.querySelectorAll(".aurora-comment-entrybox-action.type-attach");
        let visible  = false;

        this.switchElementVisibility( elements ,visible, 'block' );
    }
    visElemPermActionEmoji() {
        let elements = this.container.querySelectorAll(".aurora-comment-entrybox-action.type-emoji");
        let visible  = false;

        this.switchElementVisibility( elements ,visible, 'block' );
    }

    visElemPermActionAudio() {
        let elements = this.container.querySelectorAll(".aurora-comment-entrybox-action.type-audio");
        let visible  = false;

        this.switchElementVisibility( elements ,visible, 'block' );
    }
    visElemPermActionVideo() {
        let elements = this.container.querySelectorAll(".aurora-comment-entrybox-action.type-video");
        let visible  = false;

        this.switchElementVisibility( elements ,visible, 'block' );
    }
    visElemPermActionEditorText() {
        let elements = this.container.querySelectorAll(".aurora-comment-entrybox-action.type-editor-text");
        let visible  = false;

        this.switchElementVisibility( elements ,visible, 'block' );
    }
    visElemPermActionEditorHTML() {
        let elements = this.container.querySelectorAll(".aurora-comment-entrybox-action.type-editor-html");
        let visible  = false;

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
