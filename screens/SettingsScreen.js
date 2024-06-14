import React, { useContext, useState } from 'react';
import { View, Text, SafeAreaView, Switch, ScrollView, StatusBar } from 'react-native';
import { Select } from '@mobile-reality/react-native-select-pro'; // Adjust import based on your Select component
import { SettingsContext } from '../SettingsContext';
import { textSizeOptions, languageOptions } from '../theme'; // Adjust import based on your textSizeOptions source
import { fetchTranslations } from '../api/quranAPI';

export default function SettingsScreen() {
    const { settings, toggleSetting, changeSetting } = useContext(SettingsContext);
    const [settedTextSize, setTextSize] = useState(settings.System.textSize);
    const [settedLanguage, setLanguage] = useState(settings.Language.language);

    const [filteredOptions, setfilteredChoices] = useState(null);
    const [settedChoice, setChoice] = useState(null);

    const handleTextSizeChange = (value) => {
        setTextSize(value);
        // Update textSize setting in context
        changeSetting('System', 'textSize', value);
    };

    const handleLanguageChange = async (value) => {
        setLanguage(value);
        changeSetting('Language', 'language', value);

        // get choice && filter only their translation{[name: 'en-haleem']}
        const choices = await fetchTranslations(settedLanguage);
        const filteredChoices = {};

        for (let key in choices) {
            if (choices.hasOwnProperty(key)) {
                filteredChoices[key] = choices[key];
            }
        }

        const optionsArray = Object.keys(filteredChoices).map(key => ({
            label: filteredChoices[key].name,
            value: key
        }));

        console.log("type of optionsArray: ", typeof optionsArray)
        setfilteredChoices(optionsArray)
    }

    const handleLanguageTranslation = async (value) => {
        setChoice(null);
        setChoice(value);
        console.log("type of settedChoice: ", typeof settedChoice)

        // update language translation
        changeSetting('Language', 'version', value);

    }



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

                                        {key === 'version' && sectionName === 'Language' && settedLanguage && typeof value !== Boolean && filteredOptions && (
                                            <Select
                                                options={filteredOptions}
                                                value={settedChoice}
                                                onSelect={(item) => handleLanguageTranslation(item.value)}
                                                onRemove={() => handleLanguageTranslation(null)}
                                            // when $lang is choosen then load options suchas filteredOptions
                                            // 
                                            />
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
