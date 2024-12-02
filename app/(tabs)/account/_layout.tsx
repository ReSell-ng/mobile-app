import React from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "@/components/Themed";
import { Appbar, TouchableRipple } from "react-native-paper";
import SearchItem from "@/components/SearchItem";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";

export default function Layout() {
    return (
        <Stack screenOptions={{  }}>
            <Stack.Screen
                name="index"
                options={{
					title: "Account",
				
					headerShown: true,
					headerTitle() {
						const router = useRouter();
						const iconColor = useThemeColor({}, "icon");

						const _goBack = () => console.log("Went back");
						const _handleSearch = () => console.log("Searching");

						const _handleMore = () => {
							router.navigate("/");
						};

						return (
							<View className="flex flex-row items-center p-[3%] pt-4 justify-between w-full">
								{/* <Appbar.BackAction onPress={_goBack} /> */}
								<Text className="text-4xl">Account</Text>
								<View className="flex flex-row items-center justify-end">
									{/* <Appbar.Action icon="magnify" onPress={_handleSearch} /> */}
									<TouchableRipple>
										<Ionicons size={20} color={iconColor} name="settings" />
									</TouchableRipple>
								</View>
							</View>
						);
					},
				}}
            />

            <Stack.Screen
                name="profile" 
                options={{
                    // headerShown: false,
title:'Profile'                }}
            />

        </Stack>
    );
}
