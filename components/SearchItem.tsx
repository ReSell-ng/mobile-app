import React from "react";
import { ScrollView, Searchbar, Text, TouchableOpacity, View } from "./Themed";
import {
	Button,
	Dialog,
	Modal,
	PaperProvider,
	Portal,
} from "react-native-paper";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Dimensions, KeyboardAvoidingView, Touchable } from "react-native";
import { SUGGESTIONS, getSuggesttions } from "@/services/helper.service";
import { debounce } from "lodash";
import { Ionicons } from "@expo/vector-icons";
import { SearchBar } from "react-native-screens";
import { useRouter } from "expo-router";

export default function SearchItem({ icon = true }: { icon: boolean }) {
	const backgroundColor = useThemeColor({}, "background");
	const router = useRouter();
	const searchRef = React.useRef<SearchBar>(null);
	const iconColor = useThemeColor({}, "icon");
	const [query, setQuery] = React.useState("");
	const [suggestions, setSuggestions] = React.useState<string[]>([]);

	const [visible, setVisible] = React.useState(false);
	React.useEffect(() => {
		const words = getSuggesttions(query.trim(), SUGGESTIONS);
		const debounce = setTimeout(() => {
			if (query.trim() === "") return setSuggestions([]);
			setSuggestions(words);
		}, 200);

		return () => clearTimeout(debounce);
	}, [query]);

	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);

	const { height, width } = Dimensions.get("screen");
	// console.log(suggestions.length);

	function onChangeText(text: string) {
		setVisible(true);
		setQuery(text);
	}
	function onSearchText() {
		hideModal();
		router.push({ pathname: "/product/search-result", params: { query } });
		setQuery("");
	}

	// return <MyComponent />;
	return (
		<>
			<View className="flex flex-row items-center">
				{icon && (
					<>
						{visible ? (
							<Ionicons
								name="arrow-back"
								size={27}
								color={iconColor}
								onPress={hideModal}
							/>
						) : (
							<Ionicons
								name="search"
								size={27}
								color={iconColor}
								onPress={hideModal}
							/>
						)}
					</>
				)}

				<Searchbar
					onFocus={showModal}
					onPress={() => setVisible(true)}
					// icon={() => null}
					onSubmitEditing={onSearchText}
					placeholder="Search"
					value={query}
					// inputStyle={{ padding: 1 }}
					style={{ height: 40 }}
					onChangeText={onChangeText}
					className="bg-transparent px-3 flex flex-1 mx-3 rounded-lg border border-neutral-900/30 dark:border-neutral-100/30"
				/>
			</View>
			{visible && (
				<Portal>
					<TouchableOpacity
						activeOpacity={1}
						onPress={hideModal}
						className="absolute right-0 left-0 bg-transparent"
						style={{ width, height, top: 85 }}
					>
						<View
							className="px-8 py-5 mt-2 rounded-md"
							style={{
								backgroundColor,
								opacity: 0.95,
								maxHeight: height * 0.5,
							}}
						>
							<ScrollView>
								{suggestions.map((word, i) => (
									<Text
										onPress={() => {
											searchRef.current?.focus();
											setQuery(word);
										}}
										className={`py-3 ${
											i !== 0
												? "border-t border-t-neutral-950/20 dark:border-t-neutral-50/20"
												: ""
										}`}
										key={i}
									>
										{word}
									</Text>
								))}
							</ScrollView>
						</View>
					</TouchableOpacity>
				</Portal>
			)}
		</>
	);
}
function MyComponent() {
	const [visible, setVisible] = React.useState(false);

	const showDialog = () => setVisible(true);

	const hideDialog = () => setVisible(false);

	return (
		<View>
			<Button onPress={showDialog}>Show Dialog</Button>
			<Portal>
				<Dialog
					style={{ borderRadius: 0 }}
					visible={visible}
					onDismiss={hideDialog}
					dismissableBackButton
				>
					<Dialog.Title>Alert</Dialog.Title>
					<Dialog.Content>
						<Text>This is simple dialog</Text>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={hideDialog}>Done</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</View>
	);
}
