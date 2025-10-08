// Mock product data and handlers
import { http, HttpResponse } from 'msw';
import { Product } from '../models/types';

// Mock products data
export const mockProducts: Product[] = [
  // Electronics
  {
    id: '1',
    name: 'Mechanical Keyboard',
    description: 'High-quality mechanical keyboard with RGB backlight',
    price: 129.99,
    images: ['keyboard1.jpg', 'keyboard2.jpg'],
    category: 'Electronics',
    stock: 50,
    sellerId: '2',
    createdAt: new Date('2025-09-01'),
    updatedAt: new Date('2025-09-01'),
  },
  {
    id: '2',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with long battery life',
    price: 49.99,
    images: ['mouse1.jpg'],
    category: 'Electronics',
    stock: 100,
    sellerId: '2',
    discountPercentage: 20,
    discountValidUntil: new Date('2025-12-31'),
    createdAt: new Date('2025-09-15'),
    updatedAt: new Date('2025-09-15'),
  },
  {
    id: '3',
    name: 'Noise-Cancelling Headphones',
    description: 'Premium wireless headphones with active noise cancellation',
    price: 299.99,
    images: ['headphones1.jpg'],
    category: 'Electronics',
    stock: 30,
    sellerId: '2',
    discountPercentage: 15,
    createdAt: new Date('2025-09-20'),
    updatedAt: new Date('2025-09-20'),
  },
  // Books
  {
    id: '4',
    name: 'JavaScript Programming Book',
    description: 'Comprehensive guide to modern JavaScript development',
    price: 39.99,
    images: ['book1.jpg'],
    category: 'Books',
    stock: 75,
    sellerId: '2',
    createdAt: new Date('2025-08-20'),
    updatedAt: new Date('2025-08-20'),
  },
  {
    id: '5',
    name: 'React Design Patterns',
    description: 'Advanced React patterns and best practices',
    price: 45.99,
    images: ['book2.jpg'],
    category: 'Books',
    stock: 60,
    sellerId: '2',
    createdAt: new Date('2025-09-10'),
    updatedAt: new Date('2025-09-10'),
  },
  // Fashion
  {
    id: '6',
    name: 'Classic Leather Watch',
    description: 'Elegant timepiece with genuine leather strap',
    price: 199.99,
    images: ['watch1.jpg'],
    category: 'Fashion',
    stock: 25,
    sellerId: '2',
    discountPercentage: 10,
    createdAt: new Date('2025-09-05'),
    updatedAt: new Date('2025-09-05'),
  },
  {
    id: '7',
    name: 'Wool Blend Sweater',
    description: 'Comfortable and warm winter sweater',
    price: 79.99,
    images: ['sweater1.jpg'],
    category: 'Fashion',
    stock: 45,
    sellerId: '2',
    createdAt: new Date('2025-09-25'),
    updatedAt: new Date('2025-09-25'),
  },
  // Home & Living
  {
    id: '8',
    name: 'Smart LED Bulb Set',
    description: 'WiFi-enabled color changing LED bulbs',
    price: 59.99,
    images: ['bulbs1.jpg'],
    category: 'Home & Living',
    stock: 0, // Out of stock
    sellerId: '2',
    createdAt: new Date('2025-09-12'),
    updatedAt: new Date('2025-09-12'),
  },
  {
    id: '9',
    name: 'Ceramic Plant Pot',
    description: 'Modern minimalist design plant pot',
    price: 24.99,
    images: ['pot1.jpg'],
    category: 'Home & Living',
    stock: 85,
    sellerId: '2',
    discountPercentage: 30,
    discountValidUntil: new Date('2025-11-30'),
    createdAt: new Date('2025-09-18'),
    updatedAt: new Date('2025-09-18'),
  },
  // Sports
  {
    id: '10',
    name: 'Yoga Mat',
    description: 'Non-slip exercise yoga mat with carrying strap',
    price: 29.99,
    images: ['yoga1.jpg'],
    category: 'Sports',
    stock: 120,
    sellerId: '2',
    createdAt: new Date('2025-09-22'),
    updatedAt: new Date('2025-09-22'),
  },
  {
    id: '11',
    name: 'Resistance Bands Set',
    description: '5-piece exercise bands with different resistance levels',
    price: 19.99,
    images: ['bands1.jpg'],
    category: 'Sports',
    stock: 95,
    sellerId: '2',
    discountPercentage: 25,
    createdAt: new Date('2025-09-28'),
    updatedAt: new Date('2025-09-28'),
  }
];

// Product handlers
export const productHandlers = [
  // Get all products
  http.get('/api/products', () => {
    return HttpResponse.json(mockProducts);
  }),

  // Get product by ID
  http.get('/api/products/:id', ({ params }) => {
    const product = mockProducts.find(p => p.id === params.id);
    if (!product) {
      return new HttpResponse(
        JSON.stringify({ message: 'Product not found' }),
        { status: 404 }
      );
    }
    return HttpResponse.json(product);
  }),

  // Get products by category
  http.get('/api/products/category/:category', ({ params }) => {
    const category = params.category as string;
    const products = mockProducts.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
    return HttpResponse.json(products);
  }),

  // Get products by seller
  http.get('/api/products/seller/:sellerId', ({ params }) => {
    const products = mockProducts.filter(p => p.sellerId === params.sellerId);
    return HttpResponse.json(products);
  }),
];