import { decode } from "base64-arraybuffer";
import supabase from "./supabase.service";
import { TResponse } from "@/types";
import * as ImagePicker from "expo-image-picker";
import { generateFileName } from "./helper.service";
import Validation from "./validation";

const Ads = {
	async upload(
		file: ImagePicker.ImagePickerAsset,
		type: "thumbnail" | "feature-image" | "pasport" | "others"
	) {
		const res = await supabase.storage
			.from("images")
			// @ts-ignore
			.upload(generateFileName(file.fileName!, type), file, {
				upsert: true,
				contentType: file.mimeType,
			});

		return res;
	},
	async uploadThumbnail(file: ImagePicker.ImagePickerAsset) {
		const { data, error } = await this.upload(file, "thumbnail");

		if (error) return { ok: false, message: error.message, error };

		return { ok: true, message: "Uploaded", data };
	},

	async uploadFeatureImages(files: ImagePicker.ImagePickerAsset[]) {
		try {
			const uploads = files.map((file) => this.upload(file, "feature-image"));

			const data = await Promise.all(uploads);

			return { ok: true, message: "Uploaded", data: data.map((d) => d.data) };
		} catch (error: any) {
			return { ok: false, message: error.message, error };
		}
	},
	async create(body: ReturnType<typeof Validation.createProduct.validateSync>) {
		//@ts-ignore
		const { data, error } = await supabase.from("ads").insert(body).select("*");

		if (error) return { ok: false, message: error.message, error };

		return {
			ok: true,
			message: "Ads created successfully",
			data,
		};
	},
	async getCategories() {
		const { data, error } = await supabase.from("categories").select(`*`);

		if (error) return { ok: false, message: error.message, error };

		return {
			ok: true,
			message: "Fetched",
			data,
		};
	},
	async getCategoryWithAds() {
		const { data, error } = await supabase
			.from("categories")
			.select(`description,id,title,ads(id,name,price,thumbnail)`);

		if (error) return { ok: false, message: error.message, error };
		// const filtered = 300t;

		// console.log(filtered);
		// console.log(data[0].ads);

		return {
			ok: true,
			message: "Fetched",
			data,
		};
	},
	async getAdsList() {
		const { data, error } = await supabase
			.from("ads")
			.select(` id,name,price,thumbnail,description,categories(*)`);

		if (error) return { ok: false, message: error.message, error };

		return {
			ok: true,
			message: "Fetched",
			data,
		};
	},
	async getAdsDetails(id: string) {
		const { data, error } = await supabase
			.from("ads")
			.select(`*,sellers(*)`)
			.eq("id", id)
			.single();

		if (error) return { ok: false, message: error.message, error };

		return {
			ok: true,
			message: "Fetched",
			data,
		};
	},
	async searchAds(query: string) {
		const { data, error } = await supabase
			.from("ads")
			.select(`id,thumbnail,price,name,description`)
			.match({})
			// .or(
			// 	`name.like.${query},description.like.${query},condition.like.${query},source`
			// );
			.like("name", query)
			.like("description", query)
			.like("condition", query)
			.like("source", query);

		if (error) return { ok: false, message: error.message, error };
		// console.log(data);

		return {
			ok: true,
			message: "Fetched",
			data,
		};
	},
};

export default Ads;
