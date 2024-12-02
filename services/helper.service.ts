import _ from "lodash";
import { ITEM_CONDITIONS, SOURCES } from "@/constants/index.json";

export async function sleep(num: number = 500) {
	return new Promise((r) => setTimeout(r, num));
}

export function truncateText(
	text: string,
	length: number,
	title: boolean = false
) {
	if (text.length < length) return text;
	let ellipses = "";
	let subText = "";
	const words = text.split(" ");

	subText = text.slice(0, length);
	if (text.length > length) ellipses = "...";
	return subText + ellipses;
}
function generateRandomString(length = 6) {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	return _.sampleSize(characters, length).join("");
}

export function formateToCurrency(num: number) {
	return _.toNumber(num).toLocaleString("en-NG", {
		style: "currency",
		currency: "NGN",
	});
}
export function generateFileName(
	name: string,
	type: "feature-image" | "thumbnail" | "pasport" | "others"
) {
	return `${type}-${generateRandomString(6)}-${name}`;
}

export function generateProductCode(prefix: string = "WI", len: number = 8) {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	const code = Array(len)
		.fill(null)
		.map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
		.join("");

	return `${prefix}-${code}`;
}

function extractSuggestion(array: string[]) {
	const extracts: string[] = [];
	array.forEach((el) => {
		extracts.push(el.split(" (")[0]);
		extracts.push(...el.replaceAll(")", "").split(": ")[1].split(", "));
	});

	return extracts;
}

export function getSuggesttions<T extends string>(input: T, sources: T[]) {
	const suggestions: T[] = [];
	const inputWords = input.split(" ");
	const lastWord = inputWords[inputWords.length - 1];

	for (const source of sources) {
		const sourceWords = source.split(" ");
		for (const word of sourceWords) {
			if (word.toLowerCase().includes(lastWord.toLowerCase())) {
				suggestions.push(source);
			}
		}
	}

	return suggestions;
}

export const SUGGESTIONS = [
	...extractSuggestion(SOURCES),
	...extractSuggestion(ITEM_CONDITIONS),
	...SOURCES,
	...ITEM_CONDITIONS,
];
