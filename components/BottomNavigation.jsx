import React, { useState } from 'react';
import { View, Pressable, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGear, faList, faHouse } from '@fortawesome/free-solid-svg-icons';

export default function BottomNavigation({ navigation }) {
    const [selectedIcon, setSelectedIcon] = useState('home');



    return (
        <View className="bg-gray-200">
            <View className="border-t-2 border-black">
                <View className="flex flex-row justify-around p-3 mb-4 mt-2">
                    <Pressable onPress={() => navigation.navigate('Home')} className="items-center">
                        <FontAwesomeIcon icon={faHouse} color={selectedIcon === 'home' ? 'blue' : 'black'} size={22} />
                        <Text className="text-xs font-semibold text-gray-400 mt-1">Home</Text>
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate('Chapters')} className="items-center">
                        <FontAwesomeIcon icon={faList} color={selectedIcon === 'Chapters' ? 'blue' : 'black'} size={22} />
                        <Text className="text-xs font-semibold text-gray-400 mt-1">Chapters</Text>
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate('Settings')} className="items-center">
                        <FontAwesomeIcon icon={faGear} color={selectedIcon === 'Settings' ? 'blue' : 'black'} size={22} />
                        <Text className="text-xs font-semibold text-gray-400 mt-1">Settings</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}
