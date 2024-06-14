export const theme = {
    bgWhite: opacity => `rgba(255,255,255, ${opacity})`
}

export const textSizeOptions = [
    { label: 'Small', value: 'text-sm' },
    { label: 'Medium', value: 'text-md' },
    { label: 'Large', value: 'text-lg' },
    { label: 'Extra Large x1', value: 'text-xl' },
    { label: 'Extra Large x2', value: 'text-2xl' },
    { label: 'Extra Large x3', value: 'text-3xl' },
    { label: 'Extra Large x4', value: 'text-4xl' },
];

// * @ISSUE: api all language need to contact quran.com
export const languageOptions = [
    { label: 'english', value: 'en' },
    { label: 'french', value: 'fr' },
    { label: 'spanish', value: 'es' },
];

export const languageMap = {
    fr: 'french',
    en: 'english',
    es: 'spanish'
}
