import { Alert, Button, TextInput, ToastAndroid } from "react-native";
import { ScrollView, Text, TouchableOpacity, View } from "@/components/Themed";
import React, { useEffect } from "react";
import { WebView } from "react-native-webview";
import { useUserStore } from "@/store";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Paystack } from "react-native-paystack-webview";
import { PayStackRef } from "react-native-paystack-webview/production/lib/types";
import { faker } from "@faker-js/faker/.";
import { FlashList } from "@shopify/flash-list";
import { Card } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { formateToCurrency } from "@/services/helper.service";

const PAYSTACK_SECRETE_KEY = process.env.EXPO_PUBLIC_PAYSTACK_SECRETE_KEY!;
const PAYSTACK_PUBLIC_KEY = process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY!;

export default function Checkout() {
	const email = useUserStore((st) => st.email);
	const router = useRouter();
	const [authrization_url, setAuthrization_url] = React.useState("");
	const { totalPrice, order_items: oi, fromCart } = useLocalSearchParams();

	const paystackWebViewRef = React.useRef<PayStackRef>();
	const order_items: {
		ad_id: string | undefined;
		price: number | null | undefined;
		thumbnail: string | null | undefined;
	}[] = JSON.parse(oi as string);
	return (
		<>
			<ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
				<View>
					<Paystack
						//@ts-ignore
						ref={paystackWebViewRef}
						paystackKey={PAYSTACK_PUBLIC_KEY}
						amount={+totalPrice * 100}
						billingEmail={email}
						currency="NGN"
						activityIndicatorColor="green"
						onCancel={(e) => {
							ToastAndroid.show("Payment Cancelled", ToastAndroid.LONG);
						}}
						onSuccess={(res) => {
							ToastAndroid.show("Payment processed", ToastAndroid.LONG);
						}}
					/>
				</View>

				<View className="bg-white mt-3 px-3 pb-2">
					<Text className="text-2xl font-semibold border-b-2 border-neutral-100/60 py-2">
						Select Delivery Address
					</Text>
					<View className="bg-white mt-3 px-3 pb-4">
						{/* <View className="flex flex-row items-center gap-3 mt-0.5 bg-white px-3 pb-4 pt-2"> */}
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={() => router.navigate("/(tabs)/cart")}
							className="border border-app-green-dark/40 p-3 rounded-xl mb-6 flex flex-row items-center justify-center"
						>
							<Ionicons size={25} name="add-circle-outline" />
							<Text className="text-center font-semibold">
								{"    "}Add New Address
							</Text>
						</TouchableOpacity>
						{/* </View> */}
						{[1, 2].map((_, i) => (
							<View
								key={i}
								className="border border-neutral-600 p-4 mb-4 rounded-lg"
							>
								<View className="flex flex-row gap-3 mb-2">
									<Ionicons color={"#333"} size={20} name="briefcase-outline" />
									<Text className="text-base font-semibold">Work</Text>
								</View>
								<Text className="text-sm">Divine Joseph Cosmos</Text>
								<Text className="text-sm">+234-813-703-6749</Text>
								<Text className="text-xs mt-1">
									Office 115/116, by St. Paul's Anglican Church, Douglas Road,
									Owerri, Imo State
								</Text>
							</View>
						))}
					</View>
					<View className="flex flex-row justify-between border-t-2 border-neutral-100/60 py-2">
						<View className="flex flex-row items-center gap-3 mt-0.5 bg-white px-3 pb-4 pt-2">
							<Ionicons
								name="checkmark-circle"
								size={29}
								// onPress={() => setIsFavourite(!isFavourite)}
								color={"#999"}
							/>

							<Text className="text-xl ">Switch to self-pick up?</Text>
						</View>
					</View>
				</View>
				<View className="bg-white mt-3 px-3 pb-4">
					<Text className="text-2xl font-semibold border-b-2 border-neutral-100/60 py-2">
						ORDER DETAILS
					</Text>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						className="py-2 space-y-1 flex flex-row gap-3"
					>
						{order_items.map(({ ad_id, price, thumbnail }, i) => (
							<View key={i}>
								<Card.Cover
									source={{ uri: thumbnail! }}
									style={{ height: 70, width: 80 }}
								/>
								<Text className="text-neutral-950/50 text-lg font-bold">
									{formateToCurrency(price!)}
								</Text>
							</View>
						))}
					</ScrollView>
					{!!fromCart && (
						<View className="flex flex-row justify-between border-t-2 border-neutral-100/60 py-2">
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={() => router.navigate("/(tabs)/cart")}
								className="border border-app-green-dark py-1.5 px-3 rounded-xl"
							>
								<Text> Modify Cart</Text>
							</TouchableOpacity>
						</View>
					)}
				</View>
				<View className="bg-white mt-3 px-3 pb-4">
					<Text className="text-2xl font-semibold border-b-2 border-neutral-100/60 py-2">
						Summary
					</Text>
					<View className="py-2 space-y-1">
						<View className="flex flex-row justify-between">
							<Text className="text-neutral-700 text-lg">Sub total:</Text>
							<Text className="text-neutral-700 text-xl">
								{formateToCurrency(+totalPrice)}
							</Text>
						</View>
						<View className="flex flex-row justify-between">
							<Text className="text-neutral-700 text-lg">WMHAS Fee:</Text>
							<Text className="text-neutral-700 text-xl">
								{formateToCurrency(1459)}
							</Text>
						</View>
					</View>
					<View className="flex flex-row justify-between border-t-2 border-neutral-100/60 py-2">
						<Text className="text-neutral-700 text-xl font-bold">Total:</Text>
						<Text className="text-neutral-700 text-xl font-bold">
							{formateToCurrency(1459 + +totalPrice)}
						</Text>
					</View>
				</View>
			</ScrollView>

			<View className="absolute bottom-0 pb-3 flex flex-row gap-5 justify-around px-5 bg-white dark:bg-neutral-950">
				<TouchableOpacity
					className="bg-app-green dark:bg-app-green-dark py-4 rounded-2xl flex-1"
					onPress={() => paystackWebViewRef?.current?.startTransaction()}
				>
					<Text className="text-white text-center">
						Continue to Payment ({formateToCurrency(1459 + +totalPrice)})
					</Text>
				</TouchableOpacity>
			</View>
		</>
	);
}
