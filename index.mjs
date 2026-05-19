/**
 *
 *
 * @author: Bernhard Lukassen
 */

import Aurora              from "./lib/aurora.mjs";
import AuroraAttributeHide from "./lib/auroraattributes/auroraattributehide.mjs";

// import ModelObject                          from "./lib/viewmodel/delegate/modelobject.mjs";
// import ModelCollection                      from "./lib/viewmodel/delegate/modelcollection.mjs";

// UI Elements always needed
export { default as AuroraElement }             from './lib/auroraelement.mjs';
export { default as ThemeBehavior }             from './themes/themebehavior.mjs';


export { default as AuroraBlueprint }           from './lib/blueprint/layout/aurorablueprint.mjs';
export { default as AuroraHeader }              from './lib/blueprint/layout/auroraheader.mjs';
export { default as AuroraFooter }              from './lib/blueprint/layout/aurorafooter.mjs';
export { default as AuroraDrawer }              from './lib/blueprint/layout/auroradrawer.mjs';
export { default as AuroraContainer }           from './lib/blueprint/layout/auroracontainer.mjs';
export { default as AuroraView }                from './lib/blueprint/layout/auroraview.mjs';
export { default as AuroraInclude }             from './lib/blueprint/layout/aurorainclude.mjs';

// aurora attributes
export { default as AuroraAttribute }           from './lib/auroraattributes/auroraattribute.mjs';
export { default as AuroraAttributeName }       from './lib/auroraattributes/auroraattributename.mjs';
export { default as AuroraAttributeAction   }   from './lib/auroraattributes/auroraattributeaction.mjs';
export { default as AuroraAttributeBind   }     from './lib/auroraattributes/auroraattributebind.mjs';
export { default as AuroraAttributeClass   }    from './lib/auroraattributes/auroraattributeclass.mjs';
export { default as AuroraAttributeShow   }     from './lib/auroraattributes/auroraattributeshow.mjs';
export { default as AuroraAttributeHide   }     from './lib/auroraattributes/auroraattributehide.mjs';
export { default as AuroraAttributeEnabled }    from './lib/auroraattributes/auroraattributeenabled.mjs';
export { default as AuroraAttributeReadonly }   from './lib/auroraattributes/auroraattributereadonly.mjs';
export { default as AuroraAttributeI18N }       from './lib/auroraattributes/auroraattributei18n.mjs';
export { default as AuroraAttributeRoute }      from './lib/auroraattributes/auroraattributeroute.mjs';
export { default as AuroraAttributeIntersect }  from './lib/auroraattributes/auroraattributeintersect.mjs';
export { default as AuroraAttributeConnect }    from './lib/auroraattributes/auroraattributeconnect.mjs';

// App Classes
export { default as AuroraApp }                 from './lib/blueprint/auroraapp.mjs';
export { default as AppWidget }                 from './lib/blueprint/appwidget.mjs';
export { default as ThoregonApp }               from './lib/blueprint/thoregonapp.mjs';



// Validations
export { ValidationMethod }                     from './lib/validation/validation.mjs'
export { ValidationMethodEmpty }                from './lib/validation/validation.mjs'
export { ValidationMethodRequired }             from './lib/validation/validation.mjs'

// Views
export { default as View }                      from './lib/viewspec/view.mjs';
export { default as ViewModel }                 from './lib/viewmodel/viewmodel.mjs';
export { default as ListItemViewModel }         from './lib/viewmodel/listitemviewmodel.mjs';

// export { default as CollectionViewModel }       from './lib/viewmodel/collectionviewmodel.mjs';

export { default as UIRouter }                  from './lib/routes/uirouter.mjs';

// Editor
// export { default as EditorJS }                  from './lib/editor/editor.mjs';

