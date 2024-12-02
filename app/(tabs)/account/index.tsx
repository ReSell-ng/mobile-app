import { Appearance, StyleSheet } from "react-native";
import React, { SVGProps } from "react";
import {
	Button,
	Appbar,
	Card,
	FAB,
	useTheme,
	Avatar,
	TouchableRipple,
	List,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "react-native/Libraries/NewAppScreen";
import { ScrollView, Text, TouchableOpacity, View } from "@/components/Themed";
import { useAuthStore } from "@/store";
import { IconProps } from "@expo/vector-icons/build/createIconSet";
import { useAppearance } from "@/hooks/useAppearance";
import { useThemeStore } from "@/store/theme.store";
import profilePage  from "@/app/profilePage";

const LeftContent = (props: any) => <Avatar.Icon {...props} icon="folder" />;

const BOTTOM_APPBAR_HEIGHT = 80;
const MEDIUM_FAB_HEIGHT = 56;

type TNav = {
	title: string;
	iconName: IconProps<any>["name"];
	onPress(): void;
};

export default function Account() {
	const router = useRouter();
	const logoutUser = useAuthStore((st) => st.logout);
	const isDarkMode = useThemeStore((st) => st.isDarkMode);
	const toggleDarkMode = useThemeStore((st) => st.toggleDarkMode);

	const _handleMore = () => {
		logoutUser();
	};

	const GENERAL: TNav[] = [
		{
			title: "Account information",
			iconName: "person-circle-outline",
			onPress() { router.push('/(tabs)/account/profile') },
		},
		{
			title: "Address information",
			iconName: "location-outline",
			onPress() {},
		},
		{
			title: "Transaction History",
			iconName: "wallet-outline",
			onPress() {
				// toggleDarkMode();
				// Appearance.setColorScheme(isDarkMode ? "light" : "dark");
			},
		},
		{
			title: "Notifications",
			iconName: "notifications-outline",
			onPress() {},
		},
	];
	const SUPPORT: TNav[] = [
		{
			title: "Report an Issue",
			iconName: "warning-outline",
			onPress() {},
		},
		{
			title: "FAQs",
			iconName: "help-circle-outline",
			onPress() {},
		},
	];

	if (false) return <Ionicons name="wallet-outline" />;
	return (
		<>
			<ScrollView
				style={{ paddingHorizontal: "3%" }}
				contentContainerStyle={{ paddingTop: "10%" }}
			>
				<Text className="text-2xl font-bold mb-5">General</Text>
				<View className="mt-2 w-full mb-5 bg-neutral-50 dark:bg-neutral-900 rounded-xl py-2">
					{GENERAL.map(({ title, iconName, onPress }, i) => (
						<TouchableOpacity
							onPress={onPress}
							activeOpacity={0.6}
							key={i}
							className={`${
								i !== 0 ? "border-t-2 border-t-[#eee] dark:border-t-[#000]" : ""
							} pl-3`}
						>
							<>
								<List.Item
									title={title}
									left={() => (
										<Ionicons
											size={20}
											color={isDarkMode ? "#bbb" : "#222"}
											name={iconName}
										/>
									)}
									right={() => (
										<Ionicons
											size={20}
											color={isDarkMode ? "#bbb" : "#222"}
											name="chevron-forward"
										/>
									)}
								/>
							</>
						</TouchableOpacity>
					))}
				</View>

				<Text className="text-2xl font-bold">Support</Text>
				<View className="mt-2 w-full mb-5 bg-neutral-50 dark:bg-neutral-900 rounded-xl py-2">
					{SUPPORT.map(({ title, iconName, onPress }, i) => (
						<TouchableOpacity
							onPress={onPress}
							activeOpacity={0.6}
							key={i}
							className={`${
								i !== 0 ? "border-t-2 border-t-[#eee] dark:border-t-[#000]" : ""
							} pl-3`}
						>
							<>
								<List.Item
									title={title}
									left={() => (
										<Ionicons
											size={20}
											color={isDarkMode ? "#bbb" : "#222"}
											name={iconName}
										/>
									)}
									right={() => (
										<Ionicons
											size={20}
											color={isDarkMode ? "#bbb" : "#222"}
											name="chevron-forward"
										/>
									)}
								/>
							</>
						</TouchableOpacity>
					))}
				</View>

				<TouchableOpacity
					style={{ bottom: 10 }}
					onPress={_handleMore}
					activeOpacity={0.8}
					className="rounded-full mx-2 bg-red-800/90 dark:bg-red-800/60  py-4 px-5 items-center mt-10"
				>
					<Text className="text-neutral-100">Log out</Text>
				</TouchableOpacity>
			</ScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	bottom: {
		backgroundColor: "aquamarine",
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
	},
	fab: {
		position: "absolute",
		right: 16,
	},
});
