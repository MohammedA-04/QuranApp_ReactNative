import React, { useState } from "react";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { fetchAyahByKey, fetchChapterList, fetchRandomAyah } from "../api/quranAPI"; // Ensure the path is correct
import { theme } from '../theme/index'; // Ensure the path is correct

export default function HomeScreen() {
    const [clicked, setClicked] = useState(false);
    const [randomAyah, setRandomAyah] = useState(null);
    const [translationText, setTranslationText] = useState(null);
    const [chapter, setChapter]= useState(null);

    const handleGetRandomAyah = async () => {
        // Gets a random ayah
        const data = await fetchRandomAyah();

    if (data.verse) {
        setClicked(true);
        setRandomAyah(data.verse);
        console.log('data verse:\n', data.verse);
        console.log('key: ', data.verse.verse_key);

        // Fetch detailed Ayah data
        const dataByAyah = await fetchAyahByKey(data.verse.verse_key, { words: true });
        console.log('data by ayah:\n', dataByAyah);

        // Log translations if present
        if (dataByAyah && dataByAyah.verse.words) {
            const translations = dataByAyah.verse.words.map(word => word.translation ? word.translation.text : null);
            
            if (translations.length > 1){
                // i[0] concatnate with rest till ... n
                // [] = ['i0'] + add space to rest [' i1', ' i2']
                // [ 'i0 i1 i2' ] due to join adds to a single string 
                const concatTranslation = translations[0] + translations.slice(1).map(e => ' ' +e).join('');
                console.log("translation: ", concatTranslation)
                setTranslationText(concatTranslation)

                fetchChapterMetaData(data.verse.verse_key)
            }
            else if(translations.length === 1){  
                console.log("translation: ", translations[0])
                setTranslationText(translations)
            } 
            else{
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
        console.log('key', keyArg)
        console.log('new key: ' ,key2)

        // setID(keyArg)
        console.log('cd:\n\n',chapterData)
        
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
        console.log('Chapter: ', chapter)

    }

    return (
        <View className="flex-1">
            <StatusBar style="dark" />
            <SafeAreaView className="flex-1">

                <View className="items-center p-4 rounded-lg mx-4 my-4 bg-gray-500" >
                    <TouchableOpacity onPress={handleGetRandomAyah}>
                        <Text className="text-2xl text-white font-semibold">Get Random Ayah</Text>
                    </TouchableOpacity>
                </View>

                {clicked && randomAyah && chapter && (
                    <View className="flex-1" style={{ marginHorizontal: 8 }}>

                        <View className="border-black border-2 items-center p-2 rounded-lg mx-2 my-2">
                            
                        <View className="flex-row items-center">
                            <Text className="text-2xl font-semibold">{chapter}  | </Text>
                            <View className="flex-row m-4">
                                <Text>Juz: {randomAyah.juz_number} </Text>
                                <Text>Pg no: {randomAyah.page_number} </Text>
                                <Text>Id: {randomAyah.id} </Text>
                            </View>
                        </View>
                            
                            
                        </View>

                        <View className="flex-1 border-black p-4 items-center rounded-lg border-2" style={{ marginHorizontal: 8, marginVertical: 8 }}>
                            <ScrollView
                                className="flex-1 "
                                contentContainerStyle={{ flexGrow: 1 }}
                                indicatorStyle="black"
                                showsVerticalScrollIndicator={true}
                            >
                                <Text className=" text-3xl font-light" style={{lineHeight: 50}}>{randomAyah.text_uthmani}</Text>

                                {/* Straight  Line */}
                                <View style={{ borderBottomWidth: 1, borderColor: 'black', marginRight: 8, marginBottom: 20, marginTop: 20 }} />

                                <Text className=" text-lg font-normal">{translationText}</Text>
                            
                            </ScrollView>
                        </View>
                    </View>
                )}
            </SafeAreaView>
        </View>
    );
}
