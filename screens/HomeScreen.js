import React, { useState } from "react";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { fetchRandomAyah } from "../api/quranAPI"; // Ensure the path is correct
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
        } else {
            console.error("Failed to fetch random Ayah.");
        }
    };

    return (
        <View className="flex-1 relative">
            <StatusBar style="dark" />
            <SafeAreaView>
                <View className="mx-4 my-4 relative z-50 rounded-lg bg-gray-500 p-4 items-center">
                    <TouchableOpacity onPress={handleGetRandomAyah}>
                        <Text className="text-2xl font-semibold text-white">Get Random Ayah</Text>
                    </TouchableOpacity>
                </View>

                {clicked && randomAyah && (
                    <View className="mx-2 mt-2">

                        <View className="border-black p-2 items-center rounded-md border-2 mx-2 my-2">
                            <View className="flex-row m-4">
                                <Text>Juz: {randomAyah.juz_number} </Text>
                                <Text>Pg no: {randomAyah.page_number} </Text>
                                <Text>Id: {randomAyah.id} </Text>
                            </View>
                        </View>


                        <View className=" border-black p-2 items-center rounded-md border-2 mx-2 my-2">

                            <ScrollView
                                vertical
                                indicatorStyle="black"
                                showsVerticalScrollIndicator={true}
                            >
                                <Text className="text-3xl mt-1">{randomAyah.text_uthmani}</Text>
                                {/* Optional: Display other formats */}
                                {/* Display the translation */}
                            </ScrollView>
                        </View>


                        {randomAyah.words && randomAyah.words.map(word => (
                            <Text key={word.id}>{word.translation.text}</Text>
                        ))}
                    </View>
                )}

            </SafeAreaView>
        </View>
    );
}
