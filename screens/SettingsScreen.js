import React, { useContext, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Switch, ScrollView, StatusBar } from 'react-native';
import { Select } from '@mobile-reality/react-native-select-pro';
import { SettingsContext } from '../SettingsContext';
import { textSizeOptions, languageOptions, languageMap } from '../theme';
import { fetchTranslations } from '../api/quranAPI';

export default function SettingsScreen() {
    const { settings, toggleSetting, changeSetting } = useContext(SettingsContext);
    const [settedTextSize, setTextSize] = useState(settings.System.textSize);   // text-4xl
    const [settedLanguage, setLanguage] = useState(null); // 'en' 
    const [settedChoice, setChoice] = useState(null); // '131' for the clear quran


    const [translationsOptions, setTranslationsOptions] = useState([]);
    const [isLangTranslationsLoaded, setLangTranslationsLoaded] = useState(false);
    const [isLangVerEnabled, setIsLangVerEnabled] = useState(false);

    const handleTextSizeChange = (value) => {
        // Update textSize setting in context
        setTextSize(value);
        changeSetting('System', 'textSize', value);
    };

    const updateLanguage = async () => {
        if (settedLanguage) {

            // select component only takes {label, value}
            const choices = await fetchTranslations(settedLanguage);
            const optionsArray = Object.keys(choices).map(key => ({
                label: key,
                value: choices[key].id
            }));

            // export $optionsArray and load content
            setTranslationsOptions(optionsArray);
            setLangTranslationsLoaded(true);
        } else {
            // do not load content and del options 
            setLangTranslationsLoaded(false);
            setTranslationsOptions([]);
        }
    };

    useEffect(() => {
        updateLanguage();
    }, [settedLanguage]);

    const handleLanguageChange = async (value) => {

        // reset the loaded state when language change
        if (value !== null) {
            setLanguage(value);
            //// console.log('choosen lang:', value)
            changeSetting('Language', 'language', value);
            changeSetting('Language', 'version', null);
            setLangTranslationsLoaded(false)

        } else if (value === null) {
            setLanguage(null);
            setChoice(null);
            changeSetting('Language', 'language', null);
            changeSetting('Language', 'version', null);
            setLangTranslationsLoaded(false);
            setIsLangVerEnabled(false)
        }


    };

    const handleLanguageTranslationChange = async (value) => {

        if (value !== null) {
            setChoice(value);
            changeSetting('Language', 'version', value)
        } else if (value === null) {
            setChoice(null);
            setIsLangVerEnabled(false)
            changeSetting('Language', 'version', null)
            return;
        } else {
            throw new Error('No value selected for translation change')
        }


    }


    const checkSettings = () => {
        //// console.log('translation toggle: ', settings.Language.translation);
        //// console.log('language', settings.Language.language)
        //// console.log('version: ', settings.Language.version);
    }

    // Add a useEffect to check settings after changes
    useEffect(() => {
        checkSettings();
    }, [settings]);

    useEffect(() => {
        if (settings.Language.language && settings.Language.version) {
            setIsLangVerEnabled(true)
        }

    }, [settings.Language.language, settings.Language.version])





    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#E2E8F0' }}>
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

                                        {/*
                                            $value: value within settings context e.g., Mohammed Ahmed
                                            $key: key of object e.g., author
                                        */}

                                        {typeof value === 'boolean' && key !== 'translation' && (
                                            <Switch
                                                onValueChange={() => toggleSetting(sectionName, key)} // negates 'key'
                                                value={value}
                                            />
                                        )}

                                        {/* For Language: language */}
                                        {key === 'language' && sectionName === 'Language' && typeof value !== Boolean && (
                                            <View className="w-7/12">
                                                <Select
                                                    options={languageOptions}
                                                    value={settedLanguage} // initally set to 'en'
                                                    onSelect={(item) => handleLanguageChange(item.value)}
                                                    onRemove={() => handleLanguageChange(null)}
                                                />
                                            </View>

                                        )}

                                        {/* For Language: version */}
                                        {key === 'version' && sectionName === 'Language' && (
                                            isLangTranslationsLoaded ? (
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
                                            ) : (
                                                <View className="w-7/12">
                                                    <Text>Please Select Language</Text>
                                                </View>

                                            )
                                        )}

                                        {key === 'translation' && (
                                            isLangVerEnabled ? (
                                                <Switch
                                                    onValueChange={() => toggleSetting(sectionName, key)} // negates 'key'
                                                    value={value}
                                                />
                                            ) : (
                                                <View className='w-7/12'>
                                                    <Text>Select Language and Version First</Text>
                                                </View>
                                            )
                                        )}




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
