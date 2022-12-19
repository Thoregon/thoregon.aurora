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


const timeZoneCityToCountryCode = {
    'Andorra'       : 'and',
    'Dubai'         : 'are',
    'Kabul'         : 'afg',
    'Tirane'        : 'alb',
    'Yerevan'       : 'arm',
    'Casey'         : 'ata',
    'Davis'         : 'ata',
    'Mawson'        : 'ata',
    'Palmer'        : 'ata',
    'Rothera'       : 'ata',
    'Troll'         : 'ata',
    'Vostok'        : 'ata',
    'Buenos_Aires'  : 'arg',
    'Cordoba'       : 'arg',
    'Salta'         : 'arg',
    'Jujuy'         : 'arg',
    'Tucuman'       : 'arg',
    'Catamarca'     : 'arg',
    'La_Rioja'      : 'arg',
    'San_Juan'      : 'arg',
    'Mendoza'       : 'arg',
    'San_Luis'      : 'arg',
    'Rio_Gallegos'  : 'arg',
    'Ushuaia'       : 'arg',
    'Pago_Pago'     : 'asm',
    'Vienna'        : 'aut',
    'Lord_Howe'     : 'aus',
    'Macquarie'     : 'aus',
    'Hobart'        : 'aus',
    'Melbourne'     : 'aus',
    'Sydney'        : 'aus',
    'Broken_Hill'   : 'aus',
    'Brisbane'      : 'aus',
    'Lindeman'      : 'aus',
    'Adelaide'      : 'aus',
    'Darwin'        : 'aus',
    'Perth'         : 'aus',
    'Eucla'         : 'aus',
    'Baku'          : 'aze',
    'Barbados'      : 'brb',
    'Dhaka'         : 'bgd',
    'Brussels'      : 'bel',
    'Sofia'         : 'bgr',
    'Bermuda'       : 'bmu',
    'Brunei'        : 'brn',
    'La_Paz'        : 'bol',
    'Noronha'       : 'bra',
    'Belem'         : 'bra',
    'Fortaleza'     : 'bra',
    'Recife'        : 'bra',
    'Araguaina'     : 'bra',
    'Maceio'        : 'bra',
    'Bahia'         : 'bra',
    'Sao_Paulo'     : 'bra',
    'Campo_Grande'  : 'bra',
    'Cuiaba'        : 'bra',
    'Santarem'      : 'bra',
    'Porto_Velho'   : 'bra',
    'Boa_Vista'     : 'bra',
    'Manaus'        : 'bra',
    'Eirunepe'      : 'bra',
    'Rio_Branco'    : 'bra',
    'Thimphu'       : 'btn',
    'Minsk'         : 'blr',
    'Belize'        : 'blz',
    'St_Johns'      : 'can',
    'Halifax'       : 'can',
    'Glace_Bay'     : 'can',
    'Moncton'       : 'can',
    'Goose_Bay'     : 'can',
    'Toronto'       : 'can',
    'Nipigon'       : 'can',
    'Thunder_Bay'   : 'can',
    'Iqaluit'       : 'can',
    'Pangnirtung'   : 'can',
    'Winnipeg'      : 'can',
    'Rainy_River'   : 'can',
    'Resolute'      : 'can',
    'Rankin_Inlet'  : 'can',
    'Regina'        : 'can',
    'Swift_Current' : 'can',
    'Edmonton'      : 'can',
    'Cambridge_Bay' : 'can',
    'Yellowknife'   : 'can',
    'Inuvik'        : 'can',
    'Dawson_Creek'  : 'can',
    'Fort_Nelson'   : 'can',
    'Whitehorse'    : 'can',
    'Dawson'        : 'can',
    'Vancouver'     : 'can',
    'Cocos'         : 'cck',
    'Zurich'        : 'che',
    'Abidjan'       : 'civ',
    'Rarotonga'     : 'cok',
    'Santiago'      : 'chl',
    'Punta_Arenas'  : 'chl',
    'Easter'        : 'chl',
    'Shanghai'      : 'chn',
    'Urumqi'        : 'chn',
    'Bogota'        : 'col',
    'Costa_Rica'    : 'cri',
    'Havana'        : 'cub',
    'Cape_Verde'    : 'cpv',
    'Christmas'     : 'cxr',
    'Nicosia'       : 'cyp',
    'Famagusta'     : 'cyp',
    'Prague'        : 'cze',
    'Berlin'        : 'deu',
    'Copenhagen'    : 'dnk',
    'Santo_Domingo' : 'dom',
    'Algiers'       : 'dza',
    'Guayaquil'     : 'ecu',
    'Galapagos'     : 'ecu',
    'Tallinn'       : 'est',
    'Cairo'         : 'egy',
    'El_Aaiun'      : 'esh',
    'Madrid'        : 'esp',
    'Ceuta'         : 'esp',
    'Canary'        : 'esp',
    'Helsinki'      : 'fin',
    'Fiji'          : 'fji',
    'Stanley'       : 'flk',
    'Chuuk'         : 'fsm',
    'Pohnpei'       : 'fsm',
    'Kosrae'        : 'fsm',
    'Faroe'         : 'fro',
    'Paris'         : 'fra',
    'London'        : 'gbr',
    'Tbilisi'       : 'geo',
    'Cayenne'       : 'guf',
    'Gibraltar'     : 'gib',
    'Nuuk'          : 'grl',
    'Danmarkshavn'  : 'grl',
    'Scoresbysund'  : 'grl',
    'Thule'         : 'grl',
    'Athens'        : 'grc',
    'South_Georgia' : 'sgs',
    'Guatemala'     : 'gtm',
    'Guam'          : 'gum',
    'Bissau'        : 'gnb',
    'Guyana'        : 'guy',
    'Hong_Kong'     : 'hkg',
    'Tegucigalpa'   : 'hnd',
    'Port-au-Prince': 'hti',
    'Budapest'      : 'hun',
    'Jakarta'       : 'idn',
    'Pontianak'     : 'idn',
    'Makassar'      : 'idn',
    'Jayapura'      : 'idn',
    'Dublin'        : 'irl',
    'Jerusalem'     : 'isr',
    'Kolkata'       : 'ind',
    'Calcutta'      : 'ind',
    'Chagos'        : 'iot',
    'Baghdad'       : 'irq',
    'Tehran'        : 'irn',
    'Reykjavik'     : 'isl',
    'Rome'          : 'ita',
    'Jamaica'       : 'jam',
    'Amman'         : 'jor',
    'Tokyo'         : 'jpn',
    'Nairobi'       : 'ken',
    'Bishkek'       : 'kgz',
    'Tarawa'        : 'kir',
    'Kanton'        : 'kir',
    'Kiritimati'    : 'kir',
    'Pyongyang'     : 'prk',
    'Seoul'         : 'kor',
    'Almaty'        : 'kaz',
    'Qyzylorda'     : 'kaz',
    'Qostanay'      : 'kaz',
    'Aqtobe'        : 'kaz',
    'Aqtau'         : 'kaz',
    'Atyrau'        : 'kaz',
    'Oral'          : 'kaz',
    'Beirut'        : 'lbn',
    'Colombo'       : 'lka',
    'Monrovia'      : 'lbr',
    'Vilnius'       : 'ltu',
    'Luxembourg'    : 'lux',
    'Riga'          : 'lva',
    'Tripoli'       : 'lby',
    'Casablanca'    : 'mar',
    'Monaco'        : 'mco',
    'Chisinau'      : 'mda',
    'Majuro'        : 'mhl',
    'Kwajalein'     : 'mhl',
    'Yangon'        : 'mmr',
    'Ulaanbaatar'   : 'mng',
    'Hovd'          : 'mng',
    'Choibalsan'    : 'mng',
    'Macau'         : 'mac',
    'Martinique'    : 'mtq',
    'Malta'         : 'mlt',
    'Mauritius'     : 'mus',
    'Maldives'      : 'mdv',
    'Mexico_City'   : 'mex',
    'Cancun'        : 'mex',
    'Merida'        : 'mex',
    'Monterrey'     : 'mex',
    'Matamoros'     : 'mex',
    'Mazatlan'      : 'mex',
    'Chihuahua'     : 'mex',
    'Ojinaga'       : 'mex',
    'Hermosillo'    : 'mex',
    'Tijuana'       : 'mex',
    'Bahia_Banderas': 'mex',
    'Kuala_Lumpur'  : 'mys',
    'Kuching'       : 'mys',
    'Maputo'        : 'moz',
    'Windhoek'      : 'nam',
    'Noumea'        : 'ncl',
    'Norfolk'       : 'nfk',
    'Lagos'         : 'nga',
    'Managua'       : 'nic',
    'Amsterdam'     : 'nld',
    'Oslo'          : 'nor',
    'Kathmandu'     : 'npl',
    'Nauru'         : 'nru',
    'Niue'          : 'niu',
    'Auckland'      : 'nzl',
    'Chatham'       : 'nzl',
    'Panama'        : 'pan',
    'Lima'          : 'per',
    'Tahiti'        : 'pyf',
    'Marquesas'     : 'pyf',
    'Gambier'       : 'pyf',
    'Port_Moresby'  : 'png',
    'Bougainville'  : 'png',
    'Manila'        : 'phl',
    'Karachi'       : 'pak',
    'Warsaw'        : 'pol',
    'Miquelon'      : 'spm',
    'Pitcairn'      : 'pcn',
    'Puerto_Rico'   : 'pri',
    'Gaza'          : 'pse',
    'Hebron'        : 'pse',
    'Lisbon'        : 'prt',
    'Madeira'       : 'prt',
    'Azores'        : 'prt',
    'Palau'         : 'plw',
    'Asuncion'      : 'pry',
    'Qatar'         : 'qat',
    'Reunion'       : 'reu',
    'Bucharest'     : 'rou',
    'Belgrade'      : 'srb',
    'Kaliningrad'   : 'rus',
    'Moscow'        : 'rus',
    'Simferopol'    : 'rus',
    'Kirov'         : 'rus',
    'Volgograd'     : 'rus',
    'Astrakhan'     : 'rus',
    'Saratov'       : 'rus',
    'Ulyanovsk'     : 'rus',
    'Samara'        : 'rus',
    'Yekaterinburg' : 'rus',
    'Omsk'          : 'rus',
    'Novosibirsk'   : 'rus',
    'Barnaul'       : 'rus',
    'Tomsk'         : 'rus',
    'Novokuznetsk'  : 'rus',
    'Krasnoyarsk'   : 'rus',
    'Irkutsk'       : 'rus',
    'Chita'         : 'rus',
    'Yakutsk'       : 'rus',
    'Khandyga'      : 'rus',
    'Vladivostok'   : 'rus',
    'Ust-Nera'      : 'rus',
    'Magadan'       : 'rus',
    'Sakhalin'      : 'rus',
    'Srednekolymsk' : 'rus',
    'Kamchatka'     : 'rus',
    'Anadyr'        : 'rus',
    'Riyadh'        : 'sau',
    'Guadalcanal'   : 'slb',
    'Mahe'          : 'syc',
    'Khartoum'      : 'sdn',
    'Stockholm'     : 'swe',
    'Singapore'     : 'sgp',
    'Paramaribo'    : 'sur',
    'Juba'          : 'ssd',
    'Sao_Tome'      : 'stp',
    'El_Salvador'   : 'slv',
    'Damascus'      : 'syr',
    'Grand_Turk'    : 'tca',
    'Ndjamena'      : 'tcd',
    'Kerguelen'     : 'atf',
    'Bangkok'       : 'tha',
    'Dushanbe'      : 'tjk',
    'Fakaofo'       : 'tkl',
    'Dili'          : 'tls',
    'Ashgabat'      : 'tkm',
    'Tunis'         : 'tun',
    'Tongatapu'     : 'ton',
    'Istanbul'      : 'tur',
    'Funafuti'      : 'tuv',
    'Taipei'        : 'twn',
    'Kiev'          : 'ukr',
    'Uzhgorod'      : 'ukr',
    'Zaporozhye'    : 'ukr',
    'Wake'          : 'umi',
    'New_York'      : 'usa',
    'Detroit'       : 'usa',
    'Louisville'    : 'usa',
    'Monticello'    : 'usa',
    'Indianapolis'  : 'usa',
    'Vincennes'     : 'usa',
    'Winamac'       : 'usa',
    'Marengo'       : 'usa',
    'Petersburg'    : 'usa',
    'Vevay'         : 'usa',
    'Chicago'       : 'usa',
    'Tell_City'     : 'usa',
    'Knox'          : 'usa',
    'Menominee'     : 'usa',
    'Center'        : 'usa',
    'New_Salem'     : 'usa',
    'Beulah'        : 'usa',
    'Denver'        : 'usa',
    'Boise'         : 'usa',
    'Phoenix'       : 'usa',
    'Los_Angeles'   : 'usa',
    'Anchorage'     : 'usa',
    'Juneau'        : 'usa',
    'Sitka'         : 'usa',
    'Metlakatla'    : 'usa',
    'Yakutat'       : 'usa',
    'Nome'          : 'usa',
    'Adak'          : 'usa',
    'Honolulu'      : 'usa',
    'Montevideo'    : 'ury',
    'Samarkand'     : 'uzb',
    'Tashkent'      : 'uzb',
    'Caracas'       : 'ven',
    'Ho_Chi_Minh'   : 'vnm',
    'Efate'         : 'vut',
    'Wallis'        : 'wlf',
    'Apia'          : 'wsm',
    'Johannesburg'  : 'zaf',
    'Antigua'       : 'atg',
    'Anguilla'      : 'aia',
    'Luanda'        : 'ago',
    'McMurdo'       : 'ata',
    'DumontDUrville': 'ata',
    'Syowa'         : 'ata',
    'Aruba'         : 'abw',
    'Mariehamn'     : 'ala',
    'Sarajevo'      : 'bih',
    'Ouagadougou'   : 'bfa',
    'Bahrain'       : 'bhr',
    'Bujumbura'     : 'bdi',
    'Porto-Novo'    : 'ben',
    'St_Barthelemy' : 'blm',
    'Kralendijk'    : 'bes',
    'Nassau'        : 'bhs',
    'Gaborone'      : 'bwa',
    'Blanc-Sablon'  : 'can',
    'Atikokan'      : 'can',
    'Creston'       : 'can',
    'Kinshasa'      : 'cod',
    'Lubumbashi'    : 'cod',
    'Bangui'        : 'caf',
    'Brazzaville'   : 'cod',
    'Douala'        : 'cmr',
    'Curacao'       : 'cuw',
    'Busingen'      : 'deu',
    'Djibouti'      : 'dji',
    'Dominica'      : 'dma',
    'Asmara'        : 'eri',
    'Addis_Ababa'   : 'eth',
    'Libreville'    : 'gab',
    'Grenada'       : 'grd',
    'Guernsey'      : 'ggy',
    'Accra'         : 'gha',
    'Banjul'        : 'gmb',
    'Conakry'       : 'gin',
    'Guadeloupe'    : 'glp',
    'Malabo'        : 'gnq',
    'Zagreb'        : 'hrv',
    'Isle_of_Man'   : 'imn',
    'Jersey'        : 'jey',
    'Phnom_Penh'    : 'khm',
    'Comoro'        : 'com',
    'St_Kitts'      : 'kna',
    'Kuwait'        : 'kwt',
    'Cayman'        : 'cym',
    'Vientiane'     : 'loa',
    'St_Lucia'      : 'lca',
    'Vaduz'         : 'lie',
    'Maseru'        : 'lso',
    'Podgorica'     : 'mne',
    'Marigot'       : 'maf',
    'Antananarivo'  : 'mdg',
    'Skopje'        : 'mkd',
    'Bamako'        : 'mli',
    'Saipan'        : 'mnp',
    'Nouakchott'    : 'mrt',
    'Montserrat'    : 'msr',
    'Blantyre'      : 'mwi',
    'Niamey'        : 'ner',
    'Muscat'        : 'omn',
    'Kigali'        : 'rwa',
    'St_Helena'     : 'shn',
    'Ljubljana'     : 'svn',
    'Longyearbyen'  : 'sjm',
    'Bratislava'    : 'svk',
    'Freetown'      : 'sle',
    'San_Marino'    : 'smr',
    'Dakar'         : 'sen',
    'Mogadishu'     : 'som',
    'Lower_Princes' : 'sxm',
    'Mbabane'       : 'swz',
    'Lome'          : 'tgo',
    'Port_of_Spain' : 'tto',
    'Dar_es_Salaam' : 'tza',
    'Kampala'       : 'uga',
    'Midway'        : 'umi',
    'Vatican'       : 'vat',
    'St_Vincent'    : 'vct',
    'Tortola'       : 'vgb',
    'St_Thomas'     : 'vir',
    'Aden'          : 'yem',
    'Mayotte'       : 'myt',
    'Lusaka'        : 'zmb',
    'Harare'        : 'zwe'
};

