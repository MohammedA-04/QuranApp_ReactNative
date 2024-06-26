import axios from 'axios';
import { SettingsContext } from '../SettingsContext';
import { languageMap, languageOptions } from '../theme';

// Base URL
const BASE_URL = 'https://api.quran.com/api/v4/verses';
const randomAyah_EndPoint = `${BASE_URL}/random`;
const chapterList_EndPoint = 'https://api.quran.com/api/v4/chapters';
const juzList_EndPoint = 'https://api.quran.com/api/v4/juzs';
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
    const params = {
        translations: translation,
        language: language,
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

/* Fetch juz 1 to 30
 * schema <any>
 */
export const fetchJuzList = () => {
    return apiCall(juzList_EndPoint)
}

export const fetchJuzX = (juz_num) => {
    return apiCall(`${juzList_EndPoint}/${juz_num}`)
}

/* Fetch chapter by name
 * @param | chapter_number: number [required] (1-114)
 * @param | language: string 
 * @param | words: boolean (true includes words)
 * 
 * /verses/by_chapter/:chapter_number
*/
export const fetchChapterX = (chapter_number, language, translation) => {
    const params = {
        language: language,
        translations: translation,
        words: true,
        fields: 'text_uthmani'
    }
    const url = `${chapterX_EndPoint}/${chapter_number}`
    return apiCall(url, params)
}

export const fetchChapterXpage = (chapter_number, page, language, translation) => {
    const params = {
        language: language,
        translations: translation,
        words: true,
        fields: 'text_uthmani',
        page: page // note this increment prior to invoke; [++]
    }
    const url = `${chapterX_EndPoint}/${chapter_number}`
    return apiCall(url, params)
}




export const fetchTranslations = async (language) => {
    // @IMPORTANT: typically need to convert and api get results but currently api is not working as intended

    // 1 convert english,spanish,french TO THIS es,en,fr  
    // 2 call api using this
    // 3 before return filter data by language_name  

    console.log('passed down prop:' ,language)

    try {
        const url = `${translations_EndPoint}?language=${language}`
        const data = await apiCall(url);
        console.log(data)

        const translationsObject = {};
        const languagesAvailable = new Set(); 

        // Iterate through each property in the data object
        for (let i = 0; i < data.translations.length; i++) {

            // add non-dupe languages
            const translation = data.translations[i];
            languagesAvailable.add(translation.language_name)

            // english = 'E' + 'nglish' => 'English'
            let ithLanguage = translation.language_name;
            ithLanguage = ithLanguage.charAt(0).toUpperCase() + ithLanguage.slice(1)
            ithLanguage = languageMap[ithLanguage]

            if (ithLanguage === language) {
                translationsObject[translation.name] = {
                    language_name: translation.language_name,
                    id: translation.id
                };

            }
        }

        
         console.log('translations return: ', translationsObject);
         console.log('language available:', Array.from(languagesAvailable))
        

        // returns: { TCQ: {lang: en, id: 131}, ... n}    
        return translationsObject;

    } catch (e) { console.log('Error:', e) }
}