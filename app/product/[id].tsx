import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
	ScrollView,
	Searchbar,
	Text,
	TouchableOpacity,
	View,
} from "@/components/Themed";
import { Appbar, Avatar, Card, Chip, ToggleButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";
import { TItem } from "@/types";
import { Dimensions, Image, Pressable, ToastAndroid } from "react-native";
import { useCartStore } from "@/store/cart.store";
import { formateToCurrency } from "@/services/helper.service";
import SearchItem from "@/components/SearchItem";
import { Ionicons } from "@expo/vector-icons";
import { CATEGORIES } from "../(tabs)/home";
import ItemCard from "@/components/ItemCard";
import Ads from "@/services/ads.service";

export default function ProductDetails() {
	const [isFetching, setIsFetching] = React.useState(true);
	const cart = useCartStore((st) => st.items);
	const addToCart = useCartStore((st) => st.add);
	const cartHas = useCartStore((st) => st.has);
	const { id } = useLocalSearchParams();
	const router = useRouter();
	const { top, bottom } = useSafeAreaInsets();
	const { width } = Dimensions.get("screen");
	const [previewImage, setPreviewImage] = React.useState("");
	const [isDisabled, setIsDisabled] = React.useState(false);
	const [isFavourite, setIsFavourite] = React.useState(false);
	const [item, setItem] = React.useState<TItem | null>(null);

	const translationX = useSharedValue(0);
	const translationY = useSharedValue(0);
	const prevTranslationX = useSharedValue(0);
	const prevTranslationY = useSharedValue(0);

	React.useEffect(() => {
		fetchAdsDetails();

		async function fetchAdsDetails() {
			const res = await Ads.getAdsDetails(id + "");
			setIsFetching(false);
			if (!res.ok) return setItem(null);

			setItem(res.data);
		}
	}, []);

	React.useEffect(() => {
		isItemInCart();
	}, []);

	const animatedStyles = useAnimatedStyle(() => ({
		transform: [
			{ translateX: translationX.value },
			{ translateY: translationY.value },
		],
	}));

	// const Item: TItem = JSON.parse(item + "");

	function isItemInCart() {
		const isTrue = cartHas(id);
		return setIsDisabled(isTrue);
	}
	function handleAddToCart() {
		const { quantity, ...cartItem } = item;
		//@ts-ignore
		addToCart({ ...cartItem, quantity: 1 });
		ToastAndroid.showWithGravity(
			"Item added to cart",
			ToastAndroid.LONG,
			ToastAndroid.TOP
		);
	}
	function handleCheckout() {
		const order_items: {
			ad_id: string | undefined;
			price: number | null | undefined;
			thumbnail: string | null | undefined;
			quantity: number;
		}[] = [
			{
				ad_id: item?.id,
				price: item?.price,
				thumbnail: item?.thumbnail,
				quantity: 1,
			},
		];
		router.push({
			pathname: "/product/checkout",
			params: {
				totalPrice: item?.price,
				order_items: JSON.stringify(order_items),
			},
		});
	}

	if (isFetching)
		return (
			<View className="mx-3">
				<Text className="h-72 bg-neutral-300" />
				<View className="flex flex-row gap-2 py-2">
					<Text className="rounded-md h-16 flex-1 bg-neutral-300" />
					<Text className="rounded-md h-16 flex-1 bg-neutral-300" />
					<Text className="rounded-md h-16 flex-1 bg-neutral-300" />
					<Text className="rounded-md h-16 flex-1 bg-neutral-300" />
					<Text className="rounded-md h-16 flex-1 bg-neutral-300" />
				</View>
				<Text className="rounded-xl h-8 w-52 my-2 bg-neutral-300" />
				<Text className="rounded-xl h-6 w-60 my-2 bg-neutral-300" />
				<Text className="rounded-xl h-10 w-32 my-2 bg-neutral-300" />
			</View>
		);

	if (!item)
		return (
			<View>
				<Text>Not found</Text>
			</View>
		);

	return (
		<>
			<ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
				<View className="">
					<Pressable
						onPress={() =>
							router.push({
								pathname: "/image-modal",
								params: { uri: previewImage || item.thumbnail },
							})
						}
					>
						<Image
							source={{ uri: previewImage || item.thumbnail! }}
							style={{ borderRadius: 0, height: 350, width }}
							resizeMethod={"auto"}
							resizeMode={"cover"}
						/>
					</Pressable>
					<View className="flex flex-row flex-wrap gap-2 p-2 right-0">
						{[item.thumbnail, ...item.feature_images!].map((it) => (
							<Pressable key={it} onPress={() => setPreviewImage(it!)}>
								<Image
									source={{ uri: it! }}
									style={{
										borderRadius: 10,
										height: 55,
										width: 55,
										borderWidth: previewImage == it ? 2 : 0,
										borderColor: previewImage == it ? "green" : "",
									}}
									resizeMethod={"auto"}
									resizeMode={"cover"}
								/>
							</Pressable>
						))}
					</View>
				</View>

				<View className="">
					<View className="bg-white px-3 py-4">
						<Text className="mb-2 text-4xl">{item.name} </Text>
						<Text className="text-neutral-700 text-xl">
							Product Code:{" "}
							<Text className="text-green-900 font-semibold text-xl">
								{item.code}
							</Text>
						</Text>
						{/* <Text>{data.description}</Text> */}
						<Text className="font-semibold text-4xl mt-3">
							{formateToCurrency(item.price!)}
						</Text>
					</View>
					<View className="flex flex-row items-center gap-3 mt-0.5 bg-white px-3 pb-4 pt-2">
						<Ionicons
							name="heart-circle"
							size={50}
							onPress={() => setIsFavourite(!isFavourite)}
							color={isFavourite ? "red" : "#999"}
						/>

						<Text className="text-2xl text-neutral-400">Save for later</Text>
					</View>

					<View className="bg-white mt-3 px-3 pb-4">
						<Text className="text-2xl font-semibold border-b-2 border-neutral-100 py-3">
							Product Details
						</Text>
						<View className="py-2 space-y-1 pl-4">
							<Text className="text-neutral-700 text-xl">
								Source:{" "}
								<Text className="font-semibold text-xl">{item.source}</Text>
							</Text>
							<Text className="text-neutral-700 text-xl">
								Condition:{" "}
								<Text className="font-semibold text-xl">{item.condition}</Text>
							</Text>
							<Text className="text-neutral-700 text-xl">
								Quantity:{" "}
								<Text className="font-semibold text-xl">{item.quantity}</Text>
							</Text>
						</View>
						<Text className=" font-semibold border-t-2 border-neutral-100 py-3">
							{item.description}
						</Text>
					</View>

					<View className="bg-white mt-3 px-3">
						<Text className="text-2xl py-2 font-semibold border-b-2 border-neutral-100">
							Seller Information
						</Text>
						<View className="flex flex-row items-center gap-3">
							<Ionicons name="person-circle" color={"#556"} size={70} />
							<View className="flex flex-col justify-center">
								<Text className="font-semibold text-3xl">John Michael</Text>
								<Text className="text-xl">2 Years of selling on WMHAS</Text>
							</View>
						</View>
					</View>
					<View className="bg-white mt-3 px-3">
						<Text className="text-2xl py-2 font-semibold border-b-2 border-neutral-100">
							Recommended
						</Text>
						<ScrollView horizontal showsHorizontalScrollIndicator={false}>
							{CATEGORIES[2].ads.map((item, i) => (
								<TouchableOpacity
									key={i}
									activeOpacity={0.7}
									onPress={() => router.push(`/product/${item.id}`)}
									className="mr-3"
								>
									<ItemCard item={item} horizontal />
								</TouchableOpacity>
							))}
						</ScrollView>
					</View>
				</View>
			</ScrollView>
			<View className="absolute bottom-0 pb-3 flex flex-row gap-5 justify-around px-5 bg-white dark:bg-neutral-950">
				<TouchableOpacity
					disabled={isDisabled}
					onPress={handleAddToCart}
					activeOpacity={0.8}
					className="py-4 rounded-2xl flex-1 border border-app-green-dark disabled:border-neutral-600"
				>
					<Text className="text-center text-app-green-dark">Add to cart</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={handleCheckout}
					activeOpacity={0.8}
					className=" bg-app-green dark:bg-app-green-dark py-4 rounded-2xl flex-1"
				>
					<Text className="text-neutral-100  text-center">Buy now</Text>
				</TouchableOpacity>
			</View>
		</>
	);
}
