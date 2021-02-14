/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */
import AuroraElement                 from "../auroraelement.mjs";
import { buildLink, linkProperties } from "../util.mjs";

export default class AuroraLink extends AuroraElement {

    constructor() {
        super();
        this.inCollection = false;
    }


    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-link';
    }

    /**
     * template definition
     * @return {{component: string, templates: [string], theme: string}}
     */
    get templateElements() {
        return {
            theme    : 'material',
            component: 'blueprint',
            templates: ['link', 'collectionlink'],
        }
    }

    get appliedTemplateName() {
        return this.inCollection ? 'collectionlink' : 'link';
    }

    getDefaultWidth() { return '100%'; }

    get isItemDecorator() {
        return true;
    }

    clone() {
        let elem = super.clone();
        elem.inCollection = this.inCollection;
        return elem;
    }

    /*
     * link behavior
     */


    get isTrigger() {
        return true;
    }

    async trigger(event) {
        // has action? await exec, if no error (throw) follow link -> viewmodel -> west
        console.log("aurora-link");
        if (this.hasAction) {
            // wait until action was performed, pass result to router (viewmodel)
        } else {
            // get path
            let route = {
                r: this.getEntityReference(),
                t: this.getTarget(),
                v: this.getView()};
            // follow route
            if (route.v) this.uirouter.routeTo(route);
        }
    }

    getEntityReference() {
        let ref = this.getAttribute("ref");
        if (!ref) return;
        let names = linkProperties(ref);
        let props = {};
        names.forEach(name => props[name] = this.getWestProperty(name));
        return buildLink(ref, props);
    }

    getTarget() {
        let target = this.getAttribute("to");
        return target;
    }

    getView() {
        let view = this.getAttribute("view");
        return view
    }


    getWestProperty(name) {
        return super.getWestProperty(name) || this.getInnerWestProperty(name);
    }

    getInnerViewModel() {
        return this.container.firstElementChild && this.container.firstElementChild.viewModel ? this.container.firstElementChild.viewModel : undefined;
    }

    getInnerWestProperty(name) {
        let ivm = this.getInnerViewModel();
        return ivm ? ivm.getWestProperty(name) : undefined;
    }

    /*
     * element properties
     */

    propertiesDefinitions() {
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            to: {
                default:        '',
                type:           'string',
                description:    'reference to the target, a path or aurora-name',
                group:          '',
                example:        ''
            },
            ref: {
                default:        '',
                type:           'string',
                description:    'reference to the entity',
                group:          'Content',
                example:        ''
            },
            view: {
                default:        '',
                type:           'string',
                description:    'reference to view, may be defined by the entity',
                group:          'Content',
                example:        'Reference'
            },
        });
    }

}

AuroraLink.defineElement();
