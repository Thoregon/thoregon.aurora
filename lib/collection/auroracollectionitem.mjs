/**
 * a template for each item of the collection.
 * can contain child elements or a reference to
 * a template like AuroraView.
 *
 * this element is transparent.
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import AuroraElement from "../auroraelement.mjs";

export default class AuroraCollectionItem extends AuroraElement  {


    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-collectionitem';
    }

    get templateElements() {
        return {
            theme: 'material',
            component: 'collections',
            templates: ['item'],
        }
    }

    get isCollectionItem() {
        return true;
    }

    /*
     * presentation
     */


}
