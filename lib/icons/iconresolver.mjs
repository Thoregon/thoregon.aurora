/*
 * Copyright (c) 2022.
 */


export default class IconResolver {
    constructor() {
        this.iconMap = {
            '^fa|^fas': 'resolveFontAwesomeIcon',
            '^o_'     : 'resolveMaterialOutlineIcon',
            '^img:'   : 'resolveImageIcon',
            '^'       : 'resolveMaterialIcon'
        };

        this._iconinformation   = {
            webfont     : '',   // name of the webfont if used
            source      : '',   // the source of the icon resource
            icon_name   : '',   // some icons are using names for reference ( e.g. Material )
            classes     : '',   // classes needed to render icon
            icon_html   : ''    // the HTML Text version of the icon representation
        };
    }

    resolveIcon( icon ) {
        for (const [pattern, resolvefunction] of Object.entries(this.iconMap)) {
            if (icon.match(pattern)) {
                return this[resolvefunction]( icon );
            }
        }
    }

    resolveMaterialIcon( icon ) {

        let iconinformation = {
            webfont     : 'material-icons',
            source      : 'https://fonts.googleapis.com/icon?family=Material+Icons',
            icon_name   : icon,
            classes     : 'material-icons',
            icon_html   : '<i aria-hidden="true" class="material-icons">'+ icon +'</i>'
        };

        return { ...this._iconinformation, ...iconinformation };

    }
    resolveMaterialOutlineIcon(icon, withElement) {}

    resolveFontAwesomeIcon(icon, withElement) {}

    resolveImageIcon( icon ) {
        let imgsource = icon.slice(4);
        return {
            source      : 'imgsource',
            classes     : 'image-icon',
            icon_html   : '<img src="'+ imgsource +'"  class="image-icon">'
        };
    }
}
 