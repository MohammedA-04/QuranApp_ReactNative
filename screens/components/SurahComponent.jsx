import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, ScrollView, Pressable, Modal, Image, ActivityIndicator, useWindowDimensions } from 'react-native'
import { fetchChapterInfo, fetchChapterList, fetchChapterX, fetchChapterXpage } from '../../api/quranAPI'
import HTML from 'react-native-render-html';
import { theme } from '../../theme/index'
import Icon from 'react-native-vector-icons/Feather';


const SurahComponent = ({ lang, ver, tr, translit, textSize }) => {

    const [list, setList] = useState(null);
    const [chapterContent, setChapterContent] = useState(null);
    const [chapterName, setChapterName] = useState(null);
    const [chapterID, setChapterID] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const [isInfoVisible, setInfoVisible] = useState(false);
    const [chapterInfo, setChapterInfo] = useState(null);

    // code logic 
    const getList = async () => {

        const list = await fetchChapterList();
        console.log('hey:', list)

        const chapterData = list.chapters.map(chapter => ({
            [chapter.name_simple]: chapter.id

        }))
        setList(chapterData);
        console.log("List:\n", chapterData)
    }

    useEffect(() => {

        getList();
        console.log('settings:', textSize)


    }, [])


    // onPress <Pressable> => render component of Uthman Script and Translation which is mapped until ...n
    const loadChapter = async (chapterId, chapterName) => {
        const ch = await fetchChapterX(chapterId, lang, ver);
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
            const ch = await fetchChapterXpage(chapterID, currentPG, lang, ver);
            setChapterContent(ch)

        }

    }

    // onPress <Pressable> => check if current < maxPG then change page
    const nextPageInChapter = async (chapterID, currentPG, maxPG) => {

        if (currentPG !== maxPG) {
            setChapterContent(null); // due to shows <activity indicator/>
            currentPG = currentPG + 1;
            const ch = await fetchChapterXpage(chapterID, currentPG, lang, ver);
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
        console.log(`t is: ${lang} and v is: ${ver}`);
        console.log(`verse.translations[0].text: ${verse} `)

        if (tr === true && lang !== null && ver !== null) {
            return verse.translations[0].text;

        }
        else if (tr === true) {
            // e.g., if condiiton fails, we want situation where toggled to true
            if (verse.words) {
                return verse.words.map(word => word.translation.text).join(' ');
            }

        }
        else if (tr !== true || lang !== true || ver !== true) {
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
            return 'No transliteration available';
        }
    }

    // returns preface informatino about surah
    const getchapterInfo = async () => {


        try {
            console.log("Fetching info for chapter:", chapterID);
            const info = await fetchChapterInfo(chapterID, lang); // api.quran.com currently only have 'en' in v4
            console.log('Chapter info:', info);
            setChapterInfo(info);
            setInfoVisible(true);
        } catch (error) {
            console.error('Error fetching chapter info:', error);
        }

        /*if (isInfoVisible === true) {
            const info = await fetchChapterInfo(chapterID);
            console.log('ch info:', info);
            setChapterInfo(info);
            setInfoVisible(false);
        } else {
            setInfoVisible(true);
        }*/

        //setInfoVisible(!isInfoVisible)
        console.log("inverted: ", isInfoVisible)

    }


    // styles && width for HTMl parser
    const {width} = useWindowDimensions()
    const styleForHTML = { 
        h1: {fontWeight: 'bold' }, 
        li: {padding: 10},
        ol: {padding: 10}
      };

    // custom component popup
    const InfoPopup = ({ isVisible, onClose, data }) => {
        if (!data) return null;

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={isVisible}
                onRequestClose={onClose}
            >
                <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: theme.bgGray(0.3) }} >
                    <View style={{ backgroundColor: 'white', padding: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30, maxHeight: '40%', }} >
                        <View style={{ width: '40%', height: 4, backgroundColor: 'gray', borderRadius: 2, alignSelf: 'center', marginBottom: 30 }} />
                        <ScrollView>
                            <View style={{ marginBottom: 20 }}>
                                 {/* Introductory Information about said Chapter */}
                                 <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
                                    {data.chapter_info.short_text}
                                    
                                </Text>

                                {/* Content provided by source regarding the Chapter ~ parsed from HTML */}
                                <HTML source={{ html: data.chapter_info.text }} tagsStyles={styleForHTML}/>


                                {/* Source providing the chapter information */}
                                <Text style={{ textAlign: 'center', fontSize: 16, marginBottom: 10 }}>
                                    <Text style={{fontWeight: 'bold'}}>Provided by</Text>
                                    <Text>: {data.chapter_info.source}</Text>
                                </Text>
                                
                                {/* className='italic text-center text-gray-600' */}
                                <Text style={{fontStyle: 'italic', textAlign: 'center', color:'gray'}}>note: chapter information are not based on translation the selected</Text>
                            </View>
                        </ScrollView>
                        <Pressable onPress={onClose} style={{ marginTop: 20, padding: 10, backgroundColor: '#ddd', borderRadius: 5 }}>
                            <Text style={{ textAlign: 'center' }}>Close</Text>
                        </Pressable>
                    </View>
                </View >
            </Modal >
        );
    };


    // surahComponent
    return (
        <View>
            {/* Surah List Section */}
            <ScrollView>
                <View className="mt-3 pb-32">
                    {list && list.map((chapter) => {
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
                    })}
                </View>

                {/* code for information popup */}
                {/* isInfoVisible && <Popup chapterInfo={chapterInfo} /> */}
            </ScrollView>

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
                                    source={require('../../assets/close.png')} />
                            </Pressable>

                            {/* Centered title */}
                            <View className="absolute left-32 transform -translate-x-1/2">
                                <Text className="font-bold text-2xl text-center">{chapterName}</Text>
                            </View>

                            <View>
                                <Pressable onPress={() => getchapterInfo()}>
                                    <Icon name="info" size={35} color="black" />
                                </Pressable>


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
                                                            <Text className={`${textSize !== '4xl' ? textSize : 'text-4xl'} leading-relaxed text-wrap`}>{verse.text_uthmani}</Text>
                                                        </View>
                                                    </View>


                                                </View>

                                                {/* if toggled 'ON' then render */}
                                                {tr && (
                                                    <Text className='text-lg'>{translation}</Text>
                                                )}

                                                {translit && (
                                                    <Text className='text-lg'>{transliteration}</Text>
                                                )}
                                            </View>
                                        );
                                    })}

                                    {/* page info and next, prev page */}
                                    <View className="flex items-center justify-center mx-10 border-t-2 border-black pb-52">
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

                <InfoPopup
                    isVisible={isInfoVisible}
                    onClose={() => setInfoVisible(false)}
                    data={chapterInfo}
                />

            </Modal>

        </View>
    )
}

export { SurahComponent }