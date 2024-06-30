import React, { useContext, useEffect, useState } from 'react'
import { View, Text, SafeAreaView, ScrollView, Pressable, ActivityIndicator, Modal, Image, Dimensions } from 'react-native'
import { fetchChapterList, fetchChapterX, fetchChapterXpage } from '../api/quranAPI'
import { SettingsContext } from '../SettingsContext';
import { theme } from '../theme';
import { Select } from '@mobile-reality/react-native-select-pro';
import { JuzComponent } from '../screens/components/JuzComponent'

export default function ChapterScreen() {

    const [list, setList] = useState(null);
    const [chapterContent, setChapterContent] = useState(null);
    const [chapterName, setChapterName] = useState(null);
    const [chapterID, setChapterID] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const { settings } = useContext(SettingsContext);

    // code logic 
    const getList = async () => {

        const list = await fetchChapterList();

        const chapterData = list.chapters.map(chapter => ({
            [chapter.name_simple]: chapter.id

        }))
        setList(chapterData);
        // console.log("List:\n", chapterData)
    }

    useEffect(() => {

        getList();
        console.log('settings:', settings.System.textSize)

    }, [])


    // onPress <Pressable> => render component of Uthman Script and Translation which is mapped until ...n
    const loadChapter = async (chapterId, chapterName) => {
        const ch = await fetchChapterX(chapterId, settings.Language.language, settings.Language.version);
        console.log('data: ', ch)

        setChapterContent(ch);
        setChapterName(chapterName);
        setModalVisible(true);
    };


    // onPress <Pressable> => check if current - 1 >  0
    const previousPageInChapter = async (chapterID, currentPG) => {

        if (currentPG - 1 > 0) {
            setChapterContent(null)
            currentPG = currentPG - 1;
            const ch = await fetchChapterXpage(chapterID, currentPG, settings.Language.language, settings.Language.version);
            setChapterContent(ch)

        }

    }

    // onPress <Pressable> => check if current < maxPG then change page
    const nextPageInChapter = async (chapterID, currentPG, maxPG) => {

        if (currentPG !== maxPG) {
            setChapterContent(null); // due to shows <activity indicator/>
            currentPG = currentPG + 1;
            const ch = await fetchChapterXpage(chapterID, currentPG, settings.Language.language, settings.Language.version);
            setChapterContent(ch);
        }
    };

    const getTranslation = (verse) => {

        // check possible null entry
        console.log('verse', verse)


        /**
         * if: translations, language, version not null
         *      if: verse.translations[0].text not null
         *          return verse.translations[0].text
         * else if: translation
         *  return verse.words[0].translation.text
         * 
         * else: throw new Erorr
         * 
         */
        console.log(`t is: ${settings.Language.language} and v is: ${settings.Language.version}`);
        console.log(`verse.translations[0].text: ${verse.translations[0].text} `)

        if (settings.Language.translation === true && settings.Language.language !== null && settings.System.version !== null) {
            return verse.translations[0].text;

        }
        else if (settings.Language.translation === true) {
            // e.g., if condiiton fails, we want situation where toggled to true
            if (verse.words) {
                return verse.words.map(word => word.translation.text).join(' ');
            }

        }
        else if (settings.Language.translation !== true || settings.Language.language !== true || settings.System.version !== true) {
            return ''
        }
        else {
            throw new Error('Error: translations fields are empty\n$verse.translations is most likely emmpty')
        }
    }




    const getTransliteration = (verse) => {

        // this is not resourceId dependent as getChapterX loads these fields
        if (verse.words) {
            return verse.words.map(word => word.transliteration.text).join(' ');
        } else {
            throw new Error('Error: transliteration fields are empty\n$verse.transliteration is most likely empty')
        }
    }

    const listType = [
        { label: 'Chapters', value: 'Chapters' },
        { label: 'Juz', value: 'Juz' }
    ];

    // by default: we want chapters
    const [settedList, setListType] = useState(listType[0].value)

    // function: to change list type
    const handleListChange = (value) => {
        if (value) {
            setListType(value || listType[0].value);
        }
    }

    const windowWidth = Dimensions.get('window').width;
    const dropdownWidth = windowWidth * 0.9; // 80% of window width

    return (
        <View className="flex-1 bg-green-200 mx-0 my-0">
            <SafeAreaView>
                <View className="mx-2 my-2">

                    <View className="p-4 rounded-lg items-center justify-center flex-row" style={{ backgroundColor: theme.bgWhite(0.6) }}>
                        <Text>
                            <Text className="font-semibold text-lg">{settedList ? settedList : 'Chapters'}  </Text>
                            <Text className="text-xl">|</Text>
                            {/*<Text className="font-semibold text-md text-gray-500">  Chapters</Text>*/}
                        </Text>

                        <View className='ml-4 w-1/2'>
                            <Select
                            options={listType}
                            value={settedList}
                            onSelect={(item) => handleListChange(item.value)}
                            onRemove={() => handleListChange(null)}
                            styles={{  

                                // color background onclick
                                backdrop:{backgroundColor: theme.bgGray(0.4)},

                                option: {
                                    container: {
                                        paddingHorizontal: 10, paddingRight: 10, padding: 10, 
                                        width: 400, height: 50, flexWrap: 'wrap', // Allows wrapping if necessary
                                    },
                                    text: {fontWeight: 'bold',},
                                    selected :{
                                        container: { backgroundColor: theme.bgGray(0.6)},
                                        text: {color: theme.bgWhite(1)}
                                    }
                                },
                                optionText: {fontSize: 16, padding: 10,},
                                selectContainer: {width: dropdownWidth},
                                sectionHeader:{text:{fontWeight: 'bold'}}
                                
                            }}

                        />
                        </View>
                        



                    </View>


                    {/* 114 Surahs List */}
                    <ScrollView vertical>
                        <View className="mt-3 pb-32">
                            { // map $list => chapter show: surah no and name
                                settedList === 'Chapters' && list && list.map((chapter) => {

                                    const chapterName = Object.keys(chapter)[0];
                                    const chapterId = chapter[chapterName]


                                    return (
                                        <View className="p-1 rounded-md">
                                            <Pressable onPress={() => { loadChapter(chapterId, chapterName); setChapterID(chapterId) }}>
                                                <View className="p-4 flex-row items-center rounded-xl" style={{ backgroundColor: theme.bgWhite(0.6) }}>
                                                    <Text className="items-center">{chapterId}</Text>
                                                    <Text className="ml-4 font-semibold text-lg">{chapterName}</Text>
                                                </View>
                                            </Pressable>

                                        </View>
                                    )
                                })

                            }
                            {settedList === 'Juz' &&
                                <JuzComponent
                                    lang={settings.Language.language}
                                    ver={settings.Language.version}
                                    tr={settings.Language.translation}
                                    translit={settings.Language.transliteration}
                                />}
                        </View>
                    </ScrollView>

                </View>

            </SafeAreaView>


            {/* Modal for displaying chapter content */}
            <Modal
                animationType='slide'
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}
            >
                <View className="mx-4 my-4">
                    <SafeAreaView>

                        {/* header section: close and ch.name */}
                        <View className="flex-row bg-gray-200 items-center justify-between p-4 rounded-lg">
                            {/* Close button at the start */}
                            <Pressable onPress={() => setModalVisible(false)}>
                                <Image
                                    className="w-10 h-10"
                                    source={require('../assets/close.png')} />
                            </Pressable>

                            {/* Centered title */}
                            <View className="absolute left-32 transform -translate-x-1/2">
                                <Text className="font-bold text-2xl text-center">{chapterName}</Text>
                            </View>
                        </View>

                        {/* loading icon */}
                        {!chapterContent && (
                            <View>
                                <ActivityIndicator size="large" color={"gray"} />
                            </View>
                        )}

                        {/* ch content | [ayah number : surah] & script */}
                        {chapterContent && (
                            <View>
                                <ScrollView vertical>
                                    {chapterContent.verses.map((verse, i) => {


                                        // * 'ON' then render translations
                                        const translation = getTranslation(verse);
                                        const transliteration = getTransliteration(verse);


                                        // when FALSE then render border-b-2
                                        const lastIteration = i === chapterContent.verses.length - 1; // return boolean

                                        return (
                                            <View key={i} className={`mx-4 mt-8 pb-10 space-y-4 ${!lastIteration && 'border-b-2 border-black'}`}>
                                                <View className="flex-row items-center justify-center">

                                                    <View className="w-1/5 items-center justify-center">
                                                        <Text className="text-xl">{verse.verse_key}</Text>
                                                    </View>

                                                    <View className="flex-1 items-center justify-center">
                                                        <View className="whitespace-normal overflow-x-auto" style={{ alignItems: 'center' }}>
                                                            <Text className={`${settings.System.textSize !== '4xl' ? settings.System.textSize : 'text-4xl'} leading-relaxed text-wrap`}>{verse.text_uthmani}</Text>
                                                        </View>
                                                    </View>


                                                </View>

                                                {/* if toggled 'ON' then render */}
                                                {settings.Language.translation && (
                                                    <Text className='text-lg'>{translation}</Text>
                                                )}

                                                {settings.Language.transliteration && (
                                                    <Text className='text-lg'>{transliteration}</Text>
                                                )}



                                            </View>

                                        );
                                    })}

                                    {/* page info and next, prev page */}
                                    <View className="flex items-center justify-center mx-10 border-t-2 border-black pb-48">
                                        <View className="flex-row items-center space-x-2 mt-4">

                                            <View className="right-4 rounded-md bg-red-400 p-2">
                                                <Pressable onPress={() => previousPageInChapter(chapterID, chapterContent.pagination.current_page)}>
                                                    <Text className="text-white font-semibold">Prev Page</Text>
                                                </Pressable>
                                            </View>

                                            <Text className="font-medium text-xl">{chapterContent.pagination.current_page} out of {chapterContent.pagination.total_pages}</Text>

                                            <View className="left-4 rounded-md bg-lime-500 p-2">
                                                <Pressable onPress={() => nextPageInChapter(chapterID, chapterContent.pagination.current_page, chapterContent.pagination.total_pages)}>
                                                    <Text className=" text-gray-50 font-semibold">Next Page</Text>
                                                </Pressable>
                                            </View>


                                        </View>
                                    </View>


                                </ScrollView>
                            </View>
                        )}
                    </SafeAreaView>
                </View>
            </Modal>

        </View>
    )
}
