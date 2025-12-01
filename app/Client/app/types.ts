export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  images?: string[];
  isNew?: boolean;
  sizes?: string[];
}

export interface LogEntry {
  level: string;
  message: string;
  source: string;
  timestamp: number;
  metadata?: any;
}

export interface LogFilters {
  level?: string;
  source?: string;
  limit?: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  created_at: string;
  password?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: "Processing" | "Shipped" | "Delivered";
}

export interface AuthResponse {
  user: User;
  token: string;
}
