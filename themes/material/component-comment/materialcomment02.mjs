
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

export default class Materialcomment02 extends ThemeBehavior {

    elementVisibility() {
        this.visElemPermActionReaction();
        this.visElemPermCommentActions();
        this.visElemContReactions();
        this.visElemContAgeFormated();
    }

    ageFormated() {
        return this.jar.ageFormated();
    }

    async attach(jar) {
        this.identity = await universe.Identity.saveIdentity();
        this.jar = jar;
        this.container = this.jar.container;
    }

    /*
     * Event handlers
     */
    async ownerChanged(identity) {
        this.identity = await universe.Identity.saveIdentity();
        debugger;
        this.visElemPermCommentActions();
        this.visElemPermActionReaction();
    }

    showReply( element ) {
        let replies = this.container.querySelectorAll(".aurora-comment-replies")[0];
        replies.appendChild(element);
    }

    updateAge() {
        debugger;
    }

    /**
     * Visibility protocol
     */


    visElemPermActionReaction() {
        let elements = this.container.querySelectorAll(".aurora-comment-action-like");
        let visible  = ! this.identity.isGhost();

        if  ( visible ) {
            elements.forEach( (element) =>  element.classList.add("active") );
        } else {
            elements.forEach( (element) =>  element.classList.remove("active") );
        }
    }
    visElemPermCommentActions() {
        let elements = this.container.querySelectorAll(".aurora-comment-action-reply");
        let visible  = ! this.identity.isGhost();

        if  ( visible ) {
            elements.forEach( (element) =>  element.classList.add("active") );
        } else {
            elements.forEach( (element) =>  element.classList.remove("active") );
        }
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

    switchElementVisibility ( elements, visible, displayValue = 'block' ) {
        elements.forEach( (element) => element.style.display = (visible) ? displayValue: "none" );
    }
    setElementContent ( elements, content ) {
        elements.forEach( (element) => element.innerHTML = content );
    }
}
