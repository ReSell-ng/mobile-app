import { createClient } from "@supabase/supabase-js";
import { Database } from "./db.types";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = "https://gowjgqrlhpbguqabgxca.supabase.co";
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_SERVICE_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
	auth: {
		storage: AsyncStorage,
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
	},
});

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener("change", (state) => {
	if (state === "active") {
		supabase.auth.startAutoRefresh();
	} else {
		supabase.auth.stopAutoRefresh();
	}
});

export default supabase;