/**
 *
 *
 * ES6 port from vanilla-masker
 * - https://github.com/vanilla-masker/vanilla-masker
 * - https://vanilla-masker.mit-license.org/
 *
 * @see:
 * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/resolvedOptions
 * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#parameters
 * - https://stackoverflow.com/questions/33159354/how-do-i-find-the-decimal-separator-for-current-locale-in-javascript
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

const DIGIT                   = "9",
      ALPHA                   = "A",
      ALPHANUM                = "S",
      BY_PASS_KEYS            = [9, 16, 17, 18, 36, 37, 38, 39, 40, 91, 92, 93];

function isAllowedKeyCode(keyCode) {
    return !BY_PASS_KEYS.includes(keyCode);
}

function mergeMoneyOptions(opts) {
    opts                = opts ?? {};
    opts                = {
        delimiter : opts.delimiter ?? ".",
        lastOutput: opts.lastOutput,
        precision : opts.precision ?? 2,
        separator : opts.separator || ",",
        showSignal: opts.showSignal,
        suffixUnit: opts.suffixUnit && (" " + opts.suffixUnit.replace(/[\s]/g, '')) || "",
        unit      : opts.unit && (opts.unit.replace(/[\s]/g, '') + " ") || "",
        zeroCents : opts.zeroCents
    };
    opts.moneyPrecision = opts.zeroCents ? 0 : opts.precision;
    return opts;
}

function addPlaceholdersToOutput(output, index, placeholder) {
    for (; index < output.length; index++) {
        if (output[index] === DIGIT || output[index] === ALPHA || output[index] === ALPHANUM) {
            output[index] = placeholder;
        }
    }
    return output;
}

export default class Masker {

    constructor(elements) {
        this.elements = Array.isArray(elements)
                        ? [...elements]
                        : [elements];
    }

    //
    // bind methods
    //

    unbindElementToMask() {
        this.elements.forEach((element) => {
            element.lastOutput = "";
            element.onkeyup    = false;
            element.onkeydown  = false;
            if (element.value.length) {
                element.value = element.value.replace(/\D/g, '');
            }
        })
    }

    bindElementToMask(maskFunction) {
        let onType = (e) => {
            let source = e.target;

            if (isAllowedKeyCode(e.keyCode)) {
                setTimeout(() => {
                    this.opts.lastOutput = source.lastOutput;
                    source.value         = Masker[maskFunction](source.value, this.opts);
                    source.lastOutput    = source.value;
                    if (source.setSelectionRange && this.opts.suffixUnit) {
                        source.setSelectionRange(source.value.length, (source.value.length - this.opts.suffixUnit.length));
                    }
                }, 0);
            }
        }

        this.elements.forEach((element) => {
            element.lastOutput = "";
            element.onkeyup    = onType;
            if (element.value.length) {
                element.value = Masker[maskFunction](element.value, this.opts);
            }
        })
    }

    //
    // convenience mask methods
    //

    maskMoney(opts) {
        this.opts = mergeMoneyOptions(opts);
        this.bindElementToMask("toMoney");
    }

    maskNumber() {
        this.opts = {};
        this.bindElementToMask("toNumber");
    }

    maskAlphaNum() {
        this.opts = {};
        this.bindElementToMask("toAlphaNumeric");
    }

    maskPattern(pattern) {
        this.opts = { pattern };
        this.bindElementToMask("toPattern");
    }

    unMask() {
        this.unbindElementToMask();
    }

    //
    // static formatting methods
    //

    static toNumber(value) {
        return value.toString().replace(/(?!^-)[^0-9]/g, "");
    }

    static toAlphaNumeric(value) {
        return value.toString().replace(/[^a-z0-9 ]+/i, "");
    }

    static toMoney(value, opts) {
        opts = mergeMoneyOptions(opts);
        if (opts.zeroCents) {
            opts.lastOutput     = opts.lastOutput || "";
            let zeroMatcher     = ("(" + opts.separator + "[0]{0," + opts.precision + "})"),
                zeroRegExp      = new RegExp(zeroMatcher, "g"),
                digitsLength    = value.toString().replace(/[\D]/g, "").length || 0,
                lastDigitLength = opts.lastOutput.toString().replace(/[\D]/g, "").length || 0
            ;
            value               = value.toString().replace(zeroRegExp, "");
            if (digitsLength < lastDigitLength) {
                value = value.slice(0, value.length - 1);
            }
        }

        let number         = value.toString();
        // if separator is in string, make sure we zero-pad to respect it
        let separatorIndex = number.indexOf(opts.separator),
            missingZeros   = (opts.precision - (number.length - separatorIndex - 1));

        if (separatorIndex !== -1 && (missingZeros > 0)) {
            number = number + ('0' * missingZeros);
        }

        number = number.replace(/[\D]/g, "");

        let clearDelimiter = new RegExp("^(0|\\" + opts.delimiter + ")"),
            clearSeparator = new RegExp("(\\" + opts.separator + ")$"),
            money          = number.substr(0, number.length - opts.moneyPrecision),
            masked         = money.substr(0, money.length % 3),
            cents          = new Array(opts.precision + 1).join("0")
        ;

        money = money.substr(money.length % 3, money.length);
        for (let i = 0, len = money.length; i < len; i++) {
            if (i % 3 === 0) {
                masked += opts.delimiter;
            }
            masked += money[i];
        }
        masked     = masked.replace(clearDelimiter, "");
        masked     = masked.length ? masked : "0";
        let signal = "";
        if (opts.showSignal === true) {
            signal = value < 0 || (value.startsWith && value.startsWith('-')) ? "-" : "";
        }
        if (!opts.zeroCents) {
            let beginCents  = Math.max(0, number.length - opts.precision),
                centsValue  = number.substr(beginCents, opts.precision),
                centsLength = centsValue.length,
                centsSliced = (opts.precision > centsLength) ? opts.precision : centsLength
            ;
            cents           = (cents + centsValue).slice(-centsSliced);
        }
        let output = opts.unit + signal + masked + opts.separator + cents;
        return output.replace(clearSeparator, "") + opts.suffixUnit;
    }

    static toPattern(value, opts) {
        let pattern      = (typeof opts === 'object' ? opts.pattern : opts),
            patternChars = pattern.replace(/\W/g, ''),
            output       = pattern.split(""),
            values       = value.toString().replace(/\W/g, ""),
            charsValues  = values.replace(/\W/g, ''),
            index        = 0,
            i,
            outputLength = output.length,
            placeholder  = (typeof opts === 'object' ? opts.placeholder : undefined)
        ;

        for (i = 0; i < outputLength; i++) {
            // Reached the end of input
            if (index >= values.length) {
                if (patternChars.length == charsValues.length) {
                    return output.join("");
                } else if ((placeholder !== undefined) && (patternChars.length > charsValues.length)) {
                    return addPlaceholdersToOutput(output, i, placeholder).join("");
                } else {
                    break;
                }
            }
            // Remaining chars in input
            else {
                if ((output[i] === DIGIT && values[index].match(/[0-9]/)) ||
                    (output[i] === ALPHA && values[index].match(/[a-zA-Z]/)) ||
                    (output[i] === ALPHANUM && values[index].match(/[0-9a-zA-Z]/))) {
                    output[i] = values[index++];
                } else if (output[i] === DIGIT || output[i] === ALPHA || output[i] === ALPHANUM) {
                    if (placeholder !== undefined) {
                        return addPlaceholdersToOutput(output, i, placeholder).join("");
                    } else {
                        return output.slice(0, i).join("");
                    }
                    // exact match for a non-magic character
                } else if (output[i] === values[index]) {
                    index++;
                }

            }
        }
        return output.join("").substr(0, i);
    }
}
