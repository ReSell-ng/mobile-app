import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "@/components/Themed";
import { Appbar, Card } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCartStore } from "@/store/cart.store";
import CartItem from "@/components/CartItem";
import { FlashList } from "@shopify/flash-list";
import { formateToCurrency } from "@/services/helper.service";
import { router } from "expo-router";

export default function Cat() {
	const { top } = useSafeAreaInsets();
	const cartSize = useCartStore((st) => st.items).length;
	const items = useCartStore((st) => st.items);
	const selectedItems = useCartStore((st) => st.selectedItems);
	const selectAll = useCartStore((st) => st.selectAll);
	const deSelectAll = useCartStore((st) => st.deSelectAll);
	const totalPrice = useCartStore((st) => st.totalPriceToCheckout);

	const allSelected = items.length == selectedItems.size;

	// function selectAll() {}
	// function deSelectAll() {}

	function handCheckOut() {
		const order_items = Array.from(selectedItems).map((id) => {
			const found = items.find((ad) => ad.id == id);
			return {
				ad_id: found?.id,
				price: found?.price,
				thumbnail: found?.thumbnail,
				quantity: +(found?.quantity || 1),
			};
		});
		// console.log(order_items);
		router.push({
			pathname: "/product/checkout",
			params: {
				totalPrice,
				order_items: JSON.stringify(order_items),
				//@ts-ignore
				fromCart: true,
			},
		});
	}

	return (
		<>
			<ScrollView
				contentContainerStyle={{ paddingTop: 10, paddingBottom: 30 }}
				className=""
			>
				{cartSize <= 0 && (
					<Text className="text-center text-4xl mt-10 text-neutral-500">
						No item in cart
					</Text>
				)}
				{cartSize > 0 &&
					items.map((item, i) => <CartItem key={i} item={item} />)}

				<View className="h-10" />
			</ScrollView>

			{!!selectedItems.size && (
				<View className="absolute bottom-0 right-0 flex flex-row gap-5 justify-around items-center px-5 py-0 pb-3 bg-white w-full dark:bg-neutral-950">
					<Text className="flex flex-row items-center gap-2 py-3">
						<Ionicons
							onPress={allSelected ? deSelectAll : selectAll}
							name={allSelected ? "checkmark-circle" : "radio-button-off"}
							size={26}
							color={"green"}
						/>
						<Text>{"   "} </Text>
						<Text className="text-2xl px-2">All</Text>
					</Text>
					<Text className="text-2xl font-bold my-0">
						{formateToCurrency(totalPrice)}
					</Text>
					<TouchableOpacity
						onPress={handCheckOut}
						activeOpacity={0.8}
						className="bg-green-800 py-4 rounded-2xl px-8"
					>
						<Text className="text-neutral-100  text-center">
							Checkout ({selectedItems.size})
						</Text>
					</TouchableOpacity>
				</View>
			)}
		</>
	);
}
