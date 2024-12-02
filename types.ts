import {
	Session,
	User,
	UserMetadata,
	WeakPassword,
} from "@supabase/supabase-js";
import { Database } from "./services/db.types";
export const UserRole = {
	BUYER: "BUYER",
	SELLER: "SELLER",
} as const;

export type TUserRole = (typeof UserRole)[keyof typeof UserRole];
export type TResponse<D = unknown> =
	| {
			ok: false;
			message: string;
			error: unknown;
	  }
	| { ok: true; message: string; data?: D };

type Table = Database["public"]["Tables"];

export type TLocation = Table["location"]["Row"] & {};
export type TUser = User & {
	id: string;
	email: string;
	// password: string;
	user_metadata: {
		full_name: string;
		location: { city: string; state: string; street: string };
		role: TUserRole;
	};
};
export type TBuyer = Table["buyers"]["Row"] & { location: TLocation };
/* 

 full_name: string | null;
    id: string;
    location_id: number | null;
    phone: string | null;
    user_id: string;
*/
export type TSeller = Table["sellers"]["Row"] & { location: TLocation };
/* 
 display_name: string | null;
    full_name: string | null;
    id: string;
    location_id: number | null;
    phone: string | null;
    user_id: string | null;
*/
export type TItem = Table["ads"]["Row"] & {
	source: string;
	sellers: TSeller;
	quantity: string;
	categories: TCategory;
};
export type TOrderItem = {
	id: string;
	item_id: string;
	order_id: string;
	quantity: number;
};
export type TOrder = {
	id: string;
	items: TItem[];
	reference: string;
	total_amount: number;
	buyer_id: string;
	created_at: Date | string;
};

export type TCategory = Table["categories"]["Row"] & {
	ads: TItem[];
};

export type TloginRes = {
	user: User;
	session: Session;
	weakPassword?: WeakPassword | undefined;
};

export type TImage = {
	uri: string;
	type: string;
	fileName: string;
};
