import { Dimensions } from "react-native";
import React from "react";
import { Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { View } from "@/components/Themed";

export default function Modal() {
	const { uri } = useLocalSearchParams();
	const { width } = Dimensions.get("screen");
	console.log(uri);

	return (
		<View className="flex flex-row items-center">
			<Image
				//@ts-ignore
				source={{ uri }}
				style={{ borderRadius: 0, width, height: 500 }}
				resizeMode="contain"
				resizeMethod="auto"
			/>
		</View>
	);
}
