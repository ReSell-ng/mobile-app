import React from "react";
import { Text, View } from "./Themed";
import { Image } from "react-native";
import { faker } from "@faker-js/faker";
import { Card } from "react-native-paper";
import { useAppearance } from "@/hooks/useAppearance";
import { useThemeStore } from "@/store/theme.store";
import { formateToCurrency, truncateText } from "@/services/helper.service";
import { TItem } from "@/types";
import { styled } from "nativewind";

const SCard = styled(Card);

const IMAGE =
	"https://fastly.picsum.photos/id/6/500/500.jpg?blur=2&hmac=lRSYUlVxGEy0Tc3sK3f2qdeEBFgkgoQopON-vdVM_sE";

type ItemProps = { horizontal?: boolean; item: TItem };
export default function ItemCard({ horizontal, item }: ItemProps) {
	const isDarkMode = useThemeStore((st) => st.isDarkMode);
	// console.log(IMAGE);

	// const name = truncateText(item.name, 18, true);
	// const description = truncateText(item.description, 45);
	return (
		<SCard
			mode="contained"
			className="bg-white dark:bg-neutral-900 pb-0"
			style={{
				borderRadius: 5,
				shadowColor: "#2222220",
				borderWidth: 0,
			}}
		>
			<Card.Cover
				source={{ uri: item.thumbnail! }}
				resizeMethod={"auto"}
				resizeMode={"cover"}
				style={{ height: 140, margin: 0.5, borderRadius: 0 }}
			/>

			<View
				className="px-2 pb-2 pt-1.5"
				style={{
					marginTop: 1,
					padding: 0,
					...(horizontal ? { width: 160 } : {}),
				}}
			>
				<Text
					// type="defaultSemiBold"
					className="whitespace-nowrap text-lg"
					style={{ lineHeight: 18 }}
				>
					{truncateText(item.name, 18)}
				</Text>
				<Text className="text-xs text-wrap text-neutral-500 dark:text-neutral-400 py-0.5">
					{truncateText(item.description, 33)}
				</Text>
				<Text type="subtitle" className="text-green-900 dark:text-green-300">
					{formateToCurrency(item.price!)}
				</Text>
			</View>
		</SCard>
	);
}
