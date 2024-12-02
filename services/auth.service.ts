import { TResponse, TloginRes } from "@/types";
import Validation from "./validation";
import supabase from "./supabase.service";

export const Auth = {
	async login({
		email,
		password,
	}: ReturnType<typeof Validation.loginSchema.validateSync>) {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) return { ok: false, message: error.message, error };
		return { ok: true, message: "Logged in succesfully", data };
	},
	async signUp({
		email,
		password,
		full_name,
		location,
		role,
	}: ReturnType<typeof Validation.signupSchema.validateSync>) {
		const { data, error } = await supabase.auth.admin.createUser({
			email,
			password,
			email_confirm: true,
			user_metadata: { full_name, location, role },
		});

		if (error) return { ok: false, message: error.message, error };

		return { ok: true, message: "Registered succesfully", data };
	},
	async getUserProfile() {},
	async createSellerProfile() {},
};
