export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	graphql_public: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Args: {
					operationName?: string;
					query?: string;
					variables?: Json;
					extensions?: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	public: {
		Tables: {
			ads: {
				Row: {
					category_id: string | null;
					code: string | null;
					condition: string | null;
					created_at: string;
					description: string | null;
					feature_images: string[] | null;
					id: string;
					name: string | null;
					price: number | null;
					quantity: string | null;
					seller_id: string | null;
					source: string | null;
					thumbnail: string | null;
					user_id: string | null;
					weight: string | null;
				};
				Insert: {
					category_id?: string | null;
					code?: string | null;
					condition?: string | null;
					created_at?: string;
					description?: string | null;
					feature_images?: string[] | null;
					id?: string;
					name?: string | null;
					price?: number | null;
					quantity?: string | null;
					seller_id?: string | null;
					source?: string | null;
					thumbnail?: string | null;
					user_id?: string | null;
					weight?: string | null;
				};
				Update: {
					category_id?: string | null;
					code?: string | null;
					condition?: string | null;
					created_at?: string;
					description?: string | null;
					feature_images?: string[] | null;
					id?: string;
					name?: string | null;
					price?: number | null;
					quantity?: string | null;
					seller_id?: string | null;
					source?: string | null;
					thumbnail?: string | null;
					user_id?: string | null;
					weight?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "ads_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "items_category_id_fkey";
						columns: ["category_id"];
						isOneToOne: false;
						referencedRelation: "categories";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "items_seller_id_fkey";
						columns: ["seller_id"];
						isOneToOne: false;
						referencedRelation: "sellers";
						referencedColumns: ["id"];
					}
				];
			};
			buyers: {
				Row: {
					created_at: string;
					full_name: string | null;
					id: string;
					location_id: number | null;
					phone: string | null;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					full_name?: string | null;
					id?: string;
					location_id?: number | null;
					phone?: string | null;
					user_id: string;
				};
				Update: {
					created_at?: string;
					full_name?: string | null;
					id?: string;
					location_id?: number | null;
					phone?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "buyer_location_id_fkey";
						columns: ["location_id"];
						isOneToOne: false;
						referencedRelation: "location";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "buyer_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: true;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			categories: {
				Row: {
					created_at: string;
					description: string | null;
					id: string;
					title: string | null;
				};
				Insert: {
					created_at?: string;
					description?: string | null;
					id?: string;
					title?: string | null;
				};
				Update: {
					created_at?: string;
					description?: string | null;
					id?: string;
					title?: string | null;
				};
				Relationships: [];
			};
			location: {
				Row: {
					city: string | null;
					country: string | null;
					created_at: string;
					id: number;
					lattitude: number | null;
					longitude: number | null;
					state: string | null;
					street: string | null;
				};
				Insert: {
					city?: string | null;
					country?: string | null;
					created_at?: string;
					id?: number;
					lattitude?: number | null;
					longitude?: number | null;
					state?: string | null;
					street?: string | null;
				};
				Update: {
					city?: string | null;
					country?: string | null;
					created_at?: string;
					id?: number;
					lattitude?: number | null;
					longitude?: number | null;
					state?: string | null;
					street?: string | null;
				};
				Relationships: [];
			};
			order_items: {
				Row: {
					ad_id: string | null;
					created_at: string;
					id: number;
					order_id: string | null;
					quantity: number | null;
				};
				Insert: {
					ad_id?: string | null;
					created_at?: string;
					id?: number;
					order_id?: string | null;
					quantity?: number | null;
				};
				Update: {
					ad_id?: string | null;
					created_at?: string;
					id?: number;
					order_id?: string | null;
					quantity?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "order_items_ad_id_fkey";
						columns: ["ad_id"];
						isOneToOne: false;
						referencedRelation: "ads";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "order_items_order_id_fkey";
						columns: ["order_id"];
						isOneToOne: false;
						referencedRelation: "orders";
						referencedColumns: ["id"];
					}
				];
			};
			orders: {
				Row: {
					buyer_id: string | null;
					created_at: string;
					id: string;
					reference: string | null;
					total_amount: number | null;
					user_id: string | null;
				};
				Insert: {
					buyer_id?: string | null;
					created_at?: string;
					id?: string;
					reference?: string | null;
					total_amount?: number | null;
					user_id?: string | null;
				};
				Update: {
					buyer_id?: string | null;
					created_at?: string;
					id?: string;
					reference?: string | null;
					total_amount?: number | null;
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "Order_buyer_id_fkey";
						columns: ["buyer_id"];
						isOneToOne: true;
						referencedRelation: "buyers";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "orders_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			sellers: {
				Row: {
					created_at: string;
					display_name: string | null;
					full_name: string | null;
					id: string;
					location_id: number | null;
					phone: string | null;
					user_id: string | null;
				};
				Insert: {
					created_at?: string;
					display_name?: string | null;
					full_name?: string | null;
					id?: string;
					location_id?: number | null;
					phone?: string | null;
					user_id?: string | null;
				};
				Update: {
					created_at?: string;
					display_name?: string | null;
					full_name?: string | null;
					id?: string;
					location_id?: number | null;
					phone?: string | null;
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "sellers_location_id_fkey";
						columns: ["location_id"];
						isOneToOne: false;
						referencedRelation: "location";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "sellers_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: true;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema["Tables"] & PublicSchema["Views"])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
				Database[PublicTableNameOrOptions["schema"]]["Views"])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
			Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
	  }
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
			PublicSchema["Views"])
	? (PublicSchema["Tables"] &
			PublicSchema["Views"])[PublicTableNameOrOptions] extends {
			Row: infer R;
	  }
		? R
		: never
	: never;

export type TablesInsert<
	PublicTableNameOrOptions extends
		| keyof PublicSchema["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
	  }
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
	? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
			Insert: infer I;
	  }
		? I
		: never
	: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends
		| keyof PublicSchema["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
	  }
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
	? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
			Update: infer U;
	  }
		? U
		: never
	: never;

export type Enums<
	PublicEnumNameOrOptions extends
		| keyof PublicSchema["Enums"]
		| { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
	? PublicSchema["Enums"][PublicEnumNameOrOptions]
	: never;
