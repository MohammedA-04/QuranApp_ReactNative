import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, ScrollView, Pressable, ActivityIndicator, Modal, Image } from 'react-native'
import { fetchChapterList, fetchChapterX } from '../api/quranAPI'
import { theme } from '../theme';

export default function ChapterScreen() {

    const [list, setList] = useState(null);
    const [chapterContent, setChapterContent] = useState(null);
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
    const loadChapter = async (chapterId) => {
        const ch = await fetchChapterX(chapterId);
        setChapterContent(ch);
        setModalVisible(true);
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

                    <ScrollView vertical>
                        <View className="mt-3 pb-32">
                            { // map $list => chapter show: surah no and name
                                list && list.map((chapter) => {

                                    const chapterName = Object.keys(chapter)[0];
                                    const chapterId = chapter[chapterName]


                                    return (
                                        <View className="p-1 rounded-md">
                                            <Pressable onPress={() => { loadChapter(chapterId) }}>
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
                                <Text>Ch Name</Text>
                            </View>
                        </View>

                        {!chapterContent && (
                            <View>
                                <ActivityIndicator size="large" color={"gray"} />
                            </View>
                        )}

                        {chapterContent && (
                            <View>
                                <ScrollView vertical>
                                    {chapterContent.verses.map((verse, i) => (
                                        <View key={i} className="flex-row mx-4 mt-8">

                                            <View>
                                                <Text className="text-xl">{verse.verse_key}</Text>
                                            </View>
                                            <View>
                                                <Text className="text-4xl ml-10">{verse.text_uthmani}</Text>
                                            </View>


                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </SafeAreaView>
                </View>
            </Modal>

        </View>
    )
}
