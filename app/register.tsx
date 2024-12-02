import { Alert, Pressable, StyleSheet } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, Redirect, useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "@/components/Themed";
import {
	Button,
	Checkbox,
	Modal,
	Portal,
	TextInput,
	TouchableRipple,
} from "react-native-paper";
import { number, object, string, date } from "yup";
import Validation, { validateInput } from "@/services/validation";
import { Auth } from "@/services/auth.service";
import "@/services/supabase.service";
import supabase from "@/services/supabase.service";
import MapView from "react-native-maps";
import { styled } from "nativewind";
import { Picker } from "@react-native-picker/picker";
import $ from "@/constants/index.json";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TUserRole, UserRole } from "@/types";

const StyledMapView = styled(MapView);
const SButton = styled(Button);

export default function Page() {
	const { top } = useSafeAreaInsets();
	const router = useRouter();
	const [isLoading, setIsLoading] = React.useState(false);
	const [isPassword, setIsPassword] = React.useState(true);
	const [isCPassword, setIsCPassword] = React.useState(true);
	const [agree, setAgree] = React.useState(false);
	const [role, setRole] = React.useState<TUserRole>(UserRole.BUYER);
	const [cities, setCities] = React.useState<string[]>([]);
	const backgroundColor = useThemeColor({}, "background");
	const color = useThemeColor({}, "text");

	// form data
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [full_name, setFullName] = React.useState("");
	const [cPassword, setCPassword] = React.useState("");
	const [display_name, setDisplay_name] = React.useState("");
	const [location, setLocation] = React.useState({
		city: "",
		state: "",
		street: "",
	});
	const [visible, setVisible] = React.useState(false);

	React.useEffect(() => {
		setCities($.STATES.find((st) => st.name === location.state)?.cities || []);
	}, [location.state]);

	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);

	async function handleLogin() {
		if (password !== cPassword)
			return Alert.alert("Invalid input", "Passwords don't match");
		const validate = await validateInput(
			{ email, password, full_name, role, location },
			Validation.signupSchema
		);
		if (!validate.ok) return Alert.alert("Invalid input", validate.err);

		setIsLoading(true);
		const res = await Auth.signUp(validate.data);
		setIsLoading(false);

		if (!res.ok) return Alert.alert("Error: ", res.message);

		Alert.alert(
			res.message,
			"Registration successfull. Proceed to login"
			// "Verification link has been sent to your email. Verify before trying to log in"
		);

		router.replace("/");
	}

	function toggleRole() {
		setRole((prev) => (prev == "BUYER" ? "SELLER" : "BUYER"));
	}

	return (
		<View className="flex-1">
			<View
				className={`bg-green-800  dark:bg-green-950 flex-1 px-4`}
				style={{ paddingTop: top }}
			>
				<Text className="text-xl mt-2.5 mb-3 font-semibold text-white">
					Join FUTOresell
				</Text>
				<Text className="text-4xl font-bold text-white">Sign up</Text>
				{/* <View>
					<Text className="text-green-200 font-bold text-5xl my-5 text-center">
						WMHAS
					</Text>
				</View> */}
			</View>
			<Portal>
				<Modal
					dismissableBackButton
					visible={visible}
					onDismiss={hideModal}
					// contentContainerStyle={containerStyle}
				>
					<View className="h-[90%]">
						<StyledMapView
							followsUserLocation
							googleRenderer="LEGACY"
							importantForAccessibility="auto"
							accessible
							zoomTapEnabled
							userLocationPriority="high"
							userLocationUpdateInterval={5000}
							className="w-full h-full"
						/>
					</View>
				</Modal>
			</Portal>

			<View className="bg-neutral-100 dark:bg-neutral-950 h-[80%] rounded-t-[60] -mt-20 py-10 pt-[10%] px-3">
				<ScrollView
					className="px-2 space-y-6"
					showsVerticalScrollIndicator={false}
				>
					<View>
						<Text className="mb-2">Full name</Text>
						<TextInput
							// label={"Full name"}
							outlineStyle={{ borderRadius: 15 }}
							value={full_name}
							onChangeText={setFullName}
							keyboardType="default"
							textContentType="name"
							mode="outlined"
							placeholder="Enter full name"
						/>
					</View>
					<View>
						<Text className="mb-2">Email</Text>
						<TextInput
							// label={"Email"}
							outlineStyle={{ borderRadius: 15 }}
							value={email}
							onChangeText={setEmail}
							keyboardType="email-address"
							textContentType="emailAddress"
							mode="outlined"
							placeholder="Enter email"
						/>
					</View>
					<View>
						<Text className="mb-2">Password</Text>
						<TextInput
							outlineStyle={{ borderRadius: 15 }}
							secureTextEntry={isPassword}
							// label="Password"
							value={password}
							onChangeText={setPassword}
							textContentType="password"
							mode="outlined"
							placeholder="Enter 4 or more characters"
							right={
								<TextInput.Icon
									onPress={() => setIsPassword((prv) => !prv)}
									icon={isPassword ? "eye" : "eye-off"}
								/>
							}
						/>
					</View>
					<View>
						<Text className="mb-2">Confirm Password</Text>
						<TextInput
							outlineStyle={{ borderRadius: 15 }}
							secureTextEntry={isCPassword}
							// label="Confirm Password"
							value={cPassword}
							onChangeText={setCPassword}
							textContentType="password"
							mode="outlined"
							placeholder="Re-type password"
							right={
								<TextInput.Icon
									onPress={() => setIsCPassword((prv) => !prv)}
									icon={isCPassword ? "eye" : "eye-off"}
								/>
							}
						/>
					</View>
					<View className="flex flex-row items-center">
						<Checkbox
							status={role === "SELLER" ? "checked" : "unchecked"}
							onPress={toggleRole}
						/>
						<Text onPress={toggleRole}>Register as a Seller?</Text>
					</View>

					<View>
						<Text className="mb-2">State Address</Text>
						<Picker
							mode="dialog"
							focusable
							style={{
								backgroundColor,
								color,
								borderTopWidth: 2,
								borderRadius: 10,
							}}
							// selectionColor={"green"}
							selectedValue={location.state}
							onValueChange={(state, itemIndex) =>
								setLocation((prv) => ({ ...prv, state }))
							}
						>
							{$.STATES.map(({ name }, i) => (
								<Picker.Item key={i} label={name} value={name} />
							))}
						</Picker>
					</View>
					<View>
						<Text className="mb-2">City Address</Text>
						<Picker
							mode="dialog"
							focusable
							style={{
								backgroundColor,
								color,
								borderTopWidth: 2,
								borderRadius: 10,
							}}
							// selectionColor={"green"}
							selectedValue={location.city}
							onValueChange={(city, itemIndex) =>
								setLocation((prv) => ({ ...prv, city }))
							}
						>
							{cities.map((name, i) => (
								<Picker.Item key={i} label={name} value={name} />
							))}
						</Picker>
					</View>
					<View>
						<Text className="mb-2">Street Address</Text>
						<TextInput
							// label={"Street Address"}
							outlineStyle={{ borderRadius: 15 }}
							value={location.street}
							onChangeText={(street) =>
								setLocation((prv) => ({ ...prv, street }))
							}
							keyboardType="default"
							textContentType="name"
							mode="outlined"
							placeholder="Address"
						/>
					</View>
					<View className="flex flex-row items-center">
						<Checkbox
							status={agree ? "checked" : "unchecked"}
							onPress={() => {
								setAgree(!agree);
							}}
						/>
						<Text onPress={() => setAgree(!agree)}>
							i agree to the terms and conditions
						</Text>
					</View>
					<SButton
						className="bg-app-green-dark "
						contentStyle={{
							paddingVertical: 10,
						}}
						loading={isLoading}
						onPress={handleLogin}
						disabled={!agree || isLoading}
						// className="rounded-xl bg-blue-800 py-2 px-5 items-center text-white w-full"
						textColor="#fff"
					>
						<Text className="text-white"> Sign up</Text>
					</SButton>

					<Text className="self-center">
						Already have account?{" "}
						<Link href={"/"} className="text-blue-500">
							Login
						</Link>
					</Text>
				</ScrollView>
			</View>
		</View>
	);
}
