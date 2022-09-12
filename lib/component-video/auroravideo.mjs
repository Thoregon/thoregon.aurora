
/*
 * Copyright (c) 2022.
 */

/**
 * @author: Martin Neitz
 */

import AuroraFormElement from "../formcomponents/auroraformelement.mjs";
import MediaService from "/evolux.util/lib/mediaservice.mjs";


export default class AuroraVideo extends AuroraFormElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-video';
    }

    /*
     * aurora element features
     */

    static get observedAttributes() {
        return [...super.observedAttributes, 'src'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'src' :
                this.propertiesValues()['src'] = newValue;
                const ms = MediaService.withURL(newValue);
                const embedCode = ms.getEmbedCode();
                const video = this.container.querySelector('.aurora-video');

                video.innerHTML = embedCode;
                break;
        }
        return super.attributeChangedCallback(name, oldValue, newValue);
    }


    // theme ... component... templates

    get componentConfiguration() {
        return {
            theme: 'material',
            component: 'component-video',
            templates: ['video'],
        }
    }

    propertiesDefinitions() {
        //       let parentPropertiesValues = super.propertiesValues();
        //       return Object.assign(parentPropertiesValues,
        // todo [OPEN]: allowed values as enum
        // todo [OPEN}: add attribute changed handlers
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            src: {
                default:        '',
                type:           'string',
                description:    'the url of the video source',
                group:          'Content',
                example:        'https://vimeo.com/123'
            },
        });
    }

    propertiesAsBooleanRequested() {
        //--- check if icon or image url ----
        return {};
    }

    getDefaultWidth() { return false; }

    /**
     *  routine to add all needed classes.
     *  This only can be done on the element level as it will be differ from element to element
     */
    collectClasses() {
        //--- 1: first get the classes added from the dom element
        //--- 2: analyse the transferred attributes
        let classes = super.collectClasses();
        let propertiesValues = this.propertiesValues();

        classes.push('aspect-ratio-169');

        return classes;
    }

    async adjustContent(container) {
        container.classList.add("aurora-video-wrapper");
    }

    get appliedTemplateName() {
        return 'video';
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

    async existsConnect() {
        super.existsConnect();
        this.behavior.attach(this);

    }
}

AuroraVideo.defineElement();
