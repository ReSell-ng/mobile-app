import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { compute, computed } from "zustand-computed-state";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TItem } from "@/types";
import { getCustomTabsSupportingBrowsersAsync } from "expo-web-browser";

type IMap = { [t in string]: { quantity: number } & TItem };
type CartStore = {
	catalogue: IMap;
	items: ({ quantity: number } & TItem)[];
	size: number;
	totalPriceToCheckout: number;
	add(item: { quantity: number } & TItem): void;
	has(id: string): boolean;
	getOne(id: string): { quantity: number } & TItem;
	remove(id: string): void;
	increament(id: string): void;
	deCreament(id: string): void;
	removeBulk(ids: string[]): void;
	selectedItems: Set<string>;
	selectItem(id: string): void;
	deSelectItem(id: string): void;
	selectAll(): void;
	deSelectAll(): void;
	removeSelected(): void;
	// selectedItem: Set<string>;
};

export const useCartStore = create<CartStore>()(
	persist(
		computed((set, get) =>
			compute<CartStore>({
				catalogue: {},
				selectedItems: new Set([]),
				get items() {
					const cart = <IMap>this.catalogue;
					const items = Object.values(cart);
					return items || [];
				},
				get size() {
					return this.items.length || 0;
				},
				get totalPriceToCheckout() {
					let total = 0;
					const _this = this;
					const selected = Array.from(_this.selectedItems);
					const data = selected.map((id, i) => {
						const item = _this.getOne(id);
						return { prices: item.price, quantity: item.quantity };
					});
					for (let i = 0; i < data.length; i++) {
						total += data[i].prices * data[i].quantity;
					}
					return total;
				},
				add(item) {
					const catalogue = get().catalogue;
					// console.log(catalogue);

					catalogue[item.id] = item;
					set((st) => ({ ...st, catalogue }));
				},
				remove(id) {
					const catalogue = get().catalogue;
					delete catalogue[id];
					set((st) => ({ ...st, catalogue }));
				},
				deCreament(id) {
					const item = get().getOne(id);
					if (item.quantity < 2) return;
					item.quantity -= 1;
					get().add(item);
				},
				increament(id) {
					const item = get().getOne(id);
					item.quantity += 1;
					get().add(item);
				},
				removeBulk(ids) {
					if (!ids) return;
					const catalogue = get().catalogue;
					for (let i = 0; i < ids.length; i++) {
						delete catalogue[ids[i]];
					}
					set((st) => ({ ...st, catalogue }));
				},
				getOne(id) {
					const catalogue = get().catalogue;
					return catalogue[id];
				},
				has(id) {
					const catalogue = get().catalogue;

					return !!catalogue[id];
				},
				selectItem(id) {
					const selectedItems = Array.from(get().selectedItems);
					selectedItems.push(id);
					set((st) => ({ ...st, selectedItems: new Set(selectedItems) }));
				},
				deSelectItem(id) {
					const selectedItems = get().selectedItems;
					selectedItems.delete(id);
					set((st) => ({
						...st,
						selectedItems: new Set(Array.from(selectedItems)),
					}));
				},
				selectAll() {
					const all = get().items;
					const selectedItems = new Set(Array.from(all.map((item) => item.id)));
					set((st) => ({ ...st, selectedItems }));
				},
				deSelectAll() {
					const selectedItems = new Set<string>();
					set((st) => ({ ...st, selectedItems }));
				},
				removeSelected() {
					const selectedItems = Array.from(get().selectedItems);

					const catalogue = get().catalogue;
					for (let i = 0; i < selectedItems.length; i++) {
						delete catalogue[selectedItems[i]];
					}
					set((st) => ({ ...st, selectedItems: new Set([]), catalogue }));
				},
			})
		),
		{ name: "@cart", storage: createJSONStorage(() => AsyncStorage) }
	)
);
