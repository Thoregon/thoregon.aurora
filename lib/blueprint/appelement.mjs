/**
 * a placeholder for a whole app
 *
 * @author: Bernhard Lukassen
 */

import AuroraElement        from "../auroraelement.mjs";

export default class AppElement extends AuroraElement {
    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-app';
    }

    /**
     * connect to the viewmodel. add all listeners
     * @param viewmodel
     */
    connectViewModel(viewmodel) {
        viewmodel.addEventListener('app', (event) => this.appChanged(event.detail));
    }

    appChanged(app) {
        console.log('## Aurora App', 'app changed', app);
        this.showApp(app);
    }

    static get observedAttributes() {
        return ['app'];
    }

    get app() {
        return this.getAttribute('app');
    }

    set app(app) {
        this.setAttribute('app', app);
    }

    applyContent(container) {
        // get the app from the universe and display it
        let app = this.app;
        if (app) this.showApp(app);
    }

    async showApp(app) {
        this.appcontroller = await universe.deferredProperty(app);      // todo [REFACTOR]: switch to new deferred (once) api when implemented
        universe.logger.info(`## Aurora App '${app}'`);
        await this.appcontroller.connectUI(this);
    }

    async use(uicomponents) {

    }
}

// register as custom element
AppElement.defineElement();
