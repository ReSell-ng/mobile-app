import React, { useCallback, useRef, useState } from "react";
import { Pressable, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ActivityIndicator, Modal, Portal } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { faker } from "@faker-js/faker/.";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Button, Text, View } from "@/components/Themed";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useThemeStore } from "@/store/theme.store";
import { useRouter } from "expo-router";
import { values } from "lodash";

type Props = {
	label: string;
	value: ImagePicker.ImagePickerAsset;
	setValue(value: ImagePicker.ImagePickerAsset): void;
};
export default function ThumbnailUpload({
	value: image,
	setValue,
	label,
}: Props) {
	// const [image, setImage] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const isDarkMode = useThemeStore((st) => st.isDarkMode);
	const router = useRouter();
	const [modalVisible, setModalVisible] = React.useState(false);

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
			// setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
			// setValue(`data:image/jpeg;base64,${result.assets[0].base64}`);
			setValue(result.assets[0]);
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
			// setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
			setValue(result.assets[0]);
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
						<Image
							//@ts-ignore
							source={{ uri: image?.uri }}
							style={{ borderRadius: 0, width: "100%", height: 500 }}
							resizeMode="contain"
							resizeMethod="auto"
						/>
					</View>
				</Modal>
			</Portal>
			<View className="flex flex-row items-center py-3 gap-6 my-2">
				{image && (
					<Pressable onPress={showModal}>
						<Animated.Image
							source={{ uri: image.uri || faker.image.urlPicsumPhotos() }}
							// sharedTransitionTag="tag"
							style={{ width: 100, height: 100, borderRadius: 6 }}
						/>
					</Pressable>
				)}

				<Button
					icon={() => (
						<Ionicons
							name="image"
							size={25}
							color={isDarkMode ? "#fff" : "#333"}
						/>
					)}
					className="w-fit bg-white dark:bg-neutral-800"
					disabled={loading}
					onPress={openSheet}
				>
					<Text> {image ? `Change ${label}` : `Upload ${label}`}</Text>
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
