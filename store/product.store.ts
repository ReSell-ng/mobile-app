import { TItem } from "@/types";

type ProductStore = {
	items: TItem[];
	getByCategory(name: string): TItem[];
	getBySeller(displayName: string): TItem[];
};
const useProductStore = {};
