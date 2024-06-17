import React, { useContext, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Switch, ScrollView, StatusBar } from 'react-native';
import { Select } from '@mobile-reality/react-native-select-pro'; // Adjust import based on your Select component
import { SettingsContext } from '../SettingsContext';
import { textSizeOptions, languageOptions } from '../theme'; // Adjust import based on your textSizeOptions source
import { fetchTranslations } from '../api/quranAPI';

export default function SettingsScreen() {
    const { settings, toggleSetting, changeSetting } = useContext(SettingsContext);
    const [settedTextSize, setTextSize] = useState(settings.System.textSize);
    const [settedLanguage, setLanguage] = useState(settings.Language.language);

    const [filteredOptions, setFilteredOptions] = useState([]);
    const [exportedOptions, setExportedOptions] = useState([]);
    const [settedChoice, setChoice] = useState(settings.System.version); // {number: 20 [en-sahih-international]}

    const [isLangTranslationsLoaded, setLangTranslationsLoaded] = useState(false);

    const handleTextSizeChange = (value) => {
        // Update textSize setting in context
        setTextSize(value);
        changeSetting('System', 'textSize', value);
    };

    useEffect(() => {
        const updateLanguage = async () => {
            const choices = await fetchTranslations(settedLanguage);
            const filteredChoices = {};

            // returns translationObject 
            for (let key in choices) {
                if (choices.hasOwnProperty(key)) {
                    filteredChoices[key] = choices[key];
                }
            }

            // select component only takes {label, value}
            const optionsArray = Object.keys(filteredChoices).map(key => ({
                label: filteredChoices[key].name,
                value: filteredChoices[key].id
            }));

            console.log('Options array:', optionsArray);

            // reset boht exported 
            setExportedOptions(null);
            setFilteredOptions(null);

            // exporting to component
            setExportedOptions(optionsArray); // Export options
            setFilteredOptions(filteredChoices); // Export FULL CHOICE ARRAY


            // reset 
            setLangTranslationsLoaded(false)
            setLangTranslationsLoaded(true)



        };

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

                                        {isLangTranslationsLoaded === true &&
                                            (key === 'version' && sectionName === 'Language') && (
                                                <View className="w-7/12">
                                                    <Select
                                                        options={exportedOptions}
                                                        value={settedChoice}
                                                        onSelect={(item) => handleLanguageTranslationChange(item.value)}
                                                        onRemove={() => handleLanguageTranslationChange(null)}
                                                    // when $lang is choosen then load options suchas filteredOptions
                                                    // handleLanguage trnaslation get list for a language
                                                    />
                                                </View>

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
                                        {typeof value !== 'boolean' && key !== 'textSize' && key !== 'language' && (
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
