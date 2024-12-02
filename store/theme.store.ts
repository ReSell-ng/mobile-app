import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { compute, computed } from "zustand-computed-state";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeStore = {
	isDarkMode: boolean;
	init(): void;
	toggleDarkMode(): void;
};

export const useThemeStore = create<ThemeStore>()(
	persist(
		computed((set, get) =>
			compute<ThemeStore>({
				isDarkMode: Appearance.getColorScheme() == "dark",
				init() {
					const isDarkMode = Appearance.getColorScheme() == "dark";
					set((st) => ({ ...st, isDarkMode }));
				},
				toggleDarkMode() {
					const isDark = get().isDarkMode;
					Appearance.setColorScheme(isDark ? "light" : "dark");
					set((st) => ({ ...st, isDarkMode: !isDark }));
				},
			})
		),
		{ name: "@theme", storage: createJSONStorage(() => AsyncStorage) }
	)
);
