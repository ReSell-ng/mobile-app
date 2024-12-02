import React from "react";
import { Appearance } from "react-native";

export function useAppearance() {
	const [isDarkMode, setIsDarkMode] = React.useState(
		Appearance.getColorScheme() == "dark"
	);

	React.useEffect(() => {
		Appearance.setColorScheme(isDarkMode ? "dark" : "light");
	}, [isDarkMode]);

	function toggleDarkMode() {
		setIsDarkMode((pre) => !pre);
	}

	return { isDarkMode, toggleDarkMode };
}
