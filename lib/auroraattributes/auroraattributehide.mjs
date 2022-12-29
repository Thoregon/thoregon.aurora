/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import AuroraAttributeShow from "./auroraattributeshow.mjs";
import AuroraElement       from "../auroraelement.mjs";

export default class AuroraAttributeHide extends AuroraAttributeShow {


    static get name() {
        return "hide";
    }

    async evaluate(params) {
        return !(await this.fn(params));
    }
}

AuroraElement.useAuroraAttribute(AuroraAttributeHide);
