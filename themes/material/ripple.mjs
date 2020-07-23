/**
 * Simple ripple replica
 * todo [REFACTOR]: exchange with better (more original) ripple effect
 *
 * @author: Martin Neitz
 */

export default class Ripple {

    constructor( rippleElement ) {
        rippleElement.addEventListener("click", (event)=>{
            let X = event.pageX - rippleElement.offsetLeft;
            let Y = event.pageY - rippleElement.offsetTop;
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
