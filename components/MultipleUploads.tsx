import React, { useCallback, useRef, useState } from "react";
import { Dimensions, Pressable, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ActivityIndicator, Modal, Portal } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { IconProps } from "react-native-paper/lib/typescript/components/MaterialCommunityIcon";
import { faker } from "@faker-js/faker/.";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Button, Text, View } from "@/components/Themed";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useThemeStore } from "@/store/theme.store";
import { useRouter } from "expo-router";

type Props = {
	value: ImagePicker.ImagePickerAsset[];
	setValue(value: ImagePicker.ImagePickerAsset[]): void;
};

export default function MultipleUploads({ value: images, setValue }: Props) {
	// const [images, setImages] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const isDarkMode = useThemeStore((st) => st.isDarkMode);
	const { width } = Dimensions.get("screen");
	const router = useRouter();
	const [modalVisible, setModalVisible] = React.useState(false);
	const [prevImage, setPrevImage] = React.useState("");

	const showModal = () => setModalVisible(true);
	const hideModal = () => setModalVisible(false);

	const bottomSheetRef = useRef<BottomSheetModal>(null);
	const iconColor = useThemeColor({}, "icon");
	const bgColor = useThemeColor({}, "background");

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			// aspect: [1, 1],
			quality: 1,
			base64: true,
		});

		if (!result.canceled) {
			//@ts-ignore
			setValue((pr) => [...pr, result.assets[0]]);

			// handleImageLoaded(`data:image/jpeg;base64,${result.assets[0].base64}`);
		}
	};
	const pickCameraImage = async () => {
		await ImagePicker.requestCameraPermissionsAsync();
		let result = await ImagePicker.launchCameraAsync({
			cameraType: ImagePicker.CameraType.back,
			allowsEditing: true,
			// aspect: [1, 1],
			quality: 0.5,
			base64: true,
		});

		if (!result.canceled) {
			//@ts-ignore
			setValue((pr) => [...pr, result.assets[0]]);

			// handleImageLoaded(`data:image/jpeg;base64,${result.assets[0].base64}`);
		}
	};

	async function handleImageLoaded(image: string) {
		return;

		// console.log(updateRes);
	}

	const closeSheet = () => {
		bottomSheetRef?.current?.close();
	};
	const openSheet = () => {
		bottomSheetRef?.current?.present();
		// descInputRef.current.focus();
	};

	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				appearsOnIndex={0}
				disappearsOnIndex={-1}
				{...props}
			/>
		),
		[]
	);
	const pickers = [
		{
			title: "galary",
			onPress: pickImage,
			icon: "image",
		},
		{
			title: "camera",
			onPress: pickCameraImage,
			icon: "camera",
		},
	];

	if (loading)
		<ActivityIndicator
			size={150}
			style={{ position: "absolute", top: 0, left: 0 }}
		/>;

	return (
		<>
			<Portal>
				<Modal
					visible={modalVisible}
					onDismiss={hideModal}
					contentContainerStyle={{ backgroundColor: bgColor }}
				>
					<View className="flex flex-row items-center">
						<Animated.Image
							//@ts-ignore
							// sharedTransitionTag="img"
							source={{ uri: prevImage }}
							style={{ borderRadius: 0, width: "100%", height: 500 }}
							resizeMode="contain"
							resizeMethod="auto"
						/>
					</View>
				</Modal>
			</Portal>
			<View className="flex flex-row flex-wrap items-center py-3 gap-6">
				{images &&
					images.map((img, i) => (
						<Pressable
							key={i}
							onPress={() => {
								setPrevImage(img.uri);
								showModal();
							}}
						>
							<Animated.Image
								source={{ uri: img.uri }}
								// sharedTransitionTag="img"
								style={{
									width: width * 0.19,
									height: width * 0.19,
									borderRadius: 6,
								}}
							/>
						</Pressable>
					))}
				{/* <Text className="flex flex-col">
					<Text>
						<Ionicons
							name="add"
							size={30}
							color={isDarkMode ? "#fff" : "#333"}
						/>
					</Text>
					<Text>add featured images</Text>
				</Text> */}
				<Button
					icon={() => (
						<Ionicons
							name="add"
							size={30}
							color={isDarkMode ? "#fff" : "#333"}
						/>
					)}
					contentStyle={{
						paddingVertical: 20,
						paddingHorizontal: 10,
					}}
					className="bg-white dark:bg-neutral-800 rounded-xl flex flex-row justify-center items-center"
					disabled={images.length > 4}
					onPress={openSheet}
				>
					{""}
				</Button>
			</View>

			<BottomSheetModal
				// enablePanDownToClose
				ref={bottomSheetRef}
				backdropComponent={renderBackdrop}
				index={0}
				snapPoints={["20%"]}
				containerStyle={{ zIndex: 1000 }}
				backgroundStyle={{
					borderRadius: 0,
				}}
			>
				<Text style={{ textAlign: "center", fontSize: 20, fontWeight: "600" }}>
					Choose Upload method
				</Text>

				<View
					style={{
						flex: 1,
						flexDirection: "row",
						justifyContent: "space-evenly",
						alignItems: "center",
					}}
				>
					{pickers.map(({ icon, onPress }, key) => (
						<Pressable
							key={key}
							onPress={() => {
								closeSheet();
								onPress();
							}}
						>
							<Ionicons name={icon as any} color={iconColor} size={70} />
						</Pressable>
					))}
				</View>
			</BottomSheetModal>
		</>
	);
}

type TProps = {
	imageUrl: string;
};
