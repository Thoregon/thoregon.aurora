
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

import ThemeBehavior from "../../themebehavior.mjs";
import { doAsync, timeout }   from "/evolux.universe";
// import { validationLevel }      from "../../../lib/common.mjs";

export default class MaterialCommentMessageBox extends ThemeBehavior {

    elementVisibility() {

        // this.visElemContEntryBox();
        this.visElemPermActionAttach();
        this.visElemPermActionEmoji();
        this.visElemPermActionAudio();
        this.visElemPermActionVideo();
        this.visElemPermActionEditorText();
        this.visElemPermActionEditorHTML();

        this.visElemContGuestLogin();

        this.resize();
    }

    async attach(jar) {
        // --- attach to UI Actions
        // --- attach DOM Elements Visibility
        this.identity = await universe.Identity.saveIdentity();
        this.jar = jar;
        this.container = this.jar.container;

        let actionSubmit = this.container.querySelector ( ".aurora-comment-entrybox-action.type-submit");

        let textarea     = this.container.getElementsByClassName("aurora-comment-entrybox-textarea")[0];

        textarea.addEventListener('focus', (event)  => this.callbackFocusTextarea(event, textarea ), false);
        textarea.addEventListener('focus', (event)  => this.resize(), false);
        actionSubmit.addEventListener('click', (event) => this.callbackClicked(event), false);
        this.elementVisibility();
    }


    get textarea() {
        return this.container.getElementsByClassName("aurora-comment-entrybox-textarea")[0];
    }

    get value() {
        let textarea = this.textarea;
        return textarea ? textarea.value : undefined;
    }

    callbackClicked(event) {
        if ( this.needRegistration() ) {

            let author  = this.container.querySelectorAll(".aurora-comment-guest-author input")[0].value;
            let email   = this.container.querySelectorAll(".aurora-comment-guest-email input")[0].value;
            let website = this.container.querySelectorAll(".aurora-comment-guest-url input")[0].value;

            if ( website != '' ) {
                event.stopPropagation();
                return;
            }

            if ( author =='' || email == ''  ) {
                alert( 'bitte beide Pflichtfelder ausfüllen!' )
            } else {

                let guest = {
                    id: this.rnd(32),
                    nickname: author,
                    email: email };
                localStorage.setItem("POCS21Guest", JSON.stringify(guest));

            }
        }

//        let guest =JSON.parse(localStorage.getItem("POCS21Guest"));

        let enteredText = this.value;
        if (!enteredText) return ;
        this.jar.triggerClick(enteredText);
        event.stopPropagation();
    }

    callbackFocusTextarea ( event, messagebox  ) {
        messagebox.classList.add('focused');
        event.stopPropagation();
    }

    resize ( ) {
        this.jar.emitResize();
    }

    callbackClickedAddComment (event, comment ) {
        let response = comment.getElementsByClassName("aurora-comment-response-wrapper")[0];
        response.classList.toggle('open');
        event.stopPropagation();
    }

    callbackClickedLike ( event ) {
        alert("I like this comment...");
        this.jar.triggerClick();
        event.stopPropagation();
    }


    needRegistration() {
        return this.identity &&
               ! localStorage.getItem('POCS21Guest');
    }

    /**
     * Visibility protocol
     */

    visElemContGuestLogin()  {
        let elements = this.container.querySelectorAll(".aurora-guest-registration");
        let visible  = this.needRegistration();

        this.switchElementVisibility( elements ,visible, 'block' );
    }

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

    /*
     * Event handlers
     */
    async ownerChanged(identity) {
        this.identity = await universe.Identity.saveIdentity();
        this.visElemContEntryBox();
    }

    rnd (l, c) {
        var s = '';
        l = l || 24; // you are not going to make a 0 length random number, so no need to check type
        c = c || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXZabcdefghijklmnopqrstuvwxyz';
        while(l > 0){ s += c.charAt(Math.floor(Math.random() * c.length)); l-- }
        return s;
    }
}
