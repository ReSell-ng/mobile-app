import {
	ScrollView as NScrollView,
	type ViewProps,
	Text as NText,
	View as NView,
	type TextProps,
	type ScrollViewProps,
	StyleSheet,
	type TouchableOpacityProps,
	TouchableOpacity as NTouchableOpacity,
	TextInput,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
	ButtonProps,
	Button as NButton,
	Searchbar as RNPSearchbar,
	SearchbarProps,
	TextInputProps,
} from "react-native-paper";

export type RNPSearchbarProps = TextInputProps & {
	lightColor?: string;
	className?: string;
	darkColor?: string;
};

export function Searchbar(props: RNPSearchbarProps) {
	return <TextInput {...props} />;
}

export type ButtonProp = ButtonProps & {
	lightColor?: string;
	className?: string;
	darkColor?: string;
};

export function Button({
	style,
	lightColor,
	darkColor,
	...otherProps
}: ButtonProp) {
	return <NButton style={[style]} {...otherProps} />;
}

export type TouchableOpacityProp = TouchableOpacityProps & {
	lightColor?: string;
	className?: string;
	darkColor?: string;
};

export function TouchableOpacity({
	style,
	lightColor,
	darkColor,
	...otherProps
}: TouchableOpacityProp) {
	return <NTouchableOpacity style={[style]} {...otherProps} />;
}
export type ThemedViewProps = ViewProps & {
	lightColor?: string;
	className?: string;
	darkColor?: string;
};

export function View({
	style,
	lightColor,
	darkColor,
	...otherProps
}: ThemedViewProps) {
	const backgroundColor = useThemeColor(
		{ light: lightColor, dark: darkColor },
		"background"
	);

	return <NView style={[{}, style]} {...otherProps} />;
}

export type ThemedScrollViewProps = ScrollViewProps & {
	lightColor?: string;
	darkColor?: string;
	className?: string;
};

export function ScrollView({
	style,
	lightColor,
	darkColor,
	...otherProps
}: ThemedScrollViewProps) {
	const backgroundColor = useThemeColor(
		{ light: lightColor, dark: darkColor },
		"background"
	);

	return <NScrollView style={[{}, style]} {...otherProps} />;
}

export type ThemedTextProps = TextProps & {
	lightColor?: string;
	darkColor?: string;
	className?: string;
	type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function Text({
	style,
	lightColor,
	darkColor,
	type = "default",
	...rest
}: ThemedTextProps) {
	const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

	return (
		<NText
			style={[
				type === "default" ? styles.default : undefined,
				type === "title" ? styles.title : undefined,
				type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
				type === "subtitle" ? styles.subtitle : undefined,
				type === "link" ? styles.link : undefined,
				{ color, fontFamily: "RobotoCondence" },
				style,
			]}
			{...rest}
		/>
	);
}

const styles = StyleSheet.create({
	default: {
		fontSize: 16,
		lineHeight: 24,
	},
	defaultSemiBold: {
		fontSize: 16,
		lineHeight: 24,
		fontWeight: "600",
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
		lineHeight: 32,
	},
	subtitle: {
		fontSize: 20,
		fontWeight: "bold",
	},
	link: {
		lineHeight: 30,
		fontSize: 16,
		color: "#0a7ea4",
	},
});
