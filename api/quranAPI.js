import axios from 'axios';

// Base URL
const BASE_URL = 'https://api.quran.com/api/v4/verses';
const randomAyah_EndPoint = `${BASE_URL}/random`;
const chapterList_EndPoint = 'https://api.quran.com/api/v4/chapters'

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
export const fetchChapterList = () => {
    const params = { language: 'en' }
    return apiCall(chapterList_EndPoint)
}