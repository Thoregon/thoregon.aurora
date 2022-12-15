/*
 * Copyright (c) 2022.
 */

/*
 *
 * @author: Martin Neitz
 * https://stefangabos.github.io/world_countries/
 */

/**
 *  LOG
 *  countries.json updated 15.Dez.2022
 */


export default class Countries {

    constructor(props) {
        this.cache = {};
    }

    async initialize() {
        this.data = JSON.parse( await thoregon.source("thoregon.aurora/lib/countries/countries.json") );
    }

    getCountry( code, language ) {

        code     = code.toLowerCase();
        language = language.toLowerCase();

        const alpha = (code.length == 2)
                      ? 'alpha2'
                      : 'alpha3';

        const country = this.data.find( (country ) => {
            return country[alpha] == code;
        });

        if ( country ) { return country[language]; }
        return;
    }

    getAllCountriesAsOptions( alpha, language ) {
        const key = 'options-' + alpha + '-' + language;

        if  ( this.cache.key ) { return this.cache.key; }

    }

    getAllCountries( alpha, language ) {

        alpha    = alpha.toLowerCase();
        language = language.toLowerCase();

        if ( false  ) {}

        let countries = [];
        let data = this.data;
        let numberOfCountries = this.data.length;

        for (let i = 0; i < numberOfCountries; i++) {
            countries.push( { code: data[i][alpha], name: data[i][language], })
        }

        return countries;
    }

}
 