export default class Countries {

    constructor(props) {
        this.cache = {};
    }

    async initialize() {
        this.data = JSON.parse( await thoregon.source("thoregon.aurora/lib/countries/countries.json") );
    }

    getIntlData() {
        let userRegion, userCity, userCountry, userTimeZone;
        if ( Intl ) {
            let tzArr = (userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone).split("/");
            userRegion  = tzArr[0];
            userCity    = tzArr[tzArr.length - 1];
            userCountry = timeZoneCityToCountryCode[userCity];
        } else {
            userRegion   = "N/A";
            userCity     = "N/A";
            userCountry  = "N/A";
            userTimeZone = "N/A";
        }

        return {
            region: userRegion,
            city: userCity,
            countryCode: userCountry,
            timeZone: userTimeZone,
            languageShort: window.navigator.language.substring(0,2),
            language: window.navigator.language,
        };
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

        if  ( this.cache[key] ) { return this.cache[key]; }

        const countries = this.getAllCountries( alpha, language );
        countries.sort( ( a, b ) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return  1;
                return 0;
            });

        let options = '';
        let numberOfCountries = countries.length;
        for (let i = 0; i < numberOfCountries; i++) {
            options += '<option value="'+ countries[i].code +'">';
            options += countries[i].name;
            options += '</option>';
        }
        this.cache[key] = options;
        return options;
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
 