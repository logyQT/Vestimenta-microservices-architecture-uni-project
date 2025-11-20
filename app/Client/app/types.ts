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

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
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
  status: 'Processing' | 'Shipped' | 'Delivered';
}

export interface AuthResponse {
  user: User;
  token: string;
}