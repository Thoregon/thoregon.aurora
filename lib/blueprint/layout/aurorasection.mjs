/**
 *
 *
 * @author: Martin Neitz, Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import AuroraBlueprintElement from "./aurorablueprintelement.mjs";

const debuglog = (...args) => {}; // {};   // console.log(...args);

export default class AuroraSection extends AuroraBlueprintElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-section';
    }

    /*
     * aurora element features
     */

    // theme ... component... templates

    get componentConfiguration() {
        return {
            theme: 'material',
            component: 'blueprint-section',
            templates: ['section'],
        }
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            center: {
                default:        'false',
                type:           'Boolean',
                description:    'Should the content be centerd',
                group:          'Behavior',
                example:        'true'
            },
            type: {
                default:        'outlined',
                type:           'string',
                description:    'which type of section',
                group:          'Behavior',
                example:        'elevated | filled | outlined'
            },
            elevation: {
                default:        '0',
                type:           'number',
                description:    'the elevation level of the section',
                group:          'Behavior',
                example:        '0 - 5'
            },
        });
    }

    propertiesAsBooleanRequested() {
        return {};
    }

    getDefaultWidth() { return false; }

    /**
     *  routine to add all needed classes.
     *  This only can be done on the element level as it will be differ from element to element
     */
    collectClasses() {
        let classes = [];
        let propertiesValues = this.propertiesValues();

        if ( propertiesValues['center'] === true )  { classes.push( 'center' ); }
        if ( propertiesValues['elevation'] )  { classes.push('elevation-level' + propertiesValues['elevation']); }
        if ( propertiesValues['type'] )       { classes.push('type-' + propertiesValues['type']); }

        return classes;
    }

    async adjustContent(container) {
        container.classList.add("aurora-section-wrapper");
    }

    get appliedTemplateName() {
        return 'section';
    }

    getMyBlueprintElement() {
        if (this.uibase) return this.uibase.getMyBlueprintElement();
        if (this.parentElement) return this.parentElement.getMyBlueprintElement();
    }
}

AuroraSection.defineElement();
