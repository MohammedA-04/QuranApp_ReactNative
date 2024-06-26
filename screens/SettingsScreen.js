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

    const updateLanguage = async () => {
        if (settedLanguage) {
            const choices = await fetchTranslations(settedLanguage);
            const optionsArray = Object.keys(choices).map(key => ({
                label: key,
                value: choices[key].id
            }));

            setTranslationsOptions(optionsArray);
            setLangTranslationsLoaded(true); // Set this only after translationsOptions is updated
        } else {
            setLangTranslationsLoaded(false);
            setTranslationsOptions([]);
        }
    };

    useEffect(() => {
        updateLanguage();
    }, [settedLanguage]);

    const handleLanguageChange = async (value) => {
        setLanguage(value);
        setChoice(null);
        changeSetting('Language', 'language', value);
        setLangTranslationsLoaded(false); // Reset the loaded state when language changes
    };

    const handleLanguageTranslationChange = async (value) => {
        if (!value) {
            console.error('No value selected for translation change');
            return;
        }

        setChoice(value);
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

                                        {key === 'version' && sectionName === 'Language' && (
                                                isLangTranslationsLoaded  ? (
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
