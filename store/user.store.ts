import { TUser } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { compute, computed } from "zustand-computed-state";
import { createJSONStorage, persist } from "zustand/middleware";

interface TAuthStore extends TUser {
	update(user: TUser): void;
	// initUser(): void;
}

const useUserStore = create<TAuthStore>()(
	persist(
		computed((set, get) =>
			compute<TAuthStore>({
				email: "",
				id: "",
				//@ts-ignore
				user_metadata: { role: "BUYER", full_name: "", location: {} },
				update(user) {
					set((st) => ({ ...st, ...user }));
				},
				// async initUser() {
				// 	const res=
				// },
			})
		),
		{ name: "wmhas-user", storage: createJSONStorage(() => AsyncStorage) }
	)
);

export default useUserStore;
