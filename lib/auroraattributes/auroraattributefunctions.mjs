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

// let NUMBERFORMAT = {};
// let DATEFORMAT   = {};

function dateFormat(locale, options) {
    return new Intl.DateTimeFormat(locale, options);
    // if (DATEFORMAT[locale] == undefined) {
    //     DATEFORMAT[locale] = new Intl.DateTimeFormat(locale, options);
    // }
    // return DATEFORMAT[locale];
}

async function formatdate(date, locale, options) {
    if (date != undefined)   date   = await number;
    if (locale != undefined)   locale   = await locale;
    options = { ...{
            year  : "numeric",
            month : "2-digit",
            day   : "2-digit",
        }, ...options
    };
    const dateFormat = dateFormat(locale, options);
    return dateFormat.format(date);
}

async function formatdatetime(date, locale, options) {
    if (date != undefined)   date   = await number;
    if (locale != undefined)   locale   = await locale;
    options = { ...{
            year  : "numeric",
            month : "2-digit",
            day   : "2-digit",
            hour  : "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        }, ...options
    };
    const dateFormat = dateFormat(locale, options);
    return dateFormat.format(date);
}

function numberFormat( locale , options = {} ) {
    return Intl.NumberFormat( locale, options );
    // if ( NUMBERFORMAT[locale] == undefined ) {
    //     NUMBERFORMAT[locale] = Intl.NumberFormat( locale, options );
    // }
    // return NUMBERFORMAT[locale];
}

async function formatnumber( number, locale ) {
    if (number != undefined)   number   = await number;
    if (locale != undefined)   locale   = await locale;
    const numFormat = numberFormat(locale, {});
    return numFormat.format(number);
}

async function formatint(number, locale) {
    options         = { maximumSignificantDigits: 3 };
    const numFormat = numberFormat(locale, {});
    return numFormat.format(number, options);
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

//
// route
//

function routeActive(...routes) {

    for (const route of routes) {
        // todo: consider path variables e.g. {id}
        const match = route.startsWith('/')
                      ? universe.uirouter.currentroute.startsWith(route)
                      : universe.uirouter.currentroute.endsWith(route);
        if (match) return true;
    }
    return false;
}

//
// exports
//


export default {
    formatamount,
    formatdate,
    formatdatetime,
    formatint,
    formatnumber,
    translate,
    routeActive,
}
