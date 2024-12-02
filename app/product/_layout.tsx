import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "@/components/Themed";
import { Appbar } from "react-native-paper";
import SearchItem from "@/components/SearchItem";

export default function Layout() {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					headerTitle(props) {
						const { name } = useLocalSearchParams();

						return <Text type="subtitle">{name}</Text>;
					},
				}}
			/>
			<Stack.Screen
				name="create"
				options={{
					// headerShown: false,
					title: "Creat an ad",
					presentation: "modal",
				}}
			/>
			<Stack.Screen
				name="search-result"
				options={{
					// headerShown: false,
					title: "Search result",
					presentation: "modal",
					headerTitle(props) {
						return <SearchItem icon={false} />;
					},
				}}
			/>
			<Stack.Screen
				name="[id]"
				options={{
					title: "Details",
				}}
			/>
			<Stack.Screen
				name="checkout"
				options={{
					title: "Checkout",
				}}
			/>
		</Stack>
	);
}
