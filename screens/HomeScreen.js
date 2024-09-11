import React, { useEffect, useState, useContext } from "react";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View, ActivityIndicator, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { fetchAyahByKey, fetchChapterList, fetchRandomAyah } from "../api/quranAPI"; // Ensure the path is correct
import { theme } from '../theme/index'; // Ensure the path is correct
import { SettingsContext } from '../SettingsContext';

export default function HomeScreen() {
    const [clicked, setClicked] = useState(false);
    const [randomAyah, setRandomAyah] = useState(null);
    const [translationText, setTranslationText] = useState(null);
    const [chapter, setChapter] = useState(null);

    const { settings } = useContext(SettingsContext);

    const handleGetRandomAyah = async () => {
        // Gets a random ayah
        const data = await fetchRandomAyah();

        if (data.verse) {
            setClicked(true);
            setRandomAyah(data.verse);
            //// console.log('data verse:\n', data.verse);
            //// console.log('key: ', data.verse.verse_key);

            // Fetch detailed Ayah data
            const dataByAyah = await fetchAyahByKey(data.verse.verse_key, { words: true }, settings.Language.language, settings.Language.version);
            //// console.log('data by ayah:\n', dataByAyah);

            // Log translations if present
            if (dataByAyah && dataByAyah.verse.words) {
                const translations = dataByAyah.verse.words.map(word => word.translation ? word.translation.text : null);

                if (translations.length > 1) {
                    // i[0] concatnate with rest till ... n
                    // [] = ['i0'] + add space to rest [' i1', ' i2']
                    // [ 'i0 i1 i2' ] due to join adds to a single string 
                    const concatTranslation = translations[0] + translations.slice(1).map(e => ' ' + e).join('');
                    console.log("translation: ", concatTranslation)
                    setTranslationText(concatTranslation)

                    fetchChapterMetaData(data.verse.verse_key)
                }
                else if (translations.length === 1) {
                    console.log("translation: ", translations[0])
                    setTranslationText(translations)
                }
                else {
                    throw new Error('Error: no translation provided')
                }





            } else {
                console.error("Translations not found in the response.");
            }
        } else {
            console.error("Failed to fetch random Ayah.");
        }
    };


    const fetchChapterMetaData = async (keyArg) => {

        const list = await fetchChapterList();

        const chapterData = list.chapters.map(chapter => ({
            [chapter.name_simple]: chapter.id
        }));

        let key2 = keyArg.slice(0, keyArg.indexOf(':'));
        //// console.log('key', keyArg)
        //// console.log('new key: ', key2)

        // setID(keyArg)
        //// console.log('cd:\n\n', chapterData)

        chapterData.forEach(chapter => {
            // [{.},{.},{.}] => get {ith} => get ["Al-fatihah"] out of ["Al-fatihah" : 1]
            const chapterName = Object.keys(chapter)[0]; // Get the chapter name simple

            // ... => access the value assc with key Fatihah which is 1
            const chapterID = chapter[chapterName]; // Get the chapter ID

            if (String(chapterID) === key2) {
                // If 1 matches key2 then set Fatihah as ch name
                setChapter(chapterName);
            }
        });
        //// console.log('Chapter: ', chapter)

    }

    const [effect, setEffect] = useState(false);
    useEffect(() => {

        const intialFetch = async () => {
            await handleGetRandomAyah();
            setEffect(true)
        };

        intialFetch()


    }, [])

    return (
        <View className={`flex-1 ${settings.System.darkMode ? ' bg-gray-700' : 'bg-white'}`}>
            <StatusBar style="dark" />
            <SafeAreaView className="flex-1 justify-end">

                {/* simple Quran logo and ayah button */}
                <View className='flex-row ml-4 mr-4 my-2 '>

                    <View>
                        <Image source={require('../assets/SimpleQuranLogo.png')} className='h-[70] w-[150px] p-2' resizeMode="stretch" />
                    </View>

                    <View className={`ml-2 p-2 items-center rounded-lg justify-center ${settings.System.darkMode ? 'bg-white' : 'bg-gray-500'}`} >
                        <TouchableOpacity onPress={handleGetRandomAyah}>
                            <Text className={`text-2xl text-white font-semibold ${settings.System.darkMode ? 'text-black' : 'text-white'}`}

                            >Get Random Ayah</Text>
                        </TouchableOpacity>
                    </View>
                </View>




                {!effect ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color={"gray"} />
                    </View>
                ) : null}

                {clicked && randomAyah && chapter && (
                    <View className={`flex-1 ${settings.System.darkMode ? 'bg-gray-700' : 'bg-white'}`} style={{ marginHorizontal: 8 }}>



                        {/* ayah container */}
                        <View className={`flex-1 p-4 items-center rounded-lg border-2 mb-12 ${settings.System.darkMode ? 'border-white' : 'border-black'}`} style={{ marginHorizontal: 8, marginVertical: 8 }}>
                            <ScrollView
                                className="flex-1 "
                                contentContainerStyle={{ flexGrow: 0.8 }}
                                indicatorStyle="black"
                                showsVerticalScrollIndicator={true}
                            >

                                {/* ayah metadata: title, pgno etc */}
                                <View className={`flex-row items-center`}>
                                    <Text className={`text-2xl font-semibold ${settings.System.darkMode ? 'text-white' : 'text-black'}`}>{chapter}  </Text>
                                    <View className={`border-l-2  border-spacing-2 p-1 m-2 ${settings.System.darkMode ? 'border-white' : 'border-black'} `}>
                                        <Text className={`font-xl font-semibold ml-2 ${settings.System.darkMode ? 'text-white' : 'text-black'}`}>Verse x Chapter: {randomAyah.verse_key} </Text>
                                        <Text className={` font-xl font-semibold ml-2 ${settings.System.darkMode ? 'text-white' : 'text-black'}`}>Page Number: {randomAyah.page_number} </Text>
                                        <Text className={` font-xl font-semibold ml-2 ${settings.System.darkMode ? 'text-white' : 'text-black'}`}>Juz : {randomAyah.juz_number} </Text>
                                    </View>
                                </View>

                                {/* Straight  Line */}
                                <View style={{ borderBottomWidth: 1, marginRight: 8, marginBottom: 20, marginTop: 20 }}
                                    className={`${settings.System.darkMode ? 'border-white' : 'border-black'}`} />

                                <Text className={`text-3xl font-light ${settings.System.darkMode ? 'text-white' : 'text-black'}`}
                                    style={{ lineHeight: 50 }}>{randomAyah.text_uthmani}</Text>

                                {/* Straight  Line */}
                                <View style={{ borderBottomWidth: 1, marginRight: 8, marginBottom: 20, marginTop: 20 }}
                                    className={`${settings.System.darkMode ? 'border-white' : 'border-black'}`} />

                                <Text className={`${settings.System.darkMode ? 'text-white' : 'text-black'} text-lg font-normal`}>{translationText}</Text>

                            </ScrollView>
                        </View>
                    </View>
                )}
            </SafeAreaView>
        </View>
    );
}
