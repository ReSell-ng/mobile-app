import {
	Button,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput } from "react-native-paper";
import MultipleUploads from "@/components/MultipleUploads";
import ThumbnailUpload from "@/components/ImageUplaod";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
	Alert,
	Dimensions,
	KeyboardAvoidingView,
	ToastAndroid,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ITEM_CONDITIONS, SOURCES } from "@/constants/index.json";
import {
	generateFileName,
	generateProductCode,
} from "@/services/helper.service";
import { useRouter } from "expo-router";
import Validation, { validateInput } from "@/services/validation";
import Ads from "@/services/ads.service";
import * as ImagePicker from "expo-image-picker";
import { IMAGE_PUBLIC_PATH } from "@/constants/index.json";
import { useCategoryStore } from "@/store";

export default function Page() {
	const router = useRouter();
	const CATEGORIES = useCategoryStore((st) => st.categories);
	const [isCreating, setIsCreating] = React.useState(false);
	const [name, setName] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [thumbnail, setThumbnail] =
		React.useState<ImagePicker.ImagePickerAsset | null>(null);
	const [price, setPrice] = React.useState("");
	const [condition, setCondition] = React.useState("");
	const [source, setSource] = React.useState("");
	const [weight, setWeight] = React.useState("");
	const [feature_images, setFeature_images] = React.useState<
		ImagePicker.ImagePickerAsset[]
	>([]);
	const [category_id, setCategory_id] = React.useState("");
	const [quantity, setQuantity] = React.useState("");
	const backgroundColor = useThemeColor({}, "background");
	const color = useThemeColor({}, "text");

	const { width } = Dimensions.get("screen");

	async function handleProductCreate() {
		setIsCreating(true);
		const data = {
			name,
			description,
			category_id,
			price: +price,
			code: generateProductCode("WMSITM"),
			condition,
			source,
			thumbnail: "",
			feature_images: [],
		};
		if (!thumbnail) {
			setIsCreating(false);
			return Alert.alert("Invalid input", "Please upload an image");
		}

		const validate = await validateInput(data, Validation.createProduct);
		if (!validate.ok) {
			setIsCreating(false);
			return Alert.alert("Invalid input", validate.err);
		}

		const uploadRes = await Ads.uploadThumbnail(thumbnail);
		if (uploadRes.ok) data.thumbnail = IMAGE_PUBLIC_PATH + uploadRes.data?.path;
		// console.log(uploadRes);
		if (!!feature_images.length) {
			const multiUploadRes = await Ads.uploadFeatureImages(feature_images);

			if (multiUploadRes.ok)
				data.feature_images = multiUploadRes.data?.map(
					(url) => `${IMAGE_PUBLIC_PATH}${url?.path}`
				)!;
		}

		const res = await Ads.create(data);
		setIsCreating(false);

		console.log(res);

		if (!res.ok) return Alert.alert("Error: ", res.message);

		ToastAndroid.show("Ad created successfully", ToastAndroid.LONG);
		router.back();
	}
	return (
		<BottomSheetModalProvider>
			<ScrollView
				className="px-3 pt-6 flex-1"
				contentContainerStyle={{ paddingBottom: 110 }}
			>
				<View className="space-y-5">
					<View>
						<Text className="mb-2">Category</Text>
						<Picker
							mode="dialog"
							focusable
							// numberOfLines={1}
							style={{
								backgroundColor,
								color,
							}}
							itemStyle={{
								backgroundColor,
								color,
								borderTopWidth: 2,
								borderTopColor: color,
							}}
							selectionColor={"green"}
							selectedValue={category_id}
							onValueChange={(itemValue, itemIndex) =>
								setCategory_id(itemValue)
							}
						>
							{CATEGORIES.map((src, i) => (
								<Picker.Item
									key={i}
									color={color}
									style={{
										backgroundColor,
									}}
									label={src.title!}
									value={src.id}
								/>
							))}
						</Picker>
					</View>
					<View>
						<Text className="mb-2">Item name</Text>
						<TextInput
							// label={"Item name"}
							style={{ backgroundColor }}
							outlineStyle={{ borderRadius: 15 }}
							value={name}
							onChangeText={setName}
							keyboardType="ascii-capable"
							// textContentType=""
							mode="flat"
							placeholder="Eg. (used aluminum sheet)"
						/>
					</View>
					<ThumbnailUpload
						label={"Thumbnail"}
						value={thumbnail!}
						setValue={setThumbnail}
					/>
					<View>
						<Text className="mb-2">Feature images (max of 5)</Text>
						<MultipleUploads
							value={feature_images}
							setValue={setFeature_images}
						/>
					</View>
					<View>
						<Text className="mb-2">Description</Text>
						<TextInput
							// label={"Description"}
							style={{ backgroundColor }}
							outlineStyle={{ borderRadius: 1 }}
							value={description}
							onChangeText={setDescription}
							keyboardType="ascii-capable"
							multiline
							mode="flat"
							placeholder="Describe the features of your the item"
						/>
					</View>
					<View>
						<Text className="mb-2">Price</Text>
						<TextInput
							// label={"Price"}
							style={{ backgroundColor }}
							outlineStyle={{ borderRadius: 15 }}
							value={price}
							onChangeText={setPrice}
							keyboardType="number-pad"
							mode="flat"
							placeholder="0.00"
						/>
					</View>
					<View>
						<Text className="mb-2">Quantity</Text>
						<TextInput
							// label={"Price"}
							style={{ backgroundColor }}
							outlineStyle={{ borderRadius: 15 }}
							value={quantity}
							onChangeText={setQuantity}
							keyboardType="default"
							mode="flat"
							placeholder="eg. 1 Ton, 24kg, 10 pcs"
						/>
					</View>
					<View>
						<Text className="mb-2">Condition</Text>
						<Picker
							mode="dialog"
							focusable
							numberOfLines={2}
							style={{
								backgroundColor,
								color,
							}}
							itemStyle={{
								backgroundColor,
								color,
								borderTopWidth: 2,
								borderTopColor: color,
							}}
							selectionColor={"green"}
							selectedValue={condition}
							onValueChange={(itemValue, itemIndex) => setCondition(itemValue)}
						>
							{ITEM_CONDITIONS.map((src, i) => (
								<Picker.Item
									key={i}
									color={color}
									style={{
										backgroundColor,
									}}
									label={src}
									value={src}
								/>
							))}
						</Picker>
					</View>
					<View>
						<Text className="mb-2">Source</Text>
						<Picker
							mode="dialog"
							focusable
							numberOfLines={2}
							style={{
								backgroundColor,
								color,
							}}
							itemStyle={{
								backgroundColor,
								color,
								borderTopWidth: 2,
								borderTopColor: color,
							}}
							selectionColor={"green"}
							selectedValue={source}
							onValueChange={(itemValue, itemIndex) => setSource(itemValue)}
						>
							{SOURCES.map((src, i) => (
								<Picker.Item
									key={i}
									color={color}
									style={{
										backgroundColor,
									}}
									label={src}
									value={src}
								/>
							))}
						</Picker>
					</View>
					{/* <View>
							<Text className="mb-2">Category</Text>
							<Picker
								mode="dialog"
								focusable
								numberOfLines={2}
								style={{
									backgroundColor,
									color,
								}}
								itemStyle={{
									backgroundColor,
									color,
									borderTopWidth: 2,
									borderTopColor: color,
								}}
								selectionColor={"green"}
								selectedValue={category_id}
								onValueChange={(itemValue, itemIndex) =>
									setCategory_id(itemValue)
								}
							>
								{SOURCES.map((src, i) => (
									<Picker.Item
										key={i}
										color={color}
										style={{
											backgroundColor,
										}}
										label={src}
										value={src}
									/>
								))}
							</Picker>
						</View> */}
				</View>
			</ScrollView>
			<View className="absolute bottom-5 flex flex-row justify-center px-5 dark:bg-neutral-950 w-full">
				<Button
					disabled={isCreating}
					loading={isCreating}
					onPress={handleProductCreate}
					className="active:bg-app-green/50 dark:active:bg-app-green-dark/50 bg-app-green dark:bg-app-green-dark"
					contentStyle={{
						paddingVertical: 10,
						width: width * 0.9,
					}}
					textColor="#fff"
				>
					Save and Upload
				</Button>
			</View>
		</BottomSheetModalProvider>
	);
}
