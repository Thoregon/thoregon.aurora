/**
 * Represents a part functionality of an app
 * it can be limited als with parameters (element attributes)
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import AuroraApp             from "./auroraapp.mjs";
import AuroraElement         from "../auroraelement.mjs";
import { ErrNotImplemented } from "../errors.mjs";

export default class AppWidget extends AuroraApp(AuroraElement) {

}
