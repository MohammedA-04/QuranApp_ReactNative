import React, { useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ChapterScreen from '../screens/ChapterScreen';
import SettingScreen from '../screens/SettingsScreen';
import BottomNavigation from '../components/BottomNavigation'; // Ensure the path is correct
import { SettingsProvider } from '../SettingsContext';
import { SelectProvider } from '@mobile-reality/react-native-select-pro';

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
    const [selectedIcon, setSelectedIcon] = useState('Home'); // Default to Home

    const handleNavigation = (navigation, page) => {
        setSelectedIcon(page);
        navigation.navigate(page);
    };

   

    return (
        <SettingsProvider>
            <SelectProvider>
                <NavigationContainer>
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Home">
                            {(props) => <HomeScreenWithNav {...props} selectedIcon={selectedIcon} handleNavigation={handleNavigation} />}
                        </Stack.Screen>
                        <Stack.Screen name="Chapters">
                            {(props) => <ChapterScreenWithNav {...props} selectedIcon={selectedIcon} handleNavigation={handleNavigation} />}
                        </Stack.Screen>
                        <Stack.Screen name="Settings">
                            {(props) => <SettingsScreenWithNav {...props} selectedIcon={selectedIcon} handleNavigation={handleNavigation} />}
                        </Stack.Screen>
                    </Stack.Navigator>
                </NavigationContainer>
            </SelectProvider>
        </SettingsProvider>
    );
}

function HomeScreenWithNav({ navigation, selectedIcon, handleNavigation }) {
    return (
        <View className="flex-1">
            <HomeScreen />
            <BottomNavigation selectedPageIcon={selectedIcon} onPageChange={(page) => handleNavigation(navigation, page)} />
        </View>
    );
}

function ChapterScreenWithNav({ navigation, selectedIcon, handleNavigation }) {
    return (
        <View className="flex-1">
            <ChapterScreen />
            <BottomNavigation selectedPageIcon={selectedIcon} onPageChange={(page) => handleNavigation(navigation, page)} />
        </View>
    );
}

function SettingsScreenWithNav({ navigation, selectedIcon, handleNavigation }) {
    return (
        <View className="flex-1">
            <SettingScreen />
            <BottomNavigation selectedPageIcon={selectedIcon} onPageChange={(page) => handleNavigation(navigation, page)} />
        </View>
    );
}
