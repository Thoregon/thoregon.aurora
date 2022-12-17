/**
 * built-in functions for evaluator
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import { parseI18Nsimple } from "/evolux.util/lib/formatutils.mjs";

//
// function for the intl number format
//

let NUMBERFORMAT = {};

function numberFormat( locale , options = {} ) {
    if ( NUMBERFORMAT[locale] == undefined ) {
        NUMBERFORMAT = Intl.NumberFormat( locale, options );
    }
    return NUMBERFORMAT;
}

async function formatnumber( amount, locale ) {
    if (amount != undefined)   amount   = await amount;
    if (locale != undefined)   locale   = await locale;
    const numFormat = numberFormat(locale, {});
    return numFormat.format(amount);
}
//
// function for the intl currency format
//
let CURRENCYFORMAT = {};

function currencyFormat( locale , options = {} ) {
    if ( CURRENCYFORMAT[locale] == undefined ) {
        CURRENCYFORMAT = Intl.NumberFormat( locale, options );
    }
    return CURRENCYFORMAT;
}

async function formatamount( amount, locale, currency ) {
    if (amount != undefined)   amount   = await amount;
    if (locale != undefined)   locale   = await locale;
    if (currency != undefined) currency = await currency;
    const amountFormat = currencyFormat(locale, {
        style   : "currency",
        currency: currency,
    });
    return amountFormat.format(amount);
}

//
// i18n
//

/**
 * translate a tag
 *
 * if the tag is an array, an object will be returned with the array element
 *
 * all params which are an object, the enries will be available as named params
 *
 * @param token
 * @param params
 * @returns {Promise<String>}
 */

function translate(string, params) {
    if (string == undefined) return ""; // should log?
    // translate all tokens in an array and return a mapping (object)
    if (Array.isArray(string)) {
        let results = {};
        string.forEach(item => results[item] = translate(item, params));
        return results;
    }
    if (typeof string !== 'string') return;
    const trans = app?.getTranslator() ?? ((...args) => `${args.join(',')}`);
    const { token, subkey, defaultText } = parseI18Nsimple(string);
    const replacements = params ?? {};
    let result         = subkey
                         ? trans(token, subkey, replacements)
                         : trans(token, replacements);
    if (result === token && defaultText != undefined) result = defaultText;
    return result;
}

export default {
    formatamount,
    formatnumber,
    translate
}
