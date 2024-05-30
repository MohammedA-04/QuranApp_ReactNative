import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function HomeScreen() {
    return(
        <View className="flex-1 relative">
            <StatusBar style="dark" />
            {/* image placeholder */}


            <SafeAreaView>
                <View className="mx-4 relative z-50">
                    <Text>
                        Hello Quran App
                    </Text>
                </View>
            </SafeAreaView>
        </View>
        
    )
}