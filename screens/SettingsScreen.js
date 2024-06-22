import React, { useContext, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Switch, ScrollView, StatusBar } from 'react-native';
import { Select } from '@mobile-reality/react-native-select-pro'; 
import { SettingsContext } from '../SettingsContext';
import { textSizeOptions, languageOptions, languageMap } from '../theme';
import { fetchTranslations } from '../api/quranAPI';

export default function SettingsScreen() {
    const { settings, toggleSetting, changeSetting } = useContext(SettingsContext);
    const [settedTextSize, setTextSize] = useState(settings.System.textSize);   // text-4xl
    const [settedLanguage, setLanguage] = useState(settings.Language.language); // 'en' 
    const [settedChoice, setChoice] = useState(settings.System.version); // '131' for the clear quran
    
    const [translationsOptions, setTranslationsOptions] = useState([]);
    const [isLangTranslationsLoaded, setLangTranslationsLoaded] = useState(false);

    const handleTextSizeChange = (value) => {
        // Update textSize setting in context
        setTextSize(value);
        changeSetting('System', 'textSize', value);
    };

    // updateLanguageFunction
    const updateLanguage = async () => {
        const choices = await fetchTranslations(settedLanguage);
        
        // select component only takes {label, value}
        const optionsArray = Object.keys(choices).map(key => ({
            label: key,
            value: choices[key].id
        }));
        
        console.log('choice', choices)
        console.log('Options array:', optionsArray);

        // reset both exported 
        setTranslationsOptions(null);

        // exporting to component
        setTranslationsOptions(optionsArray); // e.g., [{lbl: TCQ, v: 131}, {... n}]


        // reset 
        setLangTranslationsLoaded(false)
        setLangTranslationsLoaded(true)



    };


    // onRenderMonut
    useEffect(() => {
        updateLanguage()
    }, [])


    useEffect(() => {
        updateLanguage()
    }, [settedLanguage, setChoice]);


    // changes language and in settings.Language
    const handleLanguageChange = async (value) => {

        // changing
        setLanguage(value);
        setChoice(null)
        // update settings
        changeSetting('Language', 'language', value)

    }

    const handleLanguageTranslationChange = async (value) => {
        // update language translation
        // 1. set new choice as value 
        // 2. then update settings 
        // 3. trigger useEffect then render
        if (!value) {
            console.error('No value selected for translation change');
            return;
        }

        console.log('Value aka translation id', value);

        // value is $id from optionsArray {label: 'name', value: 'id'}
        setChoice(value);
        changeSetting('Language', 'version', value);
        console.log(`choice is now: ${choice} and id in setting is ${value}`)
    };








    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar style="dark" />
            <View style={{ flex: 1, padding: 16 }}>
                <View style={{ backgroundColor: '#E2E8F0', borderRadius: 8, padding: 16, flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 24, marginBottom: 16 }}>Settings</Text>
                    <ScrollView style={{ flex: 1 }}>
                        {Object.entries(settings).map(([sectionName, sectionSettings]) => (
                            <View key={sectionName} style={{ marginBottom: 16 }}>
                                <View style={{ backgroundColor: '#A0AEC0', borderRadius: 8, padding: 8 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'white' }}>{sectionName}</Text>
                                </View>
                                {Object.entries(sectionSettings).map(([key, value]) => (
                                    <View key={key} style={{ backgroundColor: 'white', borderRadius: 8, padding: 16, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ flex: 1, fontWeight: 'bold' }}>{key}:</Text>
                                        {typeof value === 'boolean' && (
                                            <Switch
                                                onValueChange={() => toggleSetting(sectionName, key)} // negates 'key'
                                                value={value}
                                            />
                                        )}

                                        {key === 'language' && typeof value !== Boolean && (
                                            <View className="w-7/12">
                                                <Select
                                                    options={languageOptions}
                                                    value={settedLanguage} // initally set to 'en'
                                                    onSelect={(item) => handleLanguageChange(item.value)}
                                                    onRemove={() => handleLanguageChange(null)}
                                                />
                                            </View>

                                        )}

                                        {
                                            key === 'version' && sectionName === 'Language' ? (
                                                isLangTranslationsLoaded === false || settedLanguage === null ? (
                                                    <View className="w-7/12">
                                                        <Text>Please Select Language</Text>
                                                    </View>
                                                ) : (
                                                    isLangTranslationsLoaded === true && (
                                                        <View className="w-7/12">
                                                            <Select
                                                                options={translationsOptions}
                                                                value={settedChoice}
                                                                onSelect={(item) => handleLanguageTranslationChange(item.value ? item.value : settedLanguage)}
                                                                onRemove={() => handleLanguageTranslationChange(null)}
                                                            // when $lang is chosen then load options such as filteredOptions
                                                            // handleLanguage translation get list for a language
                                                            />
                                                        </View>
                                                    )
                                                )
                                            ) : null
                                        }




                                        {key === 'textSize' && typeof value !== Boolean && (
                                            <View className="w-7/12">
                                                <Select
                                                    options={textSizeOptions}
                                                    value={settedTextSize} // initally set to text-4xl
                                                    onSelect={(item) => handleTextSizeChange(item.value)}
                                                    onRemove={() => handleTextSizeChange(null)}
                                                />
                                            </View>

                                        )}
                                        {typeof value !== 'boolean' && key !== 'textSize' && key !== 'language' && !(sectionName === 'Language' && key === 'version') && (
                                            <Text style={{ flex: 1 }}>{String(value)}</Text>
                                        )}
                                    </View>
                                ))}
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    );
}
