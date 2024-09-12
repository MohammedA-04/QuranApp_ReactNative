import React, {useContext} from 'react';
import { View, Pressable, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGear, faHouse, faBookQuran } from '@fortawesome/free-solid-svg-icons';
import { SettingsContext } from '../SettingsContext';
import { theme } from '../theme/index'

export default function BottomNavigation({ selectedPageIcon, onPageChange }) {
    
    const {settings} = useContext(SettingsContext);

     const bg_nav =  settings.System.darkMode ? 'bg-slate-900' : 'bg-gray-400/100';
     const borderClr = settings.System.darkMode ? 'border-white' : 'border-black' ;
     const bg_outer = settings.System.darkMode ? 'bg-white' : 'bg-black' ;
     const cornerColor = settings.System.darkMode ? 'black' : 'white';

    // So in settings darkmode is set to false by default which can be [t/f]
    // For Any Element: set current styler to darkmode style
    // By checking it to $selectedPageIcon

    const iconStyler = (e) => {
        
        if(e === true){ // selected block
            if(settings.System.darkMode){ // check modeStyle
                return 'white'
            }else{
                return 'black'
            }
        }
        else if(e === false){ // unselected block
            if(settings.System.darkMode){ 
                return theme.bgWhite(0.5)
            }else{
                return theme.bgBlack(0.5)
            }
        }
    }

    const textStyler = (e) => {
        
        if(e === true){
            if(settings.System.darkMode){
                return 'text-white'
            }else{
                return 'text-black'
            }
        }
        else if(e === false){
            if(settings.System.darkMode){
                return 'text-white/50'
            }else{
                return 'text-black/50'
            }
        }
    }


 
        return (
            <View className={`relative rounded-t-[20px] overflow-hidden ${bg_outer}`}>
            
            {/* Top Left Corner */}
            <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 10,
                height: 10,
                backgroundColor: cornerColor,
                borderBottomRightRadius: 10,
            }} />

            {/* Top Right Corner */}
            <View style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 10,
                height: 10,
                backgroundColor: cornerColor,
                borderBottomLeftRadius: 10,
            }} />
            
            <View className={`border-t-2 rounded-t-[20px] ${borderClr} ${bg_nav}`} style={{ /*marginTop: 10*/ }}>
                <View className="flex flex-row justify-around p-3 mb-4 mt-2">
                    
                    <Pressable onPress={() => onPageChange('Home')} className="items-center">
                        <FontAwesomeIcon icon={faHouse} color={`${selectedPageIcon === 'Home' ? iconStyler(true) : iconStyler(false)}`} size={22} />
                        <Text className={`text-xs font-semibold mt-1 ${selectedPageIcon === 'Home' ? textStyler(true) : textStyler(false)}`}>Home</Text>
                    </Pressable>

                    <Pressable onPress={() => onPageChange('Chapters')} className="items-center">
                        <FontAwesomeIcon icon={faBookQuran} color={`${selectedPageIcon === 'Chapters' ? iconStyler(true) : iconStyler(false)}`} size={22} />
                        <Text className={`text-xs font-semibold mt-1 ${selectedPageIcon === 'Chapters' ? textStyler(true) : textStyler(false)}`}>Chapters</Text>
                    </Pressable>

                    <Pressable onPress={() => onPageChange('Settings')} className="items-center">
                        <FontAwesomeIcon icon={faGear} color={`${selectedPageIcon === 'Settings' ? iconStyler(true) : iconStyler(false)}`} size={22} />
                        <Text className={`text-xs font-semibold mt-1 ${selectedPageIcon === 'Settings' ? textStyler(true) : textStyler(false)}`}>Settings</Text>
                    </Pressable>

                </View>
            </View>
        </View>
        );
    }
    