import { createAdminClient } from "./admin";

export const db = {
  users: {
    findByAuthId: async (authId: string) => {
      const supabase = createAdminClient();
      return await supabase
        .from("users")
        .select("*")
        .eq("authId", authId)
        .single();
    },
    findByEmail: async (email: string) => {
      const supabase = createAdminClient();
      return await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();
    },
    findAll: async () => {
      const supabase = createAdminClient();
      return await supabase
        .from("users")
        .select("*")
        .order("createdAt", { ascending: false });
    },
  },

  // Products
  products: {
    findAll: async () => {
      const supabase = createAdminClient();
      return await supabase
        .from("products")
        .select("*")
        .order("name", { ascending: true });
    },
    findBySku: async (sku: string) => {
      const supabase = createAdminClient();
      return await supabase
        .from("products")
        .select("*")
        .eq("sku", sku)
        .single();
    },
    create: async (data: {
      name: string;
      sku: string;
      description?: string;
      category?: string;
      stock?: number;
    }) => {
      const supabase = createAdminClient();
      return await supabase.from("products").insert(data).select().single();
    },
    update: async (
      id: string,
      data: Partial<{
        name: string;
        description: string;
        category: string;
        stock: number;
      }>
    ) => {
      const supabase = createAdminClient();
      return await supabase
        .from("products")
        .update(data)
        .eq("id", id)
        .select()
        .single();
    },
  },

  // Movements
  movements: {
    findAll: async () => {
      const supabase = createAdminClient();
      return await supabase
        .from("movements")
        .select(
          `
          *,
          product:products(*),
          user:users(*)
        `
        )
        .order("createdAt", { ascending: false });
    },
    create: async (data: {
      type: "ARRIVAL" | "PICKUP" | "DELIVERY";
      quantity: number;
      productId: string;
      userId: string;
      notes?: string;
      vendor?: string;
      order?: string;
      customerName?: string;
      deliveryAddress?: string;
      deliveryCompany?: string;
      deliveryDate?: string;
    }) => {
      const supabase = createAdminClient();
      return await supabase.from("movements").insert(data).select().single();
    },
  },
};
