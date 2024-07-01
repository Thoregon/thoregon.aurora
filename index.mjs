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

//
// aurora service
// define aurora elements to be loaded dynamic
// export default Aurora.withElements({});
export default Aurora.withElements({
                                       // 'thoregon-app'               : './lib/blueprint/ThoregonApp',
                                       // 'aurora-blueprint'           : './lib/blueprint/layout/aurorablueprint.mjs',
                                       // 'aurora-container'           : './lib/blueprint/layout/auroracontainer.mjs',
                                       // 'aurora-drawer'              : './lib/blueprint/layout/auroradrawer.mjs',
                                       // 'aurora-footer'              : './lib/blueprint/layout/aurorafooter.mjs',
                                       // 'aurora-header'              : './lib/blueprint/layout/auroraheader.mjs',
                                       // 'aurora-view'                : './lib/blueprint/layout/auroraview.mjs',
                                       // 'aurora-list'               : './lib/table/auroralist.mjs',
                                        'aurora-collection'          : './lib/collection/auroracollection.mjs',
                                        'aurora-section'             : './lib/blueprint/layout/aurorasection.mjs',
                                        'aurora-section-sticky'      : './lib/blueprint/layout/aurorasectionsticky.mjs',
                                        'aurora-codescanner'           : './lib/cameracomponents/auroracodescanner.mjs',
                                        //'aurora-qrscanner'           : './lib/cameracomponents/auroraqrscanner.mjs',
                                        //'aurora-actions'             : './lib/component-actions/auroraactions.mjs',
                                        'aurora-collectionitem'      : './lib/collection/auroracollectionitem.mjs',
                                        'aurora-alert'               : './lib/component-alert/auroraalert.mjs',
                                        'aurora-avatar'              : './lib/formcomponents/auroraavatar.mjs',
                                        'aurora-button'              : './lib/formcomponents/aurorabutton.mjs',
                                        'aurora-buttongroup'         : './lib/formcomponents/aurorabuttongroup.mjs',
                                        'aurora-card'                : './lib/formcomponents/auroracard.mjs',
                                        'aurora-qrcode'              : './lib/component-qrcode/auroraqrcode.mjs',
                                        'aurora-navigation-item'     : './lib/component-navigationitem/auroranavigationitem.mjs',
                                        'aurora-chatentrybox'        : './lib/formcomponents/aurorachatentrybox.mjs',
                                        'aurora-chatmessage'         : './lib/formcomponents/aurorachatmessage.mjs',
                                        'aurora-checkbox'            : './lib/formcomponents/auroracheckbox.mjs',
                                        'aurora-comment'             : './lib/formcomponents/auroracomment.mjs',
                                        'aurora-commentmessagebox'   : './lib/formcomponents/auroracommentmessagebox.mjs',
                                        'aurora-emptyline'           : './lib/formcomponents/auroraemptyline.mjs',
                                        'aurora-floatingactionbutton': './lib/formcomponents/aurorafloatingactionbutton.mjs',
                                        'aurora-image-cropper'       : './lib/formcomponents/auroraimagecropper.mjs',
                                        'aurora-listitem'            : './lib/formcomponents/auroralistitem.mjs',
                                        'aurora-pincode'             : './lib/formcomponents/aurorapincode.mjs',
                                        'aurora-select'              : './lib/formcomponents/auroraselect.mjs',
                                        'aurora-multiselect'         : './lib/formcomponents/auroramultiselect.mjs',
                                        'aurora-step'                : './lib/formcomponents/aurorastep.mjs',
                                        'aurora-stepper'             : './lib/formcomponents/aurorastepper.mjs',
                                        'aurora-switch'              : './lib/formcomponents/auroraswitch.mjs',
                                        'aurora-slider'              : './lib/formcomponents/auroraslider.mjs',
                                        'aurora-colorpicker'         : './lib/formcomponents/auroracolorpicker.mjs',
                                        'aurora-textarea'            : './lib/formcomponents/auroratextarea.mjs',
                                        'aurora-inputtext'           : './lib/formcomponents/auroratextfield.mjs',
                                        'aurora-toolbar'             : './lib/formcomponents/auroratoolbar.mjs',
                                        'aurora-toolbar-title'       : './lib/formcomponents/auroratoolbartitle.mjs',
                                        'aurora-validation-indicator': './lib/indicators/auroravalidationindicator.mjs',
                                        'aurora-link'                : './lib/routes/auroralink.mjs',
                                        'aurora-chart'               : './lib/component-chart/aurorachart.mjs',
                                        'aurora-video'               : './lib/component-video/auroravideo.mjs',

                                        'aurora-stripe'              : './lib/stripe/stripe.mjs',
                                        'aurora-paypal'              : './lib/paypal/paypal.mjs',

                                        'aurora-tab-container'       : [
                                            './lib/component-tabs/auroratabcontainer.mjs',
                                            './lib/component-tabs/auroratablist.mjs',
                                            './lib/component-tabs/auroratab.mjs',
                                            './lib/component-tabs/auroratabpanellist.mjs',
                                            './lib/component-tabs/auroratabpanel.mjs'

                                        ],
                                   });
