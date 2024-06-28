import React, { useState, useEffect, useContext } from "react"
import { View, Text, SafeAreaView, ScrollView, Pressable, Modal, Image, ActivityIndicator } from 'react-native';
import { fetchJuzList, fetchJuzX } from '../../api/quranAPI';
import { SettingsContext } from '../../SettingsContext';
import { theme, juzList } from '../../theme/index';

const JuzComponent = ({ list }) => {
  const [juzContent, setJuzContent] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const { settings } = useContext(SettingsContext);

  // ! @Issue: API provider not having usable to id to get Juz with
  // * @Param | juzNum: number (of Juz)
  const loadJuzX = async (juzNum) => {
    const juzX = await fetchJuzX(juzNum, settings.Language.language, settings.Language.version);
    
    setJuzContent(juzX);
    setModalVisible(true);
  }

  // TODO: Fix later
  const getTranslation = (verse) => {
    if (verse.translations) {
      return verse.translations[0].text;
    } else {
      return 'No translation available';
    }
  }

  // TODO: Fix later
  const getTransliteration = (verse) => {
    if (verse.words) {
      return verse.words.map(word => word.transliteration.text).join(' ');
    } else {
      return 'No transliteration available';
    }
  }


  return (
    <View>

      {/* Juz List Section */}
      <ScrollView vertical>
        <View className="mt-3 pb-32">
          {juzList && juzList.map((juz, i) => {
            console.log(juz.juz_number)
            return (
              <View key={i} className="p-1 rounded-md ">
                <Pressable onPress={() => { loadJuzX(juz.juz_number); {/* passing juz as num to juz/${juz_num} */} }}>
                  <View className="p-4 flex-row items-center rounded-xl" style={{ backgroundColor: theme.bgWhite(0.6) }}>
                    <Text className="items-center">{juz.juz_number}</Text>
                    <Text className="ml-4 font-semibold text-lg">Juz {juz.juz_name}</Text>
                  </View>
                </Pressable>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Pop Up Section */}
      <Modal
        animationType='slide'
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(!isModalVisible)}
      >
        <View className="mx-4 my-4">

          <SafeAreaView>
            <View className="flex-row bg-gray-200 items-center justify-between p-4 rounded-lg">
              <Pressable onPress={() => setModalVisible(false)}>
                <Image className="w-10 h-10" source={require('../../assets/close.png')} />
              </Pressable>
              <View className="absolute left-32 transform -translate-x-1/2">
                <Text className="font-bold text-2xl text-center">Juz List</Text>
              </View>
            </View>

            {/* loading icon */}
            {!juzContent && (
              <View>
                <ActivityIndicator size="large" color={"gray"} />
              </View>
            )}

            {/* load juz w transliteration & translations if loaded */}
            {juzContent && (
              <View>
                <ScrollView vertical>

                  {juzContent.verses.map((verse, i) => {
                    const translation = getTranslation(verse);
                    const transliteration = getTransliteration(verse);
                    const lastIteration = i === juzContent.verses.length - 1;

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

                        {settings.Language.translation && (
                          <Text className='text-lg'>{translation}</Text>
                        )}

                        {settings.Language.transliteration && (
                          <Text className='text-lg'>{transliteration}</Text>
                        )}
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            )}
          </SafeAreaView>

        </View>
      </Modal>


    </View>
  );
};
export { JuzComponent }