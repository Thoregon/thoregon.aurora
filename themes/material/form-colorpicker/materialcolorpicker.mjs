/**
 *
 *
 * @author: Bernhard Lukassen
 */

import ThemeBehavior            from "../../themebehavior.mjs";
import { validationLevel }      from "../../../lib/common.mjs";

export default class Materialcolorpicker extends ThemeBehavior {

    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;
        this._value = '';

        let field  = this.container.querySelector(".aurora-colorpicker-container input");
 //       field.addEventListener('click', this.callbackClicked, false);

        field.addEventListener('input', (e)=>{
            this.valueChanged( field );
        });
    }

    valueChanged( event ) {
        const field        = this.container.querySelector(".aurora-colorpicker-container input");
        const value        = field.value;
        const valueField   = this.container.querySelector(".aurora-color-value");
        const previewField = this.container.querySelector(".aurora-color-preview");

        valueField.innerHTML = value;
        previewField.style.backgroundColor = value;
    }
}
