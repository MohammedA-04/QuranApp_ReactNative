import React, { useEffect } from 'react'
import { View, Text, ScrollView, Pressable, Modal, useWindowDimensions } from 'react-native'
import HTML from 'react-native-render-html';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons'

// see forked implementation: [https://youtube.com/watch?v=KvRqsRwpwhY&t=736s&ab_channel=Reactiive]

/* prop explained:
 
 * $isVisible (bool): icon onclick performs getChapterInfo() within it has 
    state change to true if there is chapterInfo for chapterID 

 * $onClose (bool): function call to change state to false i.e., ${infoVisible}
 
 * $data: passing data const as prop 
 */
    
export default InfoBottomSheet = ({ isVisible, onClose, data }) => {

    const triggerClose = (onClose) => {
        return onClose
    }

    const screen_height = useWindowDimensions().height;
    const screen_width = useWindowDimensions().width;

    const styleForHTML = {
        h1: { fontWeight: 'bold' },
        li: { padding: 10 },
        ol: { padding: 10 }
    };

    if (!data) return null;

    const modalHeight = screen_height * 0.6; // Show only 40% of the screen height

   

    return (
        
    <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={triggerClose(onClose)}
    >

        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            
            {/* area of the modal  */}
            <View style={{ height: modalHeight, backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                
                {/* line */}
                <View style={{ height: 4, width: 100, backgroundColor: 'gray', alignSelf: 'center', marginTop: 10, borderRadius: 2 }} />

                {/* circle close button */}
                <View className='items-end mx-4 -mt-1'>
                    <Pressable onPress={onClose} className='w-8 h-8 rounded-full bg-gray-800 justify-center items-center'>
                        <FontAwesomeIcon icon={faX} color='white' size={18} className='font-bold' />
                    </Pressable>
                </View>
                        
                        <ScrollView>
                            <View style={{ marginTop: 20, marginBottom: 20, marginLeft: 20, marginRight: 20 }}>
                                 {/* Introductory Information about said Chapter */}
                                 <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
                                    {data.chapter_info.short_text}  
                                </Text>

                                {/* Content provided by source regarding the Chapter ~ parsed from HTML */}
                                <HTML source={{ html: data.chapter_info.text }} tagsStyles={styleForHTML}/>


                                {/* Source providing the chapter information */}
                                <Text style={{ textAlign: 'center', fontSize: 16, marginBottom: 10 }}>
                                    <Text style={{fontWeight: 'bold'}}>Provided by</Text>
                                    <Text>: {data.chapter_info.source}</Text>
                                </Text>
                                
                                {/* className='italic text-center text-gray-600' */}
                                <Text style={{fontStyle: 'italic', textAlign: 'center', color:'gray', fontSize: '12'}}>note: chapter information are not based on translation the selected</Text>
                            </View>
                        </ScrollView>

                </View>

            
        </View>
    </Modal>
);
};
    
    