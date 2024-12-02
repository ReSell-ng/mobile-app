import {
	Image,
	StyleSheet,
	Platform,
	RefreshControl,
	Dimensions,
} from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ScrollView, Text, View } from "@/components/Themed";
import ProductCategoryList from "@/components/ProductCategoryList";
import { AnimatedFAB, Card, Chip } from "react-native-paper";
import React from "react";
import ItemCard from "@/components/ItemCard";
import { FlashList } from "@shopify/flash-list";
import { faker } from "@faker-js/faker";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { generateProductCode } from "@/services/helper.service";
import { TCategory, TImage, TItem } from "@/types";
import $ from "@/constants/index.json";
import useAdsStore from "@/store/ads.store";
import useUserStore from "@/store/user.store";
import Ads from "@/services/ads.service";
import { styled } from "nativewind";

export const CATEGORIES = [...Array(13)].map(() => ({
	id: faker.string.uuid(),
	description: "",
	title: faker.commerce.product(),
	created_at: "",
	// name: faker.commerce.product(),
	ads: [...Array(faker.number.int({ min: 6, max: 14 }))].map(() => ({
		id: faker.string.uuid(),
		thumbnail: faker.image.urlLoremFlickr({ height: 300, width: 300 }),
		name: faker.commerce.productName(),
		description: faker.commerce.productDescription(),
		// price: faker.commerce.price({ symbol: "₦" }),
		price: +faker.commerce.price(),
		feature_images: [...Array(faker.number.int({ max: 6, min: 2 }))].map(() =>
			faker.image.urlPicsumPhotos()
		),
		code: generateProductCode(),
		source: faker.helpers.arrayElement($.SOURCES).split("(")[0].trim(), // price: faker.commerce.p(),
		condition: faker.helpers
			.arrayElement($.ITEM_CONDITIONS)
			.split("(")[0]
			.trim(), // price: faker.commerce.p(),
		quantity: "5 Tons",
	})),
})) as TCategory[];

export default function HomeScreen() {
	useAdsStore.getState().init();
	const [isExtended, setIsExtended] = React.useState(true);
	const [isRefreshing, setIsRefreshing] = React.useState(true);
	const router = useRouter();
	const darkGreen = useThemeColor({}, "darkGreen");
	const isSeller = useUserStore((st) => st.user_metadata).role === "SELLER";
	const isIOS = Platform.OS === "ios";
	const [categories, setCategories] = React.useState<TCategory[]>([]);
	const user = useUserStore((st) => st.user_metadata);

	console.log(user);

	const { width } = Dimensions.get("screen");
	const hero1 = require("@/assets/images/hero-1.jpg");
	const hero2 = require("@/assets/images/hero-2.webp");
	const hero3 = require("@/assets/images/hero-3.jpg");

	const SChip = styled(Chip);

	React.useEffect(() => {
		fetchAds();
	}, []);
	async function fetchAds() {
		setIsRefreshing(true);
		const res = await Ads.getAdsList();
		setIsRefreshing(false);
		if (!res.ok) return;
		// console.log(res.data);
		//@ts-ignore
		setCategories(groupByCategory(res.data));
	}

	// console.log("categories", categories);

	const onScroll = ({ nativeEvent }: any) => {
		const currentScrollPosition =
			Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

		setIsExtended(currentScrollPosition <= 0);
	};
	return (
		<>
			<ScrollView
				onScroll={onScroll}
				refreshControl={
					<RefreshControl refreshing={isRefreshing} onRefresh={fetchAds} />
				}
				className=""
			>
				<ScrollView horizontal className="bg-white py-6">
					{[hero1, hero2, hero3].map((img, i) => (
						<Card.Cover
							style={{ width: width * 0.8, marginHorizontal: 6 }}
							key={i}
							resizeMode="cover"
							source={img}
						/>
					))}
				</ScrollView>
				<View className="px-3 mb-6">
					<Text className="text-2xl text-app-green-dark font-semibold mb-4">
						Categories
					</Text>
					<ScrollView horizontal showsHorizontalScrollIndicator={false}>
						{categories.map(({ title }, i) => (
							<SChip key={i} className={`${i !== 0 ? "mx-2" : ""}`}>
								{title}
							</SChip>
						))}
					</ScrollView>
				</View>
				<View className="px-3">
					{categories.map(({ ads, title }, i) => (
						<ProductCategoryList key={i} title={title!} ads={ads} />
					))}
				</View>
			</ScrollView>
			{isSeller && (
				<AnimatedFAB
					color="#ccc"
					icon={"plus"}
					label={"Add Item"}
					extended={isExtended}
					onPress={() => router.push("/product/create")}
					visible
					animateFrom={"right"}
					style={[styles.fabStyle, { backgroundColor: darkGreen }]}
				/>
			)}
		</>
	);
}
const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
	},
	fabStyle: {
		bottom: 16,
		right: 16,
		position: "absolute",
	},
});

function groupByCategory(data: any[]) {
	const groups = {}; // Object to store grouped data

	for (const item of data) {
		const categoryTitle = item.categories.title;
		const categoryId = item.categories.id;
		// @ts-expect-error
		if (!groups[categoryTitle]) {
			// @ts-expect-error
			groups[categoryTitle] = {
				title: categoryTitle,
				id: categoryId,
				ads: [],
			};
		}

		// @ts-expect-error
		groups[categoryTitle].ads.push(item);
	}

	return Object.values(groups); // Return an array of grouped objects
}
