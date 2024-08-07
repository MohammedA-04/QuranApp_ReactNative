import React, { useContext, useEffect, useState } from 'react'
import { View, Text, SafeAreaView, ScrollView, Pressable, ActivityIndicator, Modal, Image, Dimensions } from 'react-native'

import { SettingsContext } from '../SettingsContext';
import { theme } from '../theme';
import { Select } from '@mobile-reality/react-native-select-pro';
import { JuzComponent } from './components/JuzComponent'
import { SurahComponent } from './components/SurahComponent';

export default function ChapterScreen() {


    const { settings } = useContext(SettingsContext)

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
                                    backdrop: { backgroundColor: theme.bgGray(0.4) },

                                    option: {
                                        container: {
                                            paddingHorizontal: 10, paddingRight: 10, padding: 10,
                                            width: 400, height: 50, flexWrap: 'wrap', // Allows wrapping if necessary
                                        },
                                        text: { fontWeight: 'bold', },
                                        selected: {
                                            container: { backgroundColor: theme.bgGray(0.6) },
                                            text: { color: theme.bgWhite(1) }
                                        }
                                    },
                                    optionText: { fontSize: 16, padding: 10, },
                                    selectContainer: { width: dropdownWidth },
                                    sectionHeader: { text: { fontWeight: 'bold' } }

                                }}

                            />
                        </View>

                    </View>


                    {/* 114 Surahs List */}
                    <ScrollView vertical>
                        {/* map $list => chapter show: surah no and name */}
                        <View className="mt-3 pb-32">

                            {settedList === 'Juz' ? (
                                <JuzComponent
                                    lang={settings.Language.language}
                                    ver={settings.Language.version}
                                    tr={settings.Language.translation}
                                    translit={settings.Language.transliteration}
                                    textSize={settings.System.textSize}
                                />
                            ) : (
                                <SurahComponent
                                    lang={settings.Language.language}
                                    ver={settings.Language.version}
                                    tr={settings.Language.translation}
                                    translit={settings.Language.transliteration}
                                    textSize={settings.System.textSize}
                                />
                            )}

                        </View>
                    </ScrollView>

                </View>
            </SafeAreaView>
        </View>
    )
}
