/**
    settings for DE
  */

// check first if number-functions.js is empoley
if (Number.formatFunctions) {
    // define 'de' format
    Number.formatFunctions.regional['de'] = {
        commaSeperator: ',',
        thousandsSeparator: '.',
        numberBlockSize: 3
    }
    // use as default
    Number.formatFunctions.defaultRegion = 'de';
}