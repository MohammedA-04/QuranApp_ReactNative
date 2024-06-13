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
export const fetchRandomAyah = () => {
    const params = {
        translations: 'en.sahih',
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
 * language: string
*/
export const fetchChapterList = (language) => {
    const params = { language:  language}
    return apiCall(chapterList_EndPoint)
}

/* Fetch chapter by name
 * @param | chapter_number: number [required] (1-114)
 * @param | language: string 
 * @param | words: boolean (true includes words)
 * 
 * /verses/by_chapter/:chapter_number
*/
export const fetchChapterX = (chapter_number, language) => {
    const params = {
        language: language,
        words: true,
        fields: 'text_uthmani'
    }
    const url = `${chapterX_EndPoint}/${chapter_number}`
    return apiCall(url, params)
}

export const fetchChapterXpage = (chapter_number, page, language) => {
    const lang = convertKeyCodeToCountry(language)
    const params = {
        language: lang,
        words: true,
        fields: 'text_uthmani',
        page: page // note this increment prior to invoke; [++]
    }
    const url = `${chapterX_EndPoint}/${chapter_number}`
    return apiCall(url, params)
}


function convertKeyCodeToCountry(e){
    console.log('test', e)
    return e
}

export const fetchTranslations = async (language) => {
    // @IMPORTANT: typically need to convert and api get results but currently api is not working as intended

    // 1 convert english,spanish,french TO THIS es,en,fr  
    // 2 call api using this
    // 3 before return filter data by language_name  

    const lang = languageMap[language] // gets e.g., 'fr' for french
    console.log('log: ', lang)
   
    
    try{ const url = `${translations_EndPoint}?language=${lang}`
        const data = await apiCall(url)
        
        // returns translator if === language )
        console.log('datattt', data)
       
        // Iterate through each property in the data objectf
        const translationsObject  = {};
        for(let i=0; i < data.length; i++){
               tr.push({name: data.translations[i].name});
            }

        
        


        console.log("this", translationsObject)
        return translationsObject;
        
    }catch (e){console.log('Error:',e)}
}