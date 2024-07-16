import React, { useState, useEffect, useContext } from "react"
import { View, Text, SafeAreaView, ScrollView, Pressable, Modal, Image, ActivityIndicator } from 'react-native';
import { fetchJuzList, fetchJuzX } from '../../api/quranAPI';
import { SettingsContext } from '../../SettingsContext';
import { theme, juzList } from '../../theme/index';

const JuzComponent = ({ lang, ver, tr, translit, textSize }) => {
  const [juzContent, setJuzContent] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [choosenJuzName, setChoosenJuzName] = useState(null);
  const [choosenJuzNum, setChoosenJuzNum] = useState(null);

  const { settings } = useContext(SettingsContext);

  // ! @Issue: API provider not having usable to id to get Juz with
  // * @Param | juzNum: number (of Juz)
  const loadJuzX = async (juzNum) => {
    const juzX = await fetchJuzX(juzNum, 0, lang, ver);
    //// console.log(`juzX: ${juzX}`)

    setJuzContent(juzX);
    setModalVisible(true);
  }

  // TODO: Fix later
  const getTranslation = (verse) => {

    // check possible null entry
    //// console.log('verse', verse)


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
    //// console.log(`t is: ${lang} and v is: ${ver}`);
    //// console.log(`verse.translations[0].text: ${verse} `)

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


  // TODO: Fix later
  const getTransliteration = (verse) => {
    if (verse.words) {
      return verse.words.map(word => word.transliteration.text).join(' ');
    } else {
      return 'No transliteration available';
    }
  }

  // onPress <Pressable> => check if current - 1 >  0
  const previousPageInJuz = async (juz_num, currentPG) => {

    if (currentPG - 1 > 0) {
      setJuzContent(null)
      currentPG = currentPG - 1;
      const juz = await fetchJuzX(juz_num, currentPG, lang, ver);
      setJuzContent(juz)

    }

  }

  // onPress <Pressable> => check if current < maxPG then change page
  const nextPageInJuz = async (juz_num, currentPG, maxPG) => {

    if (currentPG !== maxPG) {
      setJuzContent(null); // due to shows <activity indicator/>
      currentPG = currentPG + 1;
      const juz = await fetchJuzX(juz_num, currentPG, lang, ver);
      setJuzContent(juz);
    }
  };



  return (
    <View>

      {/* Juz List Section */}
      <ScrollView vertical>
        <View className="mt-3 pb-32">
          {juzList && juzList.map((juz, i) => {
            //// console.log(juz.juz_number)
            return (
              <View key={i} className={`p-1 rounded-md`}>
                <Pressable onPress={() => { loadJuzX(juz.juz_number); {/* passing juz as num to juz/${juz_num} */ } setChoosenJuzName(juz.juz_name); setChoosenJuzNum(juz.juz_number); }}>
                  <View className={`p-4 flex-row items-center rounded-xl ${settings.System.darkMode ? 'bg-green-100/90' : 'bg-white/60'}`}>
                    <Text className="items-center">{juz.juz_number}</Text>
                    <Text className="ml-4 font-semibold text-lg">Juz {juz.juz_name}</Text>
                  </View>
                </Pressable>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Pop Up Section: contains juz content */}
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
                <Text className="font-bold text-2xl text-center">Juz {choosenJuzName}</Text>
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
                              <Text className={`${textSize !== '4xl' ? textSize : 'text-4xl'} leading-relaxed text-wrap`}>{verse.text_uthmani}</Text>
                            </View>
                          </View>
                        </View>

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
                        <Pressable onPress={() => previousPageInJuz(choosenJuzNum, juzContent.pagination.current_page)}>
                          <Text className="text-white font-semibold">Prev Page</Text>
                        </Pressable>
                      </View>

                      <Text className="font-medium text-xl">{juzContent.pagination.current_page} out of {juzContent.pagination.total_pages}</Text>

                      <View className="left-4 rounded-md bg-lime-500 p-2">
                        <Pressable onPress={() => nextPageInJuz(choosenJuzNum, juzContent.pagination.current_page, juzContent.pagination.total_pages)}>
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
  );
};
export { JuzComponent }