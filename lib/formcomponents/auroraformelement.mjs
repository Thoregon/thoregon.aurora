/**
 *
 *
 * @author: Bernhard Lukassen
 */

import { UIObservingElement }       from '/evolux.ui';
import auroratemplates              from '/@auroratemplates';

export default class AuroraFormElement extends UIObservingElement {


    static getTemplates() {
        return auroratemplates;
    }

    getTemplate() {
        return AuroraFormElement.getTemplates()[ 'material' ][ this.templateElement() ];
    }


    /**
     * Will return all attributes which are filled.
     * @returns {{}}
     */
    transferredAttributes() {
        var attributesUsed = {};
        var attributes = this.attributes;
        for ( var i in attributes ) {
            attributesUsed[attributes[i].name] = attributes[i].nodeValue;
        }
        return attributesUsed;
    }

    propertiesValues() {
        var propertiesValues = {};
        var defaults   = this.propertiesDefaultValues();
        var attributes = this.transferredAttributes();

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
        }
        return propertiesValues;
    }

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
            'stack-label': {
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
            // displayschema schema plattform display material
            schema: {
                default:        'web',
                type:           'string',
                description:    'This setting determines teh appearance of the form element',
                group:          'Content',
                example:        'web ios android'
            }
        };
    }

    elementStyle() {

        return `
            p { font-family: "Courier New"; }
            
        `;
    }

    buildElement() {
        return this.builder.newDiv();
    }

}
