import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, ScrollView, Pressable, ActivityIndicator, Modal, Image } from 'react-native'
import { fetchChapterList, fetchChapterX, fetchChapterXpage } from '../api/quranAPI'
import { theme } from '../theme';

export default function ChapterScreen() {

    const [list, setList] = useState(null);
    const [chapterContent, setChapterContent] = useState(null);
    const [chapterName, setChapterName] = useState(null);
    const [chapterID, setChapterID] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

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

    }, [])


    /* Going to load data for said chapter onClick
    const getChapter = async (chapter_number) => {

        const ch = await fetchChapterX(chapter_number);
        
    }*/

    // onPress <Pressable> => render component of Uthman Script and Translation which is mapped until ...n
    const loadChapter = async (chapterId, chapterName) => {
        const ch = await fetchChapterX(chapterId);
        setChapterContent(ch);
        setChapterName(chapterName);
        setModalVisible(true);
    };

    // onPress <Pressable> => check if current < maxPG then change page
    const nextPageInChapter = async (chapterID, currentPG, maxPG) => {

        if (currentPG !== maxPG) {
            setChapterContent(null); // due to shows <activity indicator/>
            currentPG = currentPG + 1;
            const ch = await fetchChapterXpage(chapterID, currentPG);
            console.log(ch)
            setChapterContent(null);
            setChapterContent(ch);
        }
    };

    return (
        <View className="flex-1 bg-green-200 mx-0 my-0">
            <SafeAreaView>
                <View className="mx-2 my-2">

                    <View className="p-4 rounded-lg items-center justify-center" style={{ backgroundColor: theme.bgWhite(0.6) }}>
                        <Text>
                            <Text className="font-semibold text-lg">Surahs  </Text>
                            <Text className="text-xl">|</Text>
                            <Text className="font-semibold text-md text-gray-500">  Chapters</Text>
                        </Text>

                    </View>

                    {/* 114 Surahs List */}
                    <ScrollView vertical>
                        <View className="mt-3 pb-32">
                            { // map $list => chapter show: surah no and name
                                list && list.map((chapter) => {

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
                        <View className="flex-row bg-gray-200 items-center justify-center">
                            <View className=" justify-start items-start">
                                <Pressable onPress={() => setModalVisible(false)}>
                                    <Image
                                        className="w-10 h-10"
                                        source={require('../assets/close.png')} />
                                </Pressable>
                            </View>

                            <View className="font-semibold text-lg">
                                <Text>{chapterName}</Text>
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
                                    {chapterContent.verses.map((verse, i) => (
                                        <View key={i} className="flex-row mx-4 mt-8 pb-20">

                                            <View><Text className="text-xl">{verse.verse_key}</Text></View>
                                            <View><Text className="text-4xl ml-10">{verse.text_uthmani}</Text></View>

                                        </View>
                                    ))}

                                    {/* page info and next, prev page */}
                                    <View className="flex items-center justify-center mx-10 border-t-2 border-black pb-28">
                                        <View className="flex-row items-center space-x-2 mt-4">

                                            <View className="right-4 rounded-md bg-red-400 p-2">
                                                <Pressable><Text>Prev Page</Text></Pressable>
                                            </View>

                                            <Text className="font-medium text-xl">{chapterContent.pagination.current_page} out of {chapterContent.pagination.total_pages}</Text>

                                            <View className="left-4 rounded-md bg-lime-400 p-2">
                                                <Pressable onPress={() => nextPageInChapter(chapterID, chapterContent.pagination.current_page, chapterContent.pagination.total_pages)}><Text>Next Page</Text></Pressable>
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