export { default as AuroraCollection } from "./lib/collection/auroracollection.mjs";
export { default as AuroraSection } from "./lib/blueprint/layout/aurorasection.mjs";
export { default as AuroraSectionSticky} from "./lib/blueprint/layout/aurorasectionsticky.mjs";
export { default as AuroraCodeScanner } from "./lib/cameracomponents/auroracodescanner.mjs";
export { default as AuroraCollectionItem } from "./lib/collection/auroracollectionitem.mjs";
export { default as AuroraAlert } from "./lib/component-alert/auroraalert.mjs";
export { default as AuroraAvatar } from "./lib/formcomponents/auroraavatar.mjs";
export { default as AuroraButton } from "./lib/formcomponents/aurorabutton.mjs";
export { default as AuroraButtonGroup } from "./lib/formcomponents/aurorabuttongroup.mjs";
export { default as AuroraCard } from "./lib/formcomponents/auroracard.mjs";
export { default as AuroraQRCode } from "./lib/component-qrcode/auroraqrcode.mjs";
export { default as AuroraNavigationItem } from "./lib/component-navigationitem/auroranavigationitem.mjs";
export { default as AuroraChatEntryBox } from "./lib/formcomponents/aurorachatentrybox.mjs";
export { default as AuroraChatMessage } from "./lib/formcomponents/aurorachatmessage.mjs";
export { default as AuroraCheckbox } from "./lib/formcomponents/auroracheckbox.mjs";
export { default as AuroraComment } from "./lib/formcomponents/auroracomment.mjs";
export { default as AuroraCommentMessageBox } from "./lib/formcomponents/auroracommentmessagebox.mjs";
export { default as AuroraEmptyLine } from "./lib/formcomponents/auroraemptyline.mjs";
export { default as AuroraFloatingActionButton } from "./lib/formcomponents/aurorafloatingactionbutton.mjs";
export { default as AuroraImageCropper } from "./lib/formcomponents/auroraimagecropper.mjs";
export { default as AuroraListItem } from "./lib/formcomponents/auroralistitem.mjs";
export { default as AuroraPinCode } from "./lib/formcomponents/aurorapincode.mjs";
export { default as AuroraSelect } from "./lib/formcomponents/auroraselect.mjs";
export { default as AuroraMultiSelect } from "./lib/formcomponents/auroramultiselect.mjs";
export { default as AuroraStep } from "./lib/formcomponents/aurorastep.mjs";
export { default as AuroraStepper } from "./lib/formcomponents/aurorastepper.mjs";
export { default as AuroraSwitch } from "./lib/formcomponents/auroraswitch.mjs";
export { default as AuroraSlider } from "./lib/formcomponents/auroraslider.mjs";
export { default as AuroraColorPicker } from "./lib/formcomponents/auroracolorpicker.mjs";
export { default as AuroraTextarea } from "./lib/formcomponents/auroratextarea.mjs";
export { default as AuroraTextField } from "./lib/formcomponents/auroratextfield.mjs";
export { default as AuroraToolbar } from "./lib/formcomponents/auroratoolbar.mjs";
export { default as AuroraToolbarTitle } from "./lib/formcomponents/auroratoolbartitle.mjs";
export { default as AuroraValidationIndicator } from "./lib/indicators/auroravalidationindicator.mjs";
export { default as AuroraLink } from "./lib/routes/auroralink.mjs";
export { default as AuroraChart } from "./lib/component-chart/aurorachart.mjs";
export { default as AuroraVideo } from "./lib/component-video/auroravideo.mjs";
export { default as Stripe } from "./lib/stripe/stripe.mjs";
export { default as Paypal } from "./lib/paypal/paypal.mjs";
export { default as AuroraTabContainer } from "./lib/component-tabs/auroratabcontainer.mjs";
export { default as AuroraTabList } from "./lib/component-tabs/auroratablist.mjs";
export { default as AuroraTab } from "./lib/component-tabs/auroratab.mjs";
export { default as AuroraTabPanelList } from "./lib/component-tabs/auroratabpanellist.mjs";
export { default as AuroraTabPanel } from "./lib/component-tabs/auroratabpanel.mjs";

export default Aurora;



export { default as AuroraBlueprintNew }        from './lib/blueprint/layout/aurorablueprintnew.mjs';

// todo [REFACTOR]: AuroraTable doesn't work when dynamically loaded. fix it
export { default as AuroraList }               from './lib/component-list/auroralist.mjs';
export { default as AuroraActions }            from './lib/component-actions/auroraactions.mjs';

//
// material theme
//

