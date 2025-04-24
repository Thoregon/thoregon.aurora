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
    async prepare() {
        this._container = this;

    }

    async elementStyle(templatename) {
        return '';
    }

    async applyContent(container) {
    }
*/

    /*
     * aurora element features
     */

    // theme ... component... templates

    static get observedAttributes() {
        return [...super.observedAttributes, 'label', 'summary'];
    }
/*
    static forwardedAttributes() {
        return Object.assign(super.forwardedAttributes(), {
            label: { select: 'legend' },
        });
    }
*/
    attributeChangedCallback(name, oldValue, newValue) {
        if ( ! this.container ) return;

        switch (name) {
            case 'label' :
                this.behavior.setLabel(newValue);
                break;
            case 'summary' :
                this.addInitFn(() => this.behavior.setSummary(newValue));

        }
        return super.attributeChangedCallback(name, oldValue, newValue);
    }

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
            label    : {
                default    : '',
                type       : 'string',
                description: 'Label of the section',
                group      : 'content',
                example    : 'Address Information'
            },
            icon: {
                default:        '',
                type:           'string',
                description:    'Name of the icon to be used before the label',
                group:          'Content',
                example:        'globe'
            },
            summary    : {
                default    : '',
                type       : 'string',
                description: 'summary of the section',
                group      : 'content',
                example    : 'Address Information'
            },
            accordion: {
                default    : false,
                type       : 'Boolean',
                description: 'can the section be expanded and collapsed',
                group      : 'Behavior',
                example    : 'true'
            },
            filter: {
                default    : false,
                type       : 'Boolean',
                description: 'the section is used for filter criterias',
                group      : 'Behavior',
                example    : 'true'
            },
            attached : {
                default    : '',
                type       : 'string',
                description: 'tells the system if the section is attached to another element',
                group      : 'Behavior',
                example    : 'top | bottom | both'
            },
            collapse : {
                default    : false,
                type       : 'Boolean',
                description: 'should the accordion be collapsed',
                group      : 'Behavior',
                example    : 'true'
            },
            center   : {
                default    : 'false',
                type       : 'Boolean',
                description: 'Should the content be centerd',
                group      : 'Behavior',
                example    : 'true'
            },
            type     : {
                default    : 'outlined',
                type       : 'string',
                description: 'which type of section',
                group      : 'Behavior',
                example    : 'elevated | filled | outlined'
            },
            theme : {
                default    : 'default',
                type       : 'string',
                description: 'which color theme is used for the  section',
                group      : 'Behavior',
                example    : 'default | teal | indigo'
            },
            elevation: {
                default    : '0',
                type       : 'number',
                description: 'the elevation level of the section',
                group      : 'Behavior',
                example    : '0 - 5'
            },
        });
    }

    propertiesAsBooleanRequested() {
        return {
            label    : 'haslabel',
            icon     : 'hasIcon',
            accordion: 'isAccordion'
        };
    }

    doApplyChildNode(child, container) {
        if ( child.tagName === 'LABEL-DEFINITION' ) {
            const legend  = this.container.querySelector('.legend');
            const children = [...child.children];

            for (let i = 0; i < children.length; i++) {
                const childElement =children[i];
                legend.appendChild(childElement);
            }
            return;
        }


        return super.doApplyChildNode(child, container);
    }

    getDefaultWidth() { return false; }

    /**
     *  routine to add all needed classes.
     *  This only can be done on the element level as it will be differ from element to element
     */
    collectClasses() {
        let classes = [];
        let propertiesValues = this.propertiesValues();

        if ( propertiesValues['collapse'] === true )  { classes.push( 'collapsed' ); }
        if ( propertiesValues['elevation'] )  { classes.push('elevation-level' + propertiesValues['elevation']); }
        if ( propertiesValues['type'] )       { classes.push('type-' + propertiesValues['type']); }
        if ( propertiesValues['theme'] )      { classes.push('theme-' + propertiesValues['theme']); }
        if ( propertiesValues['attached'] )   { classes.push('attached-' + propertiesValues['attached']); }

        if ( propertiesValues['filter'] )     { classes.push('mode-filter'); }

        return classes;
    }

    async adjustContent(container) {
        container.classList.add("aurora-section-wrapper");
    }

    get appliedTemplateName() {
        return 'section';
    }
}

AuroraSection.defineElement();
