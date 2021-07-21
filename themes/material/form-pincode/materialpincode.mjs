/**
 *
 *
 * @author: Martin Neitz
 *
 * https://codepen.io/RobertAron/pen/gOLLXLo?editors=0010
 */

import ThemeBehavior            from "../../themebehavior.mjs";

import Ripple                   from '../ripple.mjs';

export default class MaterialPinCode extends ThemeBehavior {

    rootElement = '';

    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;

        const inputElements = [...this.container.querySelectorAll('input.aurora-pin-digit')];

        inputElements.forEach((ele,index)=>{
            ele.addEventListener('keydown',(e)=>{
                if(e.keyCode === 8 && e.target.value==='') inputElements[Math.max(0,index-1)].focus()
            })
            ele.addEventListener('input',(e)=>{
                const [first,...rest] = e.target.value
                e.target.value = first ?? ''
                if(index!==inputElements.length-1 && first!==undefined) {
                    inputElements[index+1].focus()
                    inputElements[index+1].value = rest.join('')
                    inputElements[index+1].dispatchEvent(new Event('input'))
                }
            })
            ele.addEventListener('keyup', (e)=>{
                this.checkAndNotify( inputElements );
            });
        })

        new Ripple( this.container.querySelector('.aurora-button-ripple'));
    }

    checkAndNotify( inputElements ) {
        let code = inputElements
            .map(({value})=>value)
            .join('');

        if ( code.length === inputElements.length ) {
            console.log("code filled");
        }
    }
}