// todo [REFACTOR]: AuroraTable doesn't work when dynamically loaded. fix it
export { default as AuroraList }               from './lib/component-list/auroralist.mjs';
export { default as AuroraActions }            from './lib/component-actions/auroraactions.mjs';

export { default as AuroraSelect }              from './lib/formcomponents/auroraselect.mjs';
/*
export { default as AuroraTextField }           from './lib/formcomponents/auroratextfield.mjs';
export { default as AuroraTextarea }            from './lib/formcomponents/auroratextarea.mjs';
export { default as AuroraSelect }              from './lib/formcomponents/auroraselect.mjs';
export { default as AuroraButton }              from './lib/formcomponents/aurorabutton.mjs';
export { default as AuroraFloatingActionButton }from './lib/formcomponents/aurorafloatingactionbutton.mjs';
export { default as AuroraCheckbox }            from './lib/formcomponents/auroracheckbox.mjs';
export { default as AuroraSwitch }              from './lib/formcomponents/auroraswitch.mjs';
export { default as AuroraPinCode }             from './lib/formcomponents/aurorapincode.mjs';
export { default as AuroraStepper }             from './lib/formcomponents/aurorastepper.mjs';
export { default as AuroraStep }                from './lib/formcomponents/aurorastep.mjs';
export { default as AuroraEmptyLine }           from './lib/formcomponents/auroraemptyline.mjs';
export { default as AuroraChatMessage }         from './lib/formcomponents/aurorachatmessage.mjs';
export { default as AuroraChatEntryBox }        from './lib/formcomponents/aurorachatentrybox.mjs';
export { default as AuroraComment }             from './lib/formcomponents/auroracomment.mjs';
export { default as AuroraCommentMessageBox }   from './lib/formcomponents/auroracommentmessagebox.mjs';
export { default as AuroraValidationIndicator } from './lib/indicators/auroravalidationindicator.mjs';
export { default as AuroraImageCropper }        from './lib/formcomponents/auroraimagecropper.mjs';
export { default as AuroraCollection }          from './lib/collection/auroracollection.mjs';
export { default as AuroraListItem }            from './lib/formcomponents/auroralistitem.mjs';
export { default as AuroraLink }                from './lib/routes/auroralink.mjs';
export { default as AuroraAvatar }              from './lib/formcomponents/auroraavatar.mjs';
export { default as AuroraCard }                from './lib/formcomponents/auroracard.mjs';
export { default as AuroraQRScanner }           from './lib/cameracomponents/auroraqrscanner.mjs';
export { default as AuroraSectionSticky }       from './lib/blueprint/layout/aurorasectionsticky.mjs';
export { default as AuroraSection }             from './lib/blueprint/layout/aurorasection.mjs';
export { default as AuroraToolbar }             from './lib/formcomponents/auroratoolbar.mjs';
export { default as AuroraToolbarTitle }        from './lib/formcomponents/auroratoolbartitle.mjs';
*/
