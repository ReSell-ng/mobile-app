import ItemCard from "@/components/ItemCard";
import { ScrollView, Text, TouchableOpacity, View } from "@/components/Themed";
import { useThemeColor } from "@/hooks/useThemeColor";
import Ads from "@/services/ads.service";
import { TItem } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";

export default function Page() {
	const { query } = useLocalSearchParams();
	const iconColor = useThemeColor({}, "icon");
	const router = useRouter();
	const [result, setResult] = React.useState<TItem[]>([]);

	React.useEffect(() => {
		fetchResult();
	}, [query]);
	async function fetchResult() {
		const res = await Ads.searchAds(query + "".toLowerCase());
		if (!res.ok) return;
		console.log("res", res);
		//@ts-ignore
		setResult(res.data);
	}
	return (
		<ScrollView>
			{!result.length && (
				<View className="m-5 bg-white dark:bg-neutral-800 p-5 rounded-xl">
					<Ionicons
						color={iconColor}
						size={70}
						name="search-circle"
						style={{ alignSelf: "center" }}
					/>
					<Text className="text-xl text-center">No result found</Text>
				</View>
			)}
			{!!result.length && (
				<View className="flex flex-row flex-wrap gap-3 pl-2">
					{result.map((item, i) => (
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
			)}
		</ScrollView>
	);
}
