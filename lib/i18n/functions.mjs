/*
 * Copyright (c) 2022.
 */

/*
 *
 * @author: Martin Neitz
 */

export function i18n( defaultText, token = "", replacements = {} ) {
    return "<span aurora-i18n='" + token + JSON.stringify( replacements ) + "'>" + defaultText + "</span>";
}