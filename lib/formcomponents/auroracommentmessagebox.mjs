/**
 *
 *
 * @author: Martin Neitz
 */

import doT                      from "/dot";
import AuroraFormElement        from "./auroraformelement.mjs";

export default class AuroraCommentMessageBox extends AuroraFormElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-commentmessagebox';
    }

    /*
     * aurora element features
     */

    get isTrigger() {
        return true;
    }

    get tiggerEventName() {
        return 'send';
    }

    triggerClick(value) {
        this.emit('send', value);
    }


    // theme ... component... templates

    get templateElements() {
        return {
            theme: 'material',
            component: 'component-comment',
            templates: ['commentmessagebox'],
        }
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,

        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            label: {
                default:        '',
                type:           'string',
                description:    'Label of the Submit Button',
                group:          'content',
                example:        'Leave Comment'
            },
        });
    }

    propertiesAsBooleanRequested() {
        return {
        };
    }

    getDefaultWidth() { return false; }

    /**
     *  routine to add all needed classes.
     *  This only can be done on the element level as it will be differ from element to element
     */
    collectClasses() {
        //--- 1: first get the classes added from the dom element
        //--- 2: analyse the transferred attributes
        let classes = [];
        let propertiesValues = this.propertiesValues();

        return classes;
    }

    get appliedTemplateName() {
        return 'commentmessagebox';
    }

    async adjustContent(container) {
        container.classList.add("aurora-comment-messagebox-wrapper");
    }

    async calculatedValues() {
        return {
            'txt_action_new_comment': this.i18n('txt_action_new_comment'),
        };
    }

    use(obj, attr) {
        this.input.setAttribute('value', obj[attr]);
    }

    connectedCallback() {
        super.connectedCallback();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('click', this._clickhandler);
    }

    attachViewModel(vm) {
        super.attachViewModel(vm);
        this.behavior.elementVisibility();
    }

    /*
     * Event handlers
     */
    ownerChanged(identity) {
        this.behavior.ownerChanged(identity);
    }
}

AuroraCommentMessageBox.defineElement();
