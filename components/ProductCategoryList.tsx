import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "@/components/Themed";
import ItemCard from "@/components/ItemCard";
import { FlashList } from "@shopify/flash-list";
import { Link, useRouter } from "expo-router";
import { faker } from "@faker-js/faker";
import { Pressable } from "react-native";
import { TItem } from "@/types";

type Prop = {
	ads: TItem[];
	title: string;
};
export default function ProductCategoryList({ ads: items, title }: Prop) {
	const router = useRouter();

	return (
		<View className="my-3 mt-5">
			<View className="flex flex-row justify-between mb-5 mx-3">
				<Text
					type="subtitle"
					className="text-green-900/80 dark:text-green-50/80"
				>
					{title}
				</Text>
				<Pressable
					onPress={() =>
						router.push({
							pathname: "/product/",
							params: { name: title, items: JSON.stringify(items) },
						})
					}
					// @ts-ignore
					className="dark:text-neutral-300"
				>
					<Text>See all</Text>
				</Pressable>
			</View>

			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				{items.map((item, i) => (
					<TouchableOpacity
						key={i}
						activeOpacity={0.7}
						onPress={() => router.navigate(`/product/${item.id}`)}
						className="mr-3"
					>
						<ItemCard item={item} horizontal />
					</TouchableOpacity>
				))}
			</ScrollView>
		</View>
	);
}
