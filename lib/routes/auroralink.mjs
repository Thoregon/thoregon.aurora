/**
 *
 * todo [OPEN]:
 *  - multiple links to multiple targets
 *  - e.g. view X in main content, metadata in right drawer
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import AuroraElement                             from "../auroraelement.mjs";
import { buildLink, linkProperties, selectPath } from "../util.mjs";

export default class AuroraLink extends AuroraElement {

    constructor() {
        super();
        this.inCollection = undefined;
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
    get componentConfiguration() {
        return {
            theme    : 'material',
            component: 'blueprint',
            templates: ['link', 'collectionlink', 'floating-action-icon-link'],
        }
    }

    get appliedTemplateName() {
        return this.isInCollection() ? 'collectionlink' : 'link';
    }

    isInCollection() {
        if (this.inCollection == undefined) {
            let parent = this.parentAuroraElement();
            this.inCollection = parent ? parent.isAuroraCollection : false;
        }
        return this.inCollection;
    }

    getDefaultWidth() { return '100%'; }

    get isItemDecorator() {
        return true;
    }

    decorate(item) {
        this.appendChild(item);
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

    get hasRoute() {
        return this.propertiesValues()['route'];
    }

    async trigger(event) {
        if ( this.hasCommand ) {
            let vm = this.viewModel || this.parentViewModel();
            if ( ! vm ) return;
            vm.executeCommand( this.getAttribute('command') );
        } else if ( this.hasAction ) {
            // has action? await exec, if no error (throw) follow link -> viewmodel -> west
            // wait until action was performed, pass result to router (viewmodel)
        } else {
            // get path
            let route = {
                r: this.getEntityReference(),
                t: this.getTarget(),
                v: this.selectView()
            };
            // follow route
            if (route.v) await this.uirouter.routeToHist(route, this.getAuroraAppElement());
        }
    }

    get hasCommand() {
        return this.hasAttribute('command');
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
        const target = this.getAttribute("to");
        return target;
    }

    getView() {
        const view = this.getAttribute("view");
        return view
    }

    selectView() {
        const ref = this.getView();
        const view = selectPath(ref);
        return view;
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
            command: {
                default:        '',
                type:           'class',
                description:    'class name responsible to execute the command',
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
            style: {
                default:        'floating-action-icon-link',
                type:           'string',
                description:    'which style should be used for the representation',
                group:          'Behavior',
                example:        'Reference'
            },
        });
    }

}

AuroraLink.defineElement();
