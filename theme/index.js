export const theme = {
    bgWhite: opacity => `rgba(255,255,255, ${opacity})`,
    bgGray: opacity => `rgba(128,128,128, ${opacity})`
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

// * @ISSUE: api provides 68 languages which are statically mapped as 22/6/24
export const languageOptions = [
    { label: 'English', value: 'en' },
    { label: 'Azeri', value: 'az' },
    { label: 'Divehi, Dhivehi, Maldivian', value: 'dv' },
    { label: 'Spanish', value: 'es' },
    { label: 'Kurdish', value: 'ku' },
    { label: 'Malayalam', value: 'ml' },
    { label: 'Russian', value: 'ru' },
    { label: 'Uighur, Uyghur', value: 'ug' },
    { label: 'Urdu', value: 'ur' },
    { label: 'French', value: 'fr' },
    { label: 'Persian', value: 'fa' },
    { label: 'Tajik', value: 'tg' },
    { label: 'Japanese', value: 'ja' },
    { label: 'Indonesian', value: 'id' },
    { label: 'Italian', value: 'it' },
    { label: 'Bengali', value: 'bn' },
    { label: 'Turkish', value: 'tr' },
    { label: 'Tagalog', value: 'tl' },
    { label: 'Ukrainian', value: 'uk' },
    { label: 'Tamil', value: 'ta' },
    { label: 'Uzbek', value: 'uz' },
    { label: 'Bosnian', value: 'bs' },
    { label: 'Telugu', value: 'te' },
    { label: 'Marathi', value: 'mr' },
    { label: 'Hebrew', value: 'he' },
    { label: 'Gujarati', value: 'gu' },
    { label: 'Ganda', value: 'lg' },
    { label: 'Dutch', value: 'nl' },
    { label: 'Swahili', value: 'sw' },
    { label: 'Thai', value: 'th' },
    { label: 'Kazakh', value: 'kk' },
    { label: 'Vietnamese', value: 'vi' },
    { label: 'Albanian', value: 'sq' },
    { label: 'Amharic', value: 'am' },
    { label: 'Swedish', value: 'sv' },
    { label: 'Central Khmer', value: 'km' },
    { label: 'Malay', value: 'ms' },
    { label: 'Korean', value: 'ko' },
    { label: 'Finnish', value: 'fi' },
    { label: 'Czech', value: 'cs' },
    { label: 'Portuguese', value: 'pt' },
    { label: 'Tatar', value: 'tt' },
    { label: 'Romanian', value: 'ro' },
    { label: 'Polish', value: 'pl' },
    { label: 'Norwegian', value: 'no' },
    { label: 'Chechen', value: 'ce' },
    { label: 'Amazigh', value: 'ber' },
    { label: 'Bulgarian', value: 'bg' },
    { label: 'Sindhi', value: 'sd' },
    { label: 'Yoruba', value: 'yo' },
    { label: 'Somali', value: 'so' },
    { label: 'Maranao', value: 'mrw' },
    { label: 'Chinese', value: 'zh' },
    { label: 'Hausa', value: 'ha' },
    { label: 'Nepali', value: 'ne' },
    { label: 'Oromo', value: 'om' },
    { label: 'German', value: 'de' },
    { label: 'Sinhala, Sinhalese', value: 'si' },
    { label: 'Hindi', value: 'hi' },
    { label: 'Assamese', value: 'as' },
    { label: 'Pashto', value: 'ps' },
    { label: 'Dari', value: 'prs' },
    { label: 'Bambara', value: 'bm' },
    { label: 'Kannada', value: 'kn' },
    { label: 'Romanian', value: 'ro' },
    { label: 'Yau, Yuw', value: 'yuw' },
    { label: 'Kinyarwanda', value: 'rw' },
    { label: 'Divehi', value: 'dv' }
];


export const languageMap = {
    'English': 'en',
    'Azeri': 'az',
    'Divehi, Dhivehi, Maldivian': 'dv',
    'Spanish': 'es',
    'Kurdish': 'ku',
    'Malayalam': 'ml',
    'Russian': 'ru',
    'Uighur, Uyghur': 'ug',
    'Urdu': 'ur',
    'French': 'fr',
    'Persian': 'fa',
    'Tajik': 'tg',
    'Japanese': 'ja',
    'Indonesian': 'id',
    'Italian': 'it',
    'Bengali': 'bn',
    'Turkish': 'tr',
    'Tagalog': 'tl',
    'Ukrainian': 'uk',
    'Tamil': 'ta',
    'Uzbek': 'uz',
    'Bosnian': 'bs',
    'Telugu': 'te',
    'Marathi': 'mr',
    'Hebrew': 'he',
    'Gujarati': 'gu',
    'Ganda': 'lg',
    'Dutch': 'nl',
    'Swahili': 'sw',
    'Thai': 'th',
    'Kazakh': 'kk',
    'Vietnamese': 'vi',
    'Albanian': 'sq',
    'Amharic': 'am',
    'Swedish': 'sv',
    'Central Khmer': 'km',
    'Malay': 'ms',
    'Korean': 'ko',
    'Finnish': 'fi',
    'Czech': 'cs',
    'Portuguese': 'pt',
    'Tatar': 'tt',
    'Romanian': 'ro',
    'Polish': 'pl',
    'Norwegian': 'no',
    'Chechen': 'ce',
    'Amazigh': 'ber',
    'Bulgarian': 'bg',
    'Sindhi': 'sd',
    'Yoruba': 'yo',
    'Somali': 'so',
    'Maranao': 'mrw',
    'Chinese': 'zh',
    'Hausa': 'ha',
    'Nepali': 'ne',
    'Oromo': 'om',
    'German': 'de',
    'Sinhala, Sinhalese': 'si',
    'Hindi': 'hi',
    'Assamese': 'as',
    'Pashto': 'ps',
    'Dari': 'prs',
    'Bambara': 'bm',
    'Kannada': 'kn',
    'Yau, Yuw': 'yuw',
    'Kinyarwanda': 'rw',
    'Divehi': 'dv'
};

export const juzList = [
    { juz_number: 1, juz_name: "Alif Lam Meem" },
    { juz_number: 2, juz_name: "Sayaqool" },
    { juz_number: 3, juz_name: "Tilka 'r-Rusul" },
    { juz_number: 4, juz_name: "Lan Tana Loo" },
    { juz_number: 5, juz_name: "Wal Mohsanat" },
    { juz_number: 6, juz_name: "Ya Ayyuha 'lladhina Amanoo" },
    { juz_number: 7, juz_name: "Wa Iza Sami'u" },
    { juz_number: 8, juz_name: "Wa Lau Annana" },
    { juz_number: 9, juz_name: "Qad Aflaha" },
    { juz_number: 10, juz_name: "Wa A'lamu" },
    { juz_number: 11, juz_name: "Yatazeroon" },
    { juz_number: 12, juz_name: "Wa Mamin Da'abat" },
    { juz_number: 13, juz_name: "Wa Ma Ubarri'u" },
    { juz_number: 14, juz_name: "Rubama" },
    { juz_number: 15, juz_name: "Subhanalladhi" },
    { juz_number: 16, juz_name: "Qal Alam" },
    { juz_number: 17, juz_name: "Iqtarabat" },
    { juz_number: 18, juz_name: "Qadd Aflaha" },
    { juz_number: 19, juz_name: "Wa Qalalladhina" },
    { juz_number: 20, juz_name: "A'man Khalaqa" },
    { juz_number: 21, juz_name: "Utlu Ma Oohi" },
    { juz_number: 22, juz_name: "Wa Manyaqnut" },
    { juz_number: 23, juz_name: "Wa Mali" },
    { juz_number: 24, juz_name: "Faman Azlam" },
    { juz_number: 25, juz_name: "Ilaihi Yuraddu" },
    { juz_number: 26, juz_name: "Ha Meem" },
    { juz_number: 27, juz_name: "Qala Fama Khatbukum" },
    { juz_number: 28, juz_name: "Qad Aflaha" },
    { juz_number: 29, juz_name: "Tabarakalladhi" },
    { juz_number: 30, juz_name: "Amma Yatasa'aloon" }
  ];
  
  console.log(juzList);
  

