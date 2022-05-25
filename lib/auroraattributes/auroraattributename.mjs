/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import AuroraElement   from "../auroraelement.mjs";
import AuroraAttribute from "./auroraattribute.mjs";

export default class AuroraAttributeName extends AuroraAttribute {

    static get name() {
        return "name";
    }

    static get supportsSelector() {
        return true;
    }


}

AuroraElement.useAuroraAttribute(AuroraAttributeName);
