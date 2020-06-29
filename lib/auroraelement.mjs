/**
 * use this as base class for all aurora elements!
 *
 * @author: Bernhard Lukassen
 */

import { className }                from '/evolux.util';
import { UIObservingElement }       from '/evolux.ui';
import auroratemplates              from '/@auroratemplates';

let themebehaviormodules = {};

export default class AuroraElement extends UIObservingElement {

    /**
     * name of the defining element library
     * @return {string}
     */
    static get libraryId() {
        return 'aurora';
    }

    static get elementTag() {
        throw ErrNotImplemented(`static ${className(this)}.elementTag`);
    }

    // returns undefined. methods using it must handle undefined
    get templateElements() {
    }

    applyStyles() {
        let tplelem = this.templateElements;

    }

    buildElement() {
        return this.builder.newDiv();
    }

    //--- classes to add
    get templates() {
        let tplelem = this.templateElements;
        let templates = {};
        if (!tplelem) return templates;
        let tplnames = tplelem.templates;
        tplnames.forEach((name) => templates[name] = auroratemplates[tplelem.theme || 'material'][tplelem.component][name]);
        return templates;
    }

    elementStyle() {
        let tplelem = this.templateElements;
        if (!tplelem) return '';
        let css = auroratemplates[tplelem.theme || 'material'][tplelem.component][`$${tplelem.component}`];
        return css || '';
    }

    async attachBehavior() {
        let Behavior = await this.themeBehavior();
        if (!Behavior) return;
        this.behavior = new Behavior();
        this.behavior.attach(this);
    }

    async themeBehavior() {
        let tplelem = this.templateElements;
        if (!tplelem) return;
        let behaviorpath = auroratemplates[tplelem.theme || 'material'][tplelem.component][`${this.behaviorname()}`];
        let behaviorrmodule = themebehaviormodules[behaviorpath];
        if (!behaviorrmodule) {
            behaviorrmodule = await import(behaviorpath);
            themebehaviormodules[behaviorpath] = behaviorrmodule;
        }
        return behaviorrmodule.default;
    }

    behaviorname() {
        return `${className(this).toLowerCase()}.mjs`;
    }
}
