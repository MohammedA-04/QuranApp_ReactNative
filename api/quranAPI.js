import axios from 'axios';

// Base URL
const BASE_URL = 'https://api.quran.com/api/v4/verses';
const getRandomAyah_EP = `${BASE_URL}/random`;
const getAyahbyKey_EP = (verse_key) => `${BASE_URL}/by_key/${verse_key}`;

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
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};

// Fetch random Ayah with detailed fields
export const fetchRandomAyah = () => {
    const params = {
        translations: 'en',
        fields: 'text_uthmani,text_uthmani_simple,text_imlaei,text_indopak,words'
    };
    return apiCall(getRandomAyah_EP, params);
};

// Fetch Ayah by key with detailed fields
export const fetchAyahByKey = (verse_key, additionalParams = {}) => {
    const params = {
        ...additionalParams,
        fields: 'text_uthmani,text_uthmani_simple,text_imlaei,text_indopak,words'
    };
    const url = getAyahbyKey_EP(verse_key);
    return apiCall(url, params);
};
