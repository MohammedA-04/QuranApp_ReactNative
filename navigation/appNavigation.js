import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet } from 'react-native';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ChapterScreen from '../screens/ChapterScreen';
import SettingScreen from '../screens/SettingsScreen';
import BottomNavigation from '../components/BottomNavigation'; // Ensure the path is correct

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={HomeScreenWithNav} />
                <Stack.Screen name="Chapters" component={ChapterScreenWithNav} />
                <Stack.Screen name="Settings" component={SettingsScreenWithNav} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

// Function to render: < <Screen{x}/> and <Navigation/> />
function HomeScreenWithNav({ navigation: screen }) {
    return (
        <View className="flex-1">
            <HomeScreen />
            <BottomNavigation navigation={screen} />
        </View>
    );
}

function ChapterScreenWithNav({ navigation: screen }) {
    return (
        <View className="flex-1">
            <ChapterScreen />
            <BottomNavigation navigation={screen} />
        </View>
    );
}

function SettingsScreenWithNav({ navigation: screen }) {
    return (
        <View className="flex-1">
            <SettingScreen />
            <BottomNavigation navigation={screen} />
        </View>
    );
}




const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
});
