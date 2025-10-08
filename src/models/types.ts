export enum UserRole {
  SELLER = 'SELLER',
  BUYER = 'BUYER',
  ADMIN = 'ADMIN'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  // Seller specific fields
  storeInfo?: {
    storeName: string;
    description: string;
  };
  // Buyer specific fields
  shippingAddresses?: {
    id: string;
    address: string;
    isDefault: boolean;
  }[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  sellerId: string;
  discountPercentage?: number;
  discountValidUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  date: Date;
  sellerResponse?: {
    response: string;
    date: Date;
  };
}

export interface Order {
  id: string;
  buyerId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: Date;
  discountApplied?: {
    code: string;
    percentage: number;
  };
}

export interface OrderItem {
  productId: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export interface DiscountCode {
  code: string;
  percentage: number;
  validUntil: Date;
  minPurchase?: number;
  maxUses?: number;
  currentUses: number;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}

export interface SignInFormData {
  email: string;
  password: string;
  rememberMe: boolean;  
};