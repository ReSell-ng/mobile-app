import React from "react";
import { FlashList } from "@shopify/flash-list";
import { ScrollView, TouchableOpacity, View } from "@/components/Themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import ItemCard from "@/components/ItemCard";
import { faker } from "@faker-js/faker";
import { TItem } from "@/types";

// const ITEMS = [...Array(10)].map(() => ({
// 	thumbnail: faker.image.urlLoremFlickr(),
// 	name: faker.commerce.productName(),
// 	description: faker.commerce.productDescription(),
// 	price: faker.commerce.price({ symbol: "₦" }),
// 	feature_images: [...Array(faker.number.int({ max: 5, min: 2 }))].map(() =>
// 		faker.image.urlPlaceholder()
// 	),
// 	// price: faker.commerce.p(),
// }));

export default function Page() {
	const router = useRouter();

	const { items: data } = useLocalSearchParams();

	const items: TItem[] = JSON.parse(data + "");

	return (
		<ScrollView className="py-4" contentContainerStyle={{ paddingBottom: 30 }}>
			<View className="flex flex-row flex-wrap gap-3 pl-2">
				{items.map((item, i) => (
					<TouchableOpacity
						key={i}
						activeOpacity={0.7}
						style={{ width: "45%" }}
						onPress={() =>
							router.push({
								//@ts-ignore
								pathname: `/product/${item.name}`,
								params: { title: item.name, item: JSON.stringify(item) },
							})
						}
						className=""
					>
						<ItemCard item={item} />
					</TouchableOpacity>
				))}
			</View>
		</ScrollView>
	);
}
