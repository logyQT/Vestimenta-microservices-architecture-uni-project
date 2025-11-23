import { Product, User, Order } from "../types";
import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Mock Data ---

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Silk Evening Dress",
    description: "A stunning floor-length evening dress crafted from pure silk. Features a delicate drape and a flattering silhouette perfect for formal occasions.",
    category: "For Her",
    price: 899,
    image: "https://images.unsplash.com/photo-1678723357379-d87f2a0ec8ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    images: ["https://images.unsplash.com/photo-1678723357379-d87f2a0ec8ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1083", "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=1083"],
    isNew: true,
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: 2,
    name: "Designer Wool Coat",
    description: "Expertly tailored from premium wool blend. This coat combines warmth with timeless elegance, featuring a structured collar and gold-tone buttons.",
    category: "For Her",
    price: 1299,
    image: "https://images.unsplash.com/photo-1762605135012-56a59a059e60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    isNew: false,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 3,
    name: "Premium Blazer",
    description: "A sharp, modern blazer for the contemporary gentleman. Italian cut, breathable fabric, and impeccable stitching details.",
    category: "For Him",
    price: 799,
    image: "https://images.unsplash.com/photo-1515736076039-a3ca66043b27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    isNew: false,
    sizes: ["48", "50", "52", "54"],
  },
  {
    id: 4,
    name: "Luxury Heels",
    description: "Handcrafted Italian leather heels. Designed for both comfort and style, these stilettos add a touch of glamour to any outfit.",
    category: "Accessories",
    price: 549,
    image: "https://images.unsplash.com/photo-1760331339913-da9637154477?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    isNew: true,
    sizes: ["36", "37", "38", "39", "40"],
  },
  {
    id: 5,
    name: "Leather Handbag",
    description: "Genuine full-grain leather handbag with gold hardware accents. Spacious interior with multiple compartments for organization.",
    category: "Accessories",
    price: 1199,
    image: "https://images.unsplash.com/photo-1682317056294-1970c953cfd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    isNew: false,
    sizes: ["One Size"],
  },
  {
    id: 6,
    name: "Gold Necklace",
    description: "18k Gold plated statement necklace. A bold piece that elevates even the simplest attire.",
    category: "Accessories",
    price: 2499,
    image: "https://images.unsplash.com/photo-1762505464426-7467c051ea76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    isNew: true,
    sizes: ["One Size"],
  },
  {
    id: 7,
    name: "Silk Scarf",
    description: "100% Mulberry silk scarf featuring a custom Vestimenta print. Soft, lightweight, and versatile.",
    category: "Accessories",
    price: 349,
    image: "https://images.unsplash.com/photo-1761660450845-6c3aa8aaf43f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    isNew: false,
    sizes: ["One Size"],
  },
  {
    id: 8,
    name: "Designer Belt",
    description: "Reversible leather belt with the iconic V-buckle in brushed gold. A wardrobe staple.",
    category: "Accessories",
    price: 299,
    image: "https://images.unsplash.com/photo-1664286074240-d7059e004dff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    isNew: false,
    sizes: ["85", "90", "95", "100"],
  },
];

// --- API Services ---

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  products: {
    getAll: async (): Promise<Product[]> => {
      try {
        const response = await client.get("/products");
        return response.data;
      } catch (error) {
        console.error("Error fetching products:", error);
        return [];
      }
    },
    getById: async (id: number): Promise<Product | undefined> => {
      try {
        const response = await client.get("/products", { params: { id } });
        return response.data;
      } catch (error) {
        console.error("Error fetching product by ID:", error);
        return undefined;
      }
    },
    getTrending: async (): Promise<Product[]> => {
      await delay(400);
      return PRODUCTS.filter((p) => p.isNew || p.price > 1000).slice(0, 4);
    },
  },
  auth: {
    login: async (email: string, password: string): Promise<string> => {
      try {
        const response = await client.post("/login", {
          email,
          password,
        });
        return response.data.token;
      } catch (error: any) {
        console.error("Login error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.error || "Login failed");
      }
    },

    register: async (name: string, email: string, password: string): Promise<void> => {
      try {
        // Backend requires confirmPassword. We duplicate password since the UI only has one field.
        await client.post("/register", {
          username: name,
          email,
          password,
          confirmPassword: password,
        });
      } catch (error: any) {
        console.error("Registration error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.error || "Registration failed");
      }
    },

    verify: async (token: string): Promise<User> => {
      try {
        const response = await client.get("/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.user;
      } catch (error: any) {
        throw new Error("Session invalid");
      }
    },

    updateUser: async (token: string, updates: Partial<User>): Promise<User> => {
      try {
        console.log("Updating user with updates:", updates);

        const response = await client.patch("/me", updates, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data.user;
      } catch (error: any) {
        console.error("Profile update error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.error || "Profile update failed");
      }
    },
  },
  orders: {
    list: async (): Promise<Order[]> => {
      await delay(800);
      return [
        {
          id: "ORD-7782-XJ",
          date: "Oct 12, 2024",
          total: 1299,
          status: "Delivered",
          items: [PRODUCTS[1] as any],
        },
        {
          id: "ORD-9921-MC",
          date: "Jan 05, 2025",
          total: 349,
          status: "Processing",
          items: [PRODUCTS[6] as any],
        },
      ];
    },
  },
};
