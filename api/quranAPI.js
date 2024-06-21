import axios from 'axios';
import { SettingsContext } from '../SettingsContext';
import { languageMap } from '../theme';

// Base URL
const BASE_URL = 'https://api.quran.com/api/v4/verses';
const randomAyah_EndPoint = `${BASE_URL}/random`;
const chapterList_EndPoint = 'https://api.quran.com/api/v4/chapters';
const chapterX_EndPoint = 'https://api.quran.com/api/v4/verses/by_chapter';
const translations_EndPoint = 'https://api.quran.com/api/v4/resources/translations';


// not sure about this endpoint check later
const ayahByKey_EndPoint = (verse_key) => `${BASE_URL}/by_key/${verse_key}`;


// General API call function
const apiCall = async (url, params = {}) => {
    const config = {
        method: 'GET',
        url,
        params,
        headers: {
            'Accept': 'application/json'
        },
        maxBodyLength: Infinity
    };

    try {
        const response = await axios.request(config);
        return response.data;
    } catch (e) {
        console.error('Error:', e);
        return null;
    }
};

// Fetch random Ayah with detailed fields
export const fetchRandomAyah = (language, translation) => {
    const lang = convertKeyCodeToCountry(language)
    const params = {
        translations: translation,
        language: lang,
        fields: 'text_uthmani,text_uthmani_simple,text_imlaei,text_indopak,words',
        words: 'true'

    };
    return apiCall(randomAyah_EndPoint, params);
};

// Fetch Ayah by key with detailed fields
export const fetchAyahByKey = (verse_key, additionalParams = {}) => {
    const params = {
        ...additionalParams,
        fields: 'text_uthmani,text_uthmani_simple,text_imlaei,text_indopak,words',
        translations: 'en.sahih',
        words: 'true'
    };
    // e.g., {BASE_URL}/by_key/{verse_key}
    const url = ayahByKey_EndPoint(verse_key);
    return apiCall(url, params);
};

/* Fetch list chapters 
 * language: string  [default: en]
*/
export const fetchChapterList = () => {
    return apiCall(chapterList_EndPoint)
}

/* Fetch chapter by name
 * @param | chapter_number: number [required] (1-114)
 * @param | language: string 
 * @param | words: boolean (true includes words)
 * 
 * /verses/by_chapter/:chapter_number
*/
export const fetchChapterX = (chapter_number, language, translation) => {
    const lang = convertKeyCodeToCountry(language)
    const params = {
        language: lang,
        translations: translation,
        words: true,
        fields: 'text_uthmani'
    }
    const url = `${chapterX_EndPoint}/${chapter_number}`
    return apiCall(url, params)
}

export const fetchChapterXpage = (chapter_number, page, language, translation) => {
    const lang = convertKeyCodeToCountry(language)
    const params = {
        language: lang,
        translations: translation,
        words: true,
        fields: 'text_uthmani',
        page: page // note this increment prior to invoke; [++]
    }
    const url = `${chapterX_EndPoint}/${chapter_number}`
    return apiCall(url, params)
}


function convertKeyCodeToCountry(e) {
    const lang = languageMap[e]
    return lang
}

export const fetchTranslations = async (language) => {
    // @IMPORTANT: typically need to convert and api get results but currently api is not working as intended

    // 1 convert english,spanish,french TO THIS es,en,fr  
    // 2 call api using this
    // 3 before return filter data by language_name  

    const lang = languageMap[language] // gets e.g., 'fr' for french
    console.log('log: ', lang)


    // Issue we have language and select it but cannot seem to push into object

    try {
        const url = `${translations_EndPoint}?language=${lang}`
        const data = await apiCall(url);

        const translationsObject = {};
        const languagesAvailable = new Set();

        const mySet = new Set();
mySet.add('element1');
mySet.add('element2');

        // Iterate through each property in the data object
        for (let i = 0; i < data.translations.length; i++) {

            // add non-dupe languages
            const translation = data.translations[i];
            languagesAvailable.add(translation.language_name)

            // populate object if language match 
            if (translation.language_name === lang) {
                translationsObject[translation.name] = {
                    language_name: translation.language_name,
                    id: translation.id
                };

            }
        }

        
        /// console.log('translations return: ', translationsObject);
        let v = Object.values(languagesAvailable);

// Print each language
console.log('Languages Available:');
v.forEach(language => {
    console.log(language);
});

        // returns: { TCQ: {lang: en, id: 131}, ... n}    
        return translationsObject;

    } catch (e) { console.log('Error:', e) }
}