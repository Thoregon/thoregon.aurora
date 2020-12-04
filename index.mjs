/**
 *
 *
 * @author: Bernhard Lukassen
 */

import Aurora                               from "./lib/aurora.mjs";

import ModelObject                          from "./lib/viewmodel/delegate/modelobject.mjs";
import ModelCollection                      from "./lib/viewmodel/delegate/modelcollection.mjs";

// UI Elements
export { default as AuroraAppElement }      from './lib/blueprint/appelement.mjs';
export { default as AuroraTextField }       from './lib/formcomponents/auroratextfield.mjs';
export { default as AuroraButton }          from './lib/formcomponents/aurorabutton.mjs';
//export { default as AuroraChatMessage }     from './lib/formcomponents/aurorachatmessage.mjs';

export { default as AuroraValidationIndicator }      from './lib/indicators/auroravalidationindicator.mjs';

export { default as AuroraQRScanner }       from './lib/cameracomponents/auroraqrscanner.mjs';

// App Classes
export { default as AuroraApp }             from './lib/blueprint/auroraapp.mjs';
export { default as ComponentBehavior }     from './lib/blueprint/componentbehavior.mjs';

// Views
export { default as ViewModel }             from './lib/viewmodel/viewmodel.mjs';
// export { default as ViewModelBuilder }      from './lib/viewmodel/viewmodelbuilder.mjs';

// Blueprint
export { default as ThoregonApp }           from './lib/blueprint/thoregonapp.mjs';

// aurora service
export default new Aurora();
