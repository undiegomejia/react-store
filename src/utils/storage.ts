import { CartItem } from '../models/types';

const STORAGE_KEYS = {
  CART: 'cart',
  THEME: 'theme',
  USER_PREFERENCES: 'userPreferences'
} as const;

export class StorageManager {
  static getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  }

  static setItem(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  }

  // Cart specific methods with validation
  static getCart(): CartItem[] {
    const cart = this.getItem<CartItem[]>(STORAGE_KEYS.CART, []);
    return this.validateCart(cart);
  }

  static setCart(cart: CartItem[]): void {
    const validCart = this.validateCart(cart);
    this.setItem(STORAGE_KEYS.CART, validCart);
  }

  private static validateCart(cart: CartItem[]): CartItem[] {
    if (!Array.isArray(cart)) return [];
    
    return cart.filter(item => 
      item &&
      typeof item === 'object' &&
      typeof item.productId === 'string' &&
      typeof item.quantity === 'number' &&
      item.quantity > 0
    );
  }

  static clearCart(): void {
    this.removeItem(STORAGE_KEYS.CART);
  }
}

export { STORAGE_KEYS };