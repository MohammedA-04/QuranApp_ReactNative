import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import { fetchChapterList } from '../api/quranAPI'
import { theme } from '../theme';

export default function ChapterScreen() {

    const [list, setList] = useState(null);

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


    return (
        <View className="flex-1 bg-green-200 mx-0 my-0">
            <SafeAreaView>
                <View className="mx-2 my-2">

                    <View className="p-4 rounded-lg items-center justify-center" style={{ backgroundColor: theme.bgWhite(0.6) }}>
                        <Text className="font-semibold text-lg">Surah's  (Chapters)</Text>
                    </View>

                    <ScrollView vertical>
                        <View className="mt-3 mb-16">
                            { // map $list => chapter show: surah no and name
                                list && list.map((chapter) => {

                                    const chapterName = Object.keys(chapter)[0];
                                    const chapterId = chapter[chapterName]


                                    return (
                                        <View className="p-1 rounded-md">
                                            <View className="p-4 flex-row items-center rounded-xl" style={{ backgroundColor: theme.bgWhite(0.6) }}>
                                                <Text>{chapterId}</Text>
                                                <Text className="ml-4 font-semibold text-lg">{chapterName}</Text>
                                            </View>

                                        </View>
                                    )
                                })

                            }
                        </View>
                    </ScrollView>

                </View>

            </SafeAreaView>

        </View>
    )
}
