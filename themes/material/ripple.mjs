/**
 * Simple ripple replica
 * todo [REFACTOR]: exchange with better (more original) ripple effect
 *
 * @author: Martin Neitz
 */

export default class Ripple {

    constructor( rippleElement ) {
        if (!rippleElement) return;
        rippleElement.addEventListener("click", (event)=>{
            let rect = rippleElement.getBoundingClientRect();
            let X = event.clientX - rect.left;
            let Y = event.clientY - rect.top;

            let rippleDiv = document.createElement("div");
            rippleDiv.classList.add('ripple');
            rippleDiv.setAttribute("style","top:"+Y+"px; left:"+X+"px;");
            let customColor = rippleElement.getAttribute('ripple-color');
            if (customColor) rippleDiv.style.background = customColor;
            rippleElement.appendChild(rippleDiv);
            setTimeout(function(){
                rippleDiv.parentElement.removeChild(rippleDiv);
            }, 900);
        } )
    }

}
