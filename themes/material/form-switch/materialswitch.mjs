/**
 *
 *
 * @author: Bernhard Lukassen
 */

import ThemeBehavior            from "../../themebehavior.mjs";
import { validationLevel }      from "../../../lib/common.mjs";

export default class MaterialSwitch extends ThemeBehavior {

    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;
        this._value = '';

        let field  = this.container.querySelector(".aurora-switch input");
 //       field.addEventListener('click', this.callbackClicked, false);

        field.addEventListener('click', (e)=>{
            this.callbackClicked( field );
        });
    }

    callbackClicked( field ) {
        this.value = field.checked;
        this.jar.switchToggled();
    }

    get value() {
        return this._value;
    }
    set value( value ) {
        this._value = value;
        let field  = this.container.querySelector(".aurora-switch input");
        field.checked = value;
    }

}
