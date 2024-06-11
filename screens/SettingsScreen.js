import React, { useState } from 'react';
import { View, Text, SafeAreaView, Switch, ScrollView } from 'react-native';

export default function SettingsScreen() {
    const SettingsContent = {
        Language: {
            Translation: false,
            Transliteration: false,
            Language: 'english'
        },
        System: {
            TextSize: '4xl',
            DarkMode: false
        },
        About: {
            Author: 'Mohammed Ahmed',
            Version: 'v0.0.1'
        }
    };

    const initializeSwitchStatus = () => {
        const status = {};
        Object.entries(SettingsContent).forEach(([section, settings]) => {
            status[section] = {};
            Object.entries(settings).forEach(([key, value]) => {
                if (typeof value === 'boolean') {
                    status[section][key] = value;
                }
            });
        });
        return status;
    };

    const [switchStatus, setSwitchStatus] = useState(initializeSwitchStatus());

    const toggleSwitch = (section, key) => {
        setSwitchStatus(prevState => ({
            ...prevState,
            [section]: {
                ...prevState[section],
                [key]: !prevState[section][key]
            }
        }));
    };

    return (
        <View style={{ marginHorizontal: 16, marginVertical: 16, alignItems: 'center', justifyContent: 'center' }}>
            <SafeAreaView>
                <View style={{ flex: 1, padding: 4,  backgroundColor: 'lightblue', borderRadius: 5, borderWidth: 2 }}>
                    
                        
                    <View className=" bg-gray-300 p-5 w-96 rounded-xl my-4 items-center justify-center">
                        <Text className="font-semibold text-3xl">Setting Screen</Text>
                    </View>
                    
                    <View style={{ marginHorizontal: 16, marginVertical: 16 }}>
                        <ScrollView>
                            {Object.entries(SettingsContent).map(([sectionName, settings]) => (
                                <View key={sectionName} style={{ marginBottom: 16 }}>
                                    <View className="bg-slate-200 p-2 rounded-lg mx-2">
                                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{sectionName}</Text>
                                    </View>
                                    {Object.entries(settings).map(([key, value]) => (
                                        <View key={key} className=" bg-white rounded-md p-4"style={{ marginLeft: 8, marginVertical: 4, flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ flex: 1, fontWeight: 'bold' }}>{key}:</Text>
                                            
                                            {/* if boolean render switch in KV and if not V of K */}
                                            {typeof value === 'boolean' ? (
                                                <Switch
                                                    onValueChange={() => toggleSwitch(sectionName, key)}
                                                    value={switchStatus[sectionName]?.[key] ?? value}
                                                />
                                            ) : (
                                                <Text style={{ flex: 1 }} className="items-ends">{String(value)}</Text>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}
