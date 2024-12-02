import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { PaperProvider } from "react-native-paper";
import { useAuthStore } from "@/store";
import { useThemeStore } from "@/store/theme.store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Appearance } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
Appearance.setColorScheme("light");
export default function RootLayout() {
	const [hasLoaded, setHasLoaded] = useState(false);
	useThemeStore((st) => st.init)();

	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
		RobotoCondence: require("../assets/fonts/RobotoCondensed-Regular.ttf"),
	});

	useEffect(() => {
		if (loaded) {
			setTimeout(() => {
				SplashScreen.hideAsync();
			}, 3000);
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
			<GestureHandlerRootView>
				<PaperProvider>
					<Stack>
						<Stack.Screen name="index" options={{ headerShown: false }} />
						<Stack.Screen
							name="image-modal"
							options={{ presentation: "modal", title: "Feature Image" }}
						/>
						<Stack.Screen name="product" options={{ headerShown: false }} />
						<Stack.Screen name="register" options={{ headerShown: false }} />
						<Stack.Screen name="profilePage" options={{ headerShown: false }} />
						<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
						<Stack.Screen name="+not-found" />
					</Stack>
				</PaperProvider>
			</GestureHandlerRootView>
		</ThemeProvider>
	);
}
