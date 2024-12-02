import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { compute, computed } from "zustand-computed-state";
import { createJSONStorage, persist } from "zustand/middleware";

type TAuthStore = {
	authed: boolean;
	token: string;
	autheenticate(token: string): void;
	logout(): void;
};

const useAuthStore = create<TAuthStore>()(
	persist(
		computed((set, get) =>
			compute<TAuthStore>({
				token: "",
				get authed() {
					// return true;
					return !!this.token;
				},
				autheenticate(token) {
					set((st) => ({ ...st, token }));
				},
				logout() {
					set((st) => ({ ...st, token: "" }));
				},
			})
		),
		{ name: "auth.store", storage: createJSONStorage(() => AsyncStorage) }
	)
);

export default useAuthStore;
