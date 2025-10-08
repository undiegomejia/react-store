import { StorageManager, STORAGE_KEYS } from './storage';
import { CartItem } from '../models/types';

describe('StorageManager', () => {
  // Set up and clear localStorage before each test
  beforeEach(() => {
    // Create a fresh mock of localStorage for each test
    const store: { [key: string]: string } = {};
    const localStorageMock = {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value.toString();
      }),
      clear: jest.fn(() => {
        Object.keys(store).forEach(key => delete store[key]);
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
      length: 0,
      key: jest.fn((index: number) => Object.keys(store)[index] || null)
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
  });

  describe('Basic Storage Operations', () => {
    it('should get item with default value when storage is empty', () => {
      const defaultValue = { test: true };
      const result = StorageManager.getItem('test-key', defaultValue);
      expect(result).toEqual(defaultValue);
    });

    it('should successfully set and get an item', () => {
      const testData = { test: 'value' };
      StorageManager.setItem('test-key', testData);
      const result = StorageManager.getItem('test-key', null);
      expect(result).toEqual(testData);
    });

    it('should remove item from storage', () => {
      StorageManager.setItem('test-key', 'value');
      StorageManager.removeItem('test-key');
      const result = StorageManager.getItem('test-key', null);
      expect(result).toBeNull();
    });

    it('should handle JSON parse errors gracefully', () => {
      // Manually set invalid JSON
      localStorage.setItem('test-key', 'invalid-json');
      const defaultValue = { default: true };
      const result = StorageManager.getItem('test-key', defaultValue);
      expect(result).toEqual(defaultValue);
    });
  });

  describe('Cart Operations', () => {
    const validCartItem: CartItem = {
      productId: 'test-id',
      quantity: 1
    };

    it('should get empty cart when no cart exists', () => {
      const cart = StorageManager.getCart();
      expect(cart).toEqual([]);
    });

    it('should successfully set and get cart items', () => {
      const testCart = [validCartItem];
      StorageManager.setCart(testCart);
      const retrievedCart = StorageManager.getCart();
      expect(retrievedCart).toEqual(testCart);
    });

    it('should filter out invalid cart items', () => {
      const invalidItem = { 
        productId: 123, // Should be string
        quantity: 'invalid' // Should be number
      };
      const testCart = [validCartItem, invalidItem as any];
      StorageManager.setCart(testCart);
      const retrievedCart = StorageManager.getCart();
      expect(retrievedCart).toEqual([validCartItem]);
    });

    it('should clear cart', () => {
      StorageManager.setCart([validCartItem]);
      StorageManager.clearCart();
      const cart = StorageManager.getCart();
      expect(cart).toEqual([]);
    });

    it('should filter out items with invalid quantities', () => {
      const itemWithZeroQuantity = { ...validCartItem, quantity: 0 };
      const itemWithNegativeQuantity = { ...validCartItem, quantity: -1 };
      const testCart = [
        validCartItem,
        itemWithZeroQuantity,
        itemWithNegativeQuantity
      ];
      
      StorageManager.setCart(testCart);
      const retrievedCart = StorageManager.getCart();
      expect(retrievedCart).toEqual([validCartItem]);
    });
  });

  describe('Error Handling', () => {
    const validCartItem: CartItem = {
      productId: 'test-id',
      quantity: 1
    };

    it('should handle localStorage being unavailable', () => {
      // Mock localStorage.getItem to throw an error
      const mockGetItem = jest.fn(() => {
        throw new Error('Storage unavailable');
      });
      Object.defineProperty(window, 'localStorage', {
        value: { getItem: mockGetItem },
        writable: true
      });

      const result = StorageManager.getCart();
      expect(result).toEqual([]);
      expect(mockGetItem).toHaveBeenCalled();
    });

    it('should handle localStorage.setItem throwing quota exceeded error', () => {
      // Mock localStorage.setItem to throw a quota exceeded error
      const mockSetItem = jest.fn(() => {
        throw new Error('QuotaExceededError');
      });
      Object.defineProperty(window, 'localStorage', {
        value: { setItem: mockSetItem },
        writable: true
      });

      const consoleSpy = jest.spyOn(console, 'error');
      StorageManager.setCart([validCartItem]);
      
      expect(consoleSpy).toHaveBeenCalled();
      expect(mockSetItem).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});