import React, {useContext} from 'react';
import { View, Pressable, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGear, faHouse, faBookQuran } from '@fortawesome/free-solid-svg-icons';
import { SettingsContext } from '../SettingsContext';

export default function BottomNavigation({ selectedPageIcon, onPageChange }) {
    
    const {settings} = useContext(SettingsContext);
 
        return (
            <View className="bg-gray-200">
                <View className="border-t-2 border-black">
                    <View className="flex flex-row justify-around p-3 mb-4 mt-2">
                        <Pressable onPress={() => onPageChange('Home')} className="items-center">
                            <FontAwesomeIcon icon={faHouse} color={selectedPageIcon === 'Home' ? 'blue' : 'black'} size={22} />
                            <Text className="text-xs font-semibold text-gray-400 mt-1">Home</Text>
                        </Pressable>
    
                        <Pressable onPress={() => onPageChange('Chapters')} className="items-center">
                            <FontAwesomeIcon icon={faBookQuran} color={selectedPageIcon === 'Chapters' ? 'blue' : 'black'} size={22} />
                            <Text className="text-xs font-semibold text-gray-400 mt-1">Chapters</Text>
                        </Pressable>
    
                        <Pressable onPress={() => onPageChange('Settings')} className="items-center">
                            <FontAwesomeIcon icon={faGear} color={selectedPageIcon === 'Settings' ? 'blue' : 'black'} size={22} />
                            <Text className="text-xs font-semibold text-gray-400 mt-1">Settings</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        );
    }
    