import { Redirect, Tabs, router, useRouter } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Searchbar, Text, View } from "@/components/Themed";
import {
	Appbar,
	Badge,
	Button,
	Card,
	Dialog,
	Portal,
	TouchableRipple,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthStore } from "@/store";
import { useCartStore } from "@/store/cart.store";
import SearchItem from "@/components/SearchItem";
const logo = require("@/assets/images/logo-2.png");

export default function TabLayout() {
	const colorScheme = useColorScheme();

	const isAuthenticated = useAuthStore((st) => st.authed);

	if (!isAuthenticated) return <Redirect href={"/"} />;

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
				headerShown: true,
				headerTitle: "",
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: "Home",
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? "home" : "home-outline"}
							color={color}
						/>
					),
					headerTitle() {
						return (
							<View className="flex flex-row items-center p-[3%] pt-4 justify-between w-full">
								<Card.Cover
									source={logo}
									style={{
										height: 40,
										width: 100,
										backgroundColor: "transparent",
									}}
									resizeMode="contain"
								/>
								<Ionicons
									size={30}
									onPress={() => router.push("/product/search-result")}
									name="search"
								/>
							</View>
						);
					},
				}}
			/>

			<Tabs.Screen
				name="cart"
				options={{
					title: "Catalogue",
					// headerShown: false,

					headerTitle() {
						const cartSize = useCartStore((st) => st.items).length;
						const removeSelected = useCartStore((st) => st.removeSelected);
						const selectedItems = Array.from(
							useCartStore((st) => st.selectedItems)
						);
						const [visible, setVisible] = React.useState(false);

						const showDialog = () => setVisible(true);

						const hideDialog = () => setVisible(false);

						function handleDelete() {
							hideDialog();
							removeSelected();
						}

						return (
							<View>
								<Portal>
									<Dialog visible={visible} onDismiss={hideDialog}>
										<Dialog.Title>Confirm</Dialog.Title>
										<Dialog.Content>
											<Text>Are you sure you want to delete these items</Text>
										</Dialog.Content>
										<Dialog.Actions>
											<Button mode="text" onPress={hideDialog}>
												Cancel
											</Button>
											<Button
												mode="text"
												textColor="red"
												onPress={handleDelete}
											>
												Yes
											</Button>
										</Dialog.Actions>
									</Dialog>
								</Portal>
								<View className="flex flex-row items-center p-[3%] pt-4 justify-between w-full">
									{/* <Appbar.BackAction onPress={_goBack} /> */}
									<Text className="text-2xl font-bold">Cart({cartSize})</Text>
									<View className="flex flex-row items-center justify-end">
										<TouchableRipple onPress={showDialog}>
											<Ionicons size={20} color={"red"} name="trash" />
										</TouchableRipple>
									</View>
								</View>
							</View>
						);
					},
					tabBarIcon: ({ color, focused }) => {
						const cartSize = useCartStore((st) => st.items).length;
						return (
							<View>
								<TabBarIcon
									name={focused ? "cart" : "cart-outline"}
									color={color}
								/>
								{cartSize > 0 && (
									<Badge style={{ position: "absolute", top: -8, right: -16 }}>
										{cartSize}
									</Badge>
								)}
							</View>
						);
					},
				}}
			/>

			<Tabs.Screen
				name="account"
				options={{
					title: "Account",
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? "person" : "person-outline"}
							color={color}
						/>
					),
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
		</Tabs>
	);
}
