/**
 *
 *
 * @author: Bernhard Lukassen
 */

import Aurora                               from "./lib/aurora.mjs";

import ModelObject                          from "./lib/viewmodel/delegate/modelobject.mjs";
import ModelCollection                      from "./lib/viewmodel/delegate/modelcollection.mjs";

// UI Elements
export { default as ThemeBehavior }             from './themes/themebehavior.mjs';
export { default as AuroraElement }             from './lib/auroraelement.mjs';
export { default as AuroraTextField }           from './lib/formcomponents/auroratextfield.mjs';
export { default as AuroraButton }              from './lib/formcomponents/aurorabutton.mjs';
export { default as AuroraChatMessage }         from './lib/formcomponents/aurorachatmessage.mjs';
export { default as AuroraChatEntryBox }        from './lib/formcomponents/aurorachatentrybox.mjs';
export { default as AuroraValidationIndicator } from './lib/indicators/auroravalidationindicator.mjs';
export { default as AuroraQRScanner }           from './lib/cameracomponents/auroraqrscanner.mjs';

// App Classes
export { default as AuroraApp }                 from './lib/blueprint/auroraapp.mjs';
export { default as AppWidget }                 from './lib/blueprint/appwidget.mjs';
export { default as ThoregonApp }               from './lib/blueprint/thoregonapp.mjs';

// Validations
export { ValidationMethod }                     from './lib/validation/validation.mjs'
export { ValidationMethodEmpty }                from './lib/validation/validation.mjs'
export { ValidationMethodRequired }             from './lib/validation/validation.mjs'

// Views
export { default as ViewModel }                 from './lib/viewmodel/viewmodel.mjs';

// aurora service
export default new Aurora();
