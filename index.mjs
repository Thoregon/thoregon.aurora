/**
 *
 *
 * @author: Bernhard Lukassen
 */

import Aurora                               from "./lib/aurora.mjs";

// View Models
export { default as ViewModel }             from './lib/viewmodel/viewmodel.mjs';

import ModelObject                          from "./lib/viewmodel/delegate/modelobject.mjs";
import ModelCollection                      from "./lib/viewmodel/delegate/modelcollection.mjs";

// UI Elements
export { default as AuroraTextField }       from './lib/formcomponents/auroratextfield.mjs';
export { default as AuroraButton }      from './lib/formcomponents/aurorabutton.mjs';
export { default as AuroraQRScanner }       from './lib/cameracomponents/auroraqrscanner.mjs';

export default new Aurora();