export { default as MaterialThoregonApp } from "./themes/material/app/materialthoregonapp.mjs";
export { default as MaterialAvatar } from "./themes/material/avatar/materialavatar.mjs";
// export { default as } from "themes/material/blueprint/materialblueprint.mjs";
export { default as MaterialBlueprint } from "./themes/material/blueprint/materialblueprintnew.mjs";
export { default as MaterialCollectionLink } from "./themes/material/blueprint/materialcollectionlink.mjs";
export { default as MaterialLink } from "./themes/material/blueprint/materiallink.mjs";
export { default as MaterialContainer } from "./themes/material/blueprint-container/materialcontainer.mjs";
export { default as MaterialDrawer } from "./themes/material/blueprint-drawer/materialdrawer.mjs";
export { default as MaterialFooter } from "./themes/material/blueprint-footer/materialfooter.mjs";
export { default as MaterialView } from "./themes/material/blueprint-view/materialview.mjs";
export { default as MaterialHeader } from "./themes/material/blueprint-header/materialheader.mjs";
export { default as MaterialSection } from "./themes/material/blueprint-section/materialsection.mjs";
export { default as MaterialSectionSticky } from "./themes/material/blueprint-section-sticky/materialsection-sticky.mjs";
export { default as MaterialCollection } from "./themes/material/collections/materialcollection.mjs";
export { default as MaterialCollectionItem } from "./themes/material/collections/materialcollectionitem.mjs";
export { default as MaterialActions } from "./themes/material/component-actions/materialactions.mjs";
export { default as MaterialAlert } from "./themes/material/component-alert/materialalert.mjs";
export { default as MaterialCard } from "./themes/material/component-card/materialcard.mjs";
// export { default as MaterialChart } from "./themes/material/component-chart/materialchart.mjs";
export { default as MaterialList } from "./themes/material/component-list/materiallist.mjs";
export { default as Materiallistitem } from "./themes/material/component-listitem/materiallistitem.mjs";
export { default as MaterialNavigationItem } from "./themes/material/component-navigationitem/materialnavigationitem.mjs";
export { default as MaterialQRCode } from "./themes/material/component-qrcode/materialqrcode.mjs";
export { default as Materialstepper } from "./themes/material/component-stepper/materialstepper.mjs";
export { default as MaterialTab } from "./themes/material/component-tabs/materialtab.mjs";
export { default as Materialtabcontainer } from "./themes/material/component-tabs/materialtabcontainer.mjs";
export { default as MaterialTabPanel } from "./themes/material/component-tabs/materialtabpanel.mjs";
export { default as MaterialTabList } from "./themes/material/component-tabs/materialtablist.mjs";
export { default as MaterialTabPanelList } from "./themes/material/component-tabs/materialtabpanellist.mjs";
export { default as MaterialVideo } from "./themes/material/component-video/materialvideo.mjs";
export { default as MaterialButton } from "./themes/material/form-button/materialbutton.mjs";
export { default as MaterialbuttonGroup } from "./themes/material/form-buttongroup/materialbuttongroup.mjs";
export { default as Materialcheckbox } from "./themes/material/form-checkbox/materialcheckbox.mjs";
export { default as Materialcolorpicker } from "./themes/material/form-colorpicker/materialcolorpicker.mjs";
export { default as MaterialFloatingActionButton } from "./themes/material/form-floatingactionbutton/materialfloatingactionbutton.mjs";
export { default as MaterialImageCropper } from "./themes/material/form-image-cropper/materialimagecropper.mjs";
export { default as MaterialMultiSelect } from "./themes/material/form-multiselect/materialmultiselect.mjs";
export { default as MaterialPinCode } from "./themes/material/form-pincode/materialpincode.mjs";
export { default as MaterialSelect } from "./themes/material/form-select/materialselect.mjs";
export { default as MaterialSlider } from "./themes/material/form-slider/materialslider.mjs";
export { default as MaterialSwitch } from "./themes/material/form-switch/materialswitch.mjs";
export { default as MaterialTextarea } from "./themes/material/form-textarea/materialtextarea.mjs";
export { default as MaterialTextField } from "./themes/material/form-textfield/materialtextfield.mjs";
// export { default as } from "themes/material/formcomponents/formcomponents.js";
export { default as MaterialPaypal } from "./themes/material/paypal/materialpaypal.mjs";
export { default as MaterialStripe } from "./themes/material/stripe/materialstripe.mjs";
export { default as Materialtoolbar } from "./themes/material/toolbar/materialtoolbar.mjs";
export { default as MaterialToolbarTitle } from "./themes/material/toolbartitle/materialtoolbartitle.mjs";
export { default as Ripple } from "./themes/material/ripple.mjs";
// export { default as } from "themes/material/";

