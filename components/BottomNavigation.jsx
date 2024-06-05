import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/index'
import { beginAsyncEvent } from 'react-native/Libraries/Performance/Systrace';

// Nav Bar for screens: (1) Home, (2) chapters
export default function BottomNavigation({ navigation }) {
    return (
        <View className="flex-[0.1] bg-gray-200">
            <View className="flex-row border-t-2 border-black justify-around p-2 absolute bottom-0 w-full mb-3 rounded-md ">
                <Pressable className="p-2" onPress={() => navigation.navigate('Home')}>
                    <Text className="text-lg font-semibold">Home</Text>
                </Pressable>

                <Pressable className="p-2" onPress={() => navigation.navigate('Chapters')}>
                    <Text className="text-lg font-semibold">Chapters</Text>
                </Pressable>
            </View>
        </View>
    );

}
