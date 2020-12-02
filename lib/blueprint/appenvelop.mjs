/**
 * defines the container an Aurora App is embedded
 * displays a frame containing basic app elements
 * like indicators and main menu
 *
 * can be customized.
 *
 * if the app is embedded in another app,
 * the customization will be mixed
 *
 * @author: Bernhard Lukassen
 */

export default class AppEnvelop {

    constructor({
                    id
                } = {}) {
        Object.assign(this, { id });
    }

}
