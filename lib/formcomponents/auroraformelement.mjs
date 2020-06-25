/**
 *
 *
 * @author: Bernhard Lukassen
 */

import { UIObservingElement }       from '/evolux.ui';
import auroratemplates              from '/@auroratemplates';

export default class AuroraFormElement extends UIObservingElement {

    //--- classes to add
    get templates() {
        let tplelem = this.templateElements;
        let tplnames = tplelem.templates;
        return tplnames.map((name) => auroratemplates[tplelem.theme || 'material'][tplelem.component][name]);
    }


    /**
     * Will return all attributes which are filled.
     * @returns {{}}
     */
    transferredAttributes() {
        let attributesTransferred = {};
        [...this.attributes].forEach(attribute => attributesTransferred[attribute.name] = attribute.nodeValue);
        return attributesTransferred;
    }

    propertiesValues() {
        var propertiesValues = {};
        var defaults   = this.propertiesDefaultValues();
        var attributes = this.transferredAttributes();
        var asBoolean  = this.propertiesAsBooleanRequested();

        for (var prop of Object.keys( defaults ) ) {
            if ( attributes.hasOwnProperty( prop ) ) {
                if ( attributes[prop] == '' ) {
                    propertiesValues[prop] = true;
                } else {
                    propertiesValues[prop] = attributes[prop];
                }
            } else {
                propertiesValues[prop] = defaults[prop];
            }
            if ( asBoolean.hasOwnProperty( prop ) ) {
                if ( propertiesValues[prop] &&
                     propertiesValues[prop] != '' ) {
                    propertiesValues[ asBoolean[prop] ] = true;
                } else {
                    propertiesValues[ asBoolean[prop] ] = false;
                }
            }
        }
        return propertiesValues;
    }

    propertiesAsBooleanRequested() { return {};}

    propertiesDefaultValues() {
        var defaultValues = {};
        for ( var i in this.propertiesDefinitions() ) {
            defaultValues[i] = this.propertiesDefinitions()[i]['default'];
        }
        return defaultValues;
    }

    propertiesDefinitions() {
        return {

            label: {
                default:        '',
                type:           'string',
                description:    'A text Label that will describe the Field',
                group:          'Content',
                example:        'FirstName'
            },
            stack_label: {
                default:        false,
                type:           'boolean',
                description:    'defines the position of the label',
                group:          'Content',
                example:        'true'
            },
            name: {
                default:        '',
                type:           'string',
                description:    'The name of the control.',
                group:          'Content',
                example:        'first_name'
            },
            theme: {
                default:        'material',
                type:           'string',
                description:    'This setting determines the appearance of the form element',
                group:          'Behavior',
                example:        'web ios android'
            },
            leading_icon: {
                default:        '',
                type:           'string',
                description:    'Name of the icon to be used infront of the field',
                group:          'Content',
                example:        'globe'
            },
            trailing_icon: {
                default:        '',
                type:           'string',
                description:    'Name of the icon to be used after of the field',
                group:          'Content',
                example:        'globe'
            },
            disabled: {
                default:        false,
                type:           'boolean',
                description:    'The field will be disabled, and the user can not enter',
                group:          'Behavior',
                example:        ''
            },
            readonly: {
                default:        false,
                type:           'boolean',
                description:    'The field will be readonly, and the user can not enter',
                group:          'Behavior',
                example:        ''
            },
        };
    }

    elementStyle() {
        let tplelem = this.templateElements;
        let css = auroratemplates[tplelem.theme || 'material'][tplelem.component][`$${tplelem.component}`];
        return css || '';
    }

    buildElement() {
        return this.builder.newDiv();
    }

}
