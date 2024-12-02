import { ObjectSchema, array, number, object, string } from "yup";

const Validation = {
	loginSchema: object({
		email: string().email().required(),
		password: string().required(),
	}),
	signupSchema: object({
		email: string().email().required(),
		// name: string().required(),
		password: string().required(),
		role: string().required(),
		full_name: string().required(),
		location: object({}).required(),
	}),
	createProduct: object({
		name: string().required("Please enter title"),
		description: string().required("Please enter description"),
		category_id: string().required("Please select category"),
		price: number().required("Please ebter price"),
		code: string().required("Please enter code"),
		condition: string().required("Please select condition"),
		source: string().required("Please select source"),

		thumbnail: string().optional(),
		feature_images: array().of(string()).optional(),
	}),
};

export async function validateInput<T = unknown>(
	input: T,
	// @ts-ignore
	schema: ObjectSchema<T>
): Promise<{ ok: true; data: T } | { ok: false; err: any }> {
	try {
		const data = await schema.validate(input);
		// @ts-ignore
		return { ok: true, data };
	} catch (err) {
		// @ts-ignore
		return { ok: false, err: err.message };
	}
}

export default Validation;
