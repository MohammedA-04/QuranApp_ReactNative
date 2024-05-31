import React, { useState } from "react";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { fetchAyahByKey, fetchRandomAyah } from "../api/quranAPI"; // Ensure the path is correct
import { theme } from '../theme/index'; // Ensure the path is correct

export default function HomeScreen() {
    const [clicked, setClicked] = useState(false);
    const [randomAyah, setRandomAyah] = useState(null);

    const handleGetRandomAyah = async () => {
        const data = await fetchRandomAyah();
        if (data && data.verse) {
            setClicked(true);
            setRandomAyah(data.verse);
            console.log(data.verse);

            console.log('hey: ', fetchAyahByKey(randomAyah.verse_key))

        } else {
            console.error("Failed to fetch random Ayah.");
        }
    };

    return (
        <View className="flex-1">
            <StatusBar style="dark" />
            <SafeAreaView className="flex-1">

                <View className="items-center p-4 rounded-lg mx-4 my-4 bg-gray-500" >
                    <TouchableOpacity onPress={handleGetRandomAyah}>
                        <Text className="text-2xl text-white font-semibold">Get Random Ayah</Text>
                    </TouchableOpacity>
                </View>

                {clicked && randomAyah && (
                    <View className="flex-1" style={{ marginHorizontal: 8 }}>

                        <View className="border-black border-2 items-center p-2 rounded-lg mx-2 my-2">
                            <View className="flex-row m-4">
                                <Text>Juz: {randomAyah.juz_number} </Text>
                                <Text>Pg no: {randomAyah.page_number} </Text>
                                <Text>Id: {randomAyah.id} </Text>
                            </View>
                        </View>

                        <View className="flex-1 border-black p-4 items-center rounded-lg border-2" style={{ marginHorizontal: 8, marginVertical: 8 }}>
                            <ScrollView
                                className="flex-1 "
                                contentContainerStyle={{ flexGrow: 1 }}
                                indicatorStyle="black"
                                showsVerticalScrollIndicator={true}
                            >
                                <Text className=" text-3xl font-light" style={{ lineHeight: 70 }}>{randomAyah.text_uthmani}</Text>
                                {/* Optional: Display other formats */}
                                {/* Display the translation */}
                            </ScrollView>
                        </View>
                    </View>
                )}
            </SafeAreaView>
        </View>
    );
}
