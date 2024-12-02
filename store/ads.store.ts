import Ads from "@/services/ads.service";
import { TCategory, TItem } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { compute, computed } from "zustand-computed-state";
import { createJSONStorage, persist } from "zustand/middleware";

type TCategoryStore = {
	categories: TCategory[];
	categoyWithAds: TCategory[];
	ads: TItem[];

	init(): void;
};

const useCategoryStore = create<TCategoryStore>()(
	computed((set, get) =>
		compute<TCategoryStore>({
			categories: [],
			categoyWithAds: [],
			ads: [],
			async init() {
				const cats = await Ads.getCategories();
				// console.log(cats);

				if (cats.ok) {
					//@ts-ignore
					set((st) => ({ ...st, categories: cats.data }));
				}
			},
		})
	)
);

export default useCategoryStore;
