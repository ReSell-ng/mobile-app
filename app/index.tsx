import { Alert, Pressable, StyleSheet } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, Redirect, useRouter } from "expo-router";
import { Button, Text, TouchableOpacity, View } from "@/components/Themed";
import { TextInput, TouchableRipple } from "react-native-paper";
import { number, object, string, date } from "yup";
import Validation, { validateInput } from "@/services/validation";
import { Auth } from "@/services/auth.service";
import { useAuthStore } from "@/store";
import { sleep } from "@/services/helper.service";
import { useAppearance } from "@/hooks/useAppearance";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "@/store/theme.store";
import useUserStore from "@/store/user.store";

export default function Page() {
	const { top } = useSafeAreaInsets();
	const router = useRouter();
	const [isLoading, setIsLoading] = React.useState(false);
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [isPassword, setIsPassword] = React.useState(true);
	const isAuthenticated = useAuthStore((st) => st.authed);
	const authenticateUser = useAuthStore((st) => st.autheenticate);
	const updateUser = useUserStore((st) => st.update);
	const isDarkMode = useThemeStore((st) => st.isDarkMode);
	const toggleDarkMode = useThemeStore((st) => st.toggleDarkMode);
	async function handleLogin() {
		const validate = await validateInput(
			{ email, password },
			Validation.loginSchema
		);
		if (!validate.ok) return Alert.alert("Invalid input", validate.err);
		setIsLoading(true);

		const res = await Auth.login(validate.data);
		// console.log(JSON.stringify(res, null, 2));
		setIsLoading(false);
		if (!res.ok) return Alert.alert("Error: ", res.message);

		//@ts-ignore
		updateUser(res.data?.user);
		authenticateUser(res.data?.session.access_token!);
	}

	if (isAuthenticated) return <Redirect href={"/(tabs)/home"} />;

	return (
		<View className="flex-1">
			<View
				className={`bg-green-800  dark:bg-green-950 flex-1 px-4`}
				style={{ paddingTop: top }}
			>
				<Text className="text-xl mt-10 mb-3 font-semibold text-white">
					Welcome Back,
				</Text>
				<Text className="text-4xl font-bold text-white">Login</Text>
			</View>
			<View className="bg-neutral-100 dark:bg-neutral-950 h-[70%] rounded-t-[60] -mt-20 py-10 pt-[20%] px-3">
				<View className="px-2 space-y-6">
					<TextInput
						label={"Email"}
						outlineStyle={{ borderRadius: 15 }}
						value={email}
						onChangeText={setEmail}
						keyboardType="email-address"
						textContentType="emailAddress"
						mode="outlined"
						placeholder="Enter email"
					/>
					<TextInput
						outlineStyle={{ borderRadius: 15 }}
						secureTextEntry={isPassword}
						label="Password"
						value={password}
						onChangeText={setPassword}
						textContentType="password"
						mode="outlined"
						placeholder="Enter passwoord"
						right={
							<TextInput.Icon
								onPress={() => setIsPassword((prv) => !prv)}
								icon={isPassword ? "eye" : "eye-off"}
							/>
						}
					/>
					<Text className="self-end mb-5">
						<Text
							//href={"/register"}
							className="text-blue-500"
						>
							Forgot password?
						</Text>
					</Text>
					<Button
						className="bg-app-green-dark "
						contentStyle={{
							paddingVertical: 10,
						}}
						loading={isLoading}
						onPress={handleLogin}
						disabled={isLoading}
						// className="rounded-xl bg-blue-800 py-2 px-5 items-center text-white w-full"
						textColor="#fff"
					>
						<Text className="text-white">Login</Text>
					</Button>

					<Text className="self-center">
						Don't have an account?{" "}
						<Link href={"/register"} className="text-blue-500">
							Sign up
						</Link>
					</Text>
				</View>
			</View>
		</View>
	);
}
