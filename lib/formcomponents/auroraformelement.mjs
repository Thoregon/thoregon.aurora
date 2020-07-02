/**
 *
 *
 * @author: Bernhard Lukassen
 */

import AuroraElement                from "../auroraelement.mjs";

// todo [OPEN]:
//  - default theme from universe e.g. `../themes/${universe.uitheme}.mjs`
//  - theme switchable?
import('../themes/material.mjs');

export default class AuroraFormElement extends AuroraElement {

    /**
     *  todo: cascade of field definitions
     *  todo: counter
     *  todo: model  -> View Model Design
     *  todo: validations and errors
     *  todo: make own CSS for text Field
     *  todo: add text type
     *
     */

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
                if ( attributes[prop] === '' ) {
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
 //       let parentPropertiesValues = super.propertiesValues();
 //       return Object.assign(parentPropertiesValues,
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
            requered: {
                default:        false,
                type:           'boolean',
                description:    'The field will be disabled, and the user can not enter',
                group:          'Behavior',
                example:        ''
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
            }
        };
    }

}
