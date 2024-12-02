import React from "react";
import { Card, Chip } from "react-native-paper";
import { Text, View } from "./Themed";
import { faker } from "@faker-js/faker";
import { Dimensions } from "react-native";
import { truncateText } from "@/services/helper.service";
import { Ionicons } from "@expo/vector-icons";
import { useCartStore } from "@/store/cart.store";
import { TItem } from "@/types";
import { useThemeColor } from "@/hooks/useThemeColor";
import { formateToCurrency } from "./../services/helper.service";

type Prop = {
	item: TItem;
};
export default function CartItem({ item: { id } }: Prop) {
	const { width } = Dimensions.get("screen");
	const selectedItems = Array.from(useCartStore((st) => st.selectedItems));
	const item = useCartStore((st) => st.getOne)(id);
	const selectItem = useCartStore((st) => st.selectItem);
	const deSelectItem = useCartStore((st) => st.deSelectItem);
	const increament = useCartStore((st) => st.increament);
	const deCreament = useCartStore((st) => st.deCreament);
	const [isSelected, setIsSelected] = React.useState(false);
	const iconColor = useThemeColor({}, "icon");

	React.useEffect(() => {
		setIsSelected(!!selectedItems.find((it) => it == item.id!));
	}, [selectedItems]);

	function selectAt() {
		selectItem(item.id);
		setIsSelected(true);
	}
	function deSelectAt() {
		deSelectItem(item.id);
		setIsSelected(false);
	}

	return (
		<View className="flex flex-row items-center gap-2 bg-white dark:bg-neutral-900  px-2 pt-1 pb-4 mb-3">
			<Ionicons
				onPress={isSelected ? deSelectAt : selectAt}
				name={isSelected ? "checkmark-circle" : "radio-button-off"}
				size={30}
				color={"green"}
			/>
			<View className="flex flex-row gap-3 items-center relative">
				<Card.Cover
					source={{ uri: item.thumbnail! }}
					// width={width 3}
					style={{ flex: 0.8, height: 100 }}
				/>
				<View className="flex-auto">
					<Text className="">{item.name}</Text>
					<Text className="text-neutral-400 my-1">
						{truncateText(item.description, 24)}
					</Text>
					<Text className="bg-green-950 text-xs text-neutral-50 px-3 py-0.5 rounded-full self-start mb-2">
						in stock
					</Text>
					<Text className="text-xl font-semibold">
						{formateToCurrency(item.price)}
					</Text>
				</View>
				<View className="absolute right-10 bottom-0 flex flex-row space-x-2 items-center border border-neutral-500 rounded-lg">
					<Ionicons
						onPress={() => deCreament(item.id)}
						size={25}
						color={iconColor}
						name="remove"
					/>
					<Text className="text-lg">{item?.quantity!}</Text>
					<Ionicons
						onPress={() => increament(item.id)}
						size={25}
						color={iconColor}
						name="add"
					/>
				</View>
			</View>
		</View>
	);
}
