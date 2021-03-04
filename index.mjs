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
export { default as AuroraTextarea }            from './lib/formcomponents/auroratextarea.mjs';
export { default as AuroraButton }              from './lib/formcomponents/aurorabutton.mjs';
export { default as AuroraFloatingActionButton }from './lib/formcomponents/aurorafloatingactionbutton.mjs';
export { default as AuroraCheckbox }            from './lib/formcomponents/auroracheckbox.mjs';
export { default as AuroraSwitch }              from './lib/formcomponents/auroraswitch.mjs';
export { default as AuroraPinCode }             from './lib/formcomponents/aurorapincode.mjs';
export { default as AuroraChatMessage }         from './lib/formcomponents/aurorachatmessage.mjs';
export { default as AuroraChatEntryBox }        from './lib/formcomponents/aurorachatentrybox.mjs';
export { default as AuroraComment }             from './lib/formcomponents/auroracomment.mjs';
export { default as AuroraCommentMessageBox }   from './lib/formcomponents/auroracommentmessagebox.mjs';
export { default as AuroraValidationIndicator } from './lib/indicators/auroravalidationindicator.mjs';
export { default as AuroraImageCropper }        from './lib/formcomponents/auroraimagecropper.mjs';

export { default as AuroraCollection }          from './lib/collection/auroracollection.mjs';
export { default as AuroraListItem }            from './lib/formcomponents/auroralistitem.mjs';
export { default as AuroraLink }                from './lib/routes/auroralink.mjs';

export { default as AuroraCard}                 from './lib/formcomponents/auroracard.mjs';

export { default as AuroraQRScanner }           from './lib/cameracomponents/auroraqrscanner.mjs';

export { default as AuroraBlueprint }           from './lib/blueprint/layout/aurorablueprint.mjs';
export { default as AuroraHeader }              from './lib/blueprint/layout/auroraheader.mjs';
export { default as AuroraDrawer }              from './lib/blueprint/layout/auroradrawer.mjs';
export { default as AuroraContainer }           from './lib/blueprint/layout/auroracontainer.mjs';
export { default as AuroraSectionSticky }       from './lib/blueprint/layout/aurorasectionsticky.mjs';
export { default as AuroraView }                from './lib/blueprint/layout/auroraview.mjs';
export { default as AuroraSection }             from './lib/blueprint/layout/aurorasection.mjs';

export { default as AuroraToolbar }             from './lib/formcomponents/auroratoolbar.mjs';

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
export { default as CollectionViewModel }       from './lib/viewmodel/collectionviewmodel.mjs';
export { default as View }                      from './lib/viewspec/view.mjs';

export { default as UIRouter }                  from './lib/routes/uirouter.mjs';

// aurora service
export default new Aurora();
