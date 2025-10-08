import { http, HttpResponse } from 'msw';
import { SignInFormData, User, UserRole } from '../models/types';
import { productHandlers } from './products';

interface RegisterFormData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  storeName?: string;
  storeDescription?: string;
}

// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'buyer@example.com',
    name: 'John Buyer',
    role: UserRole.BUYER,
    createdAt: new Date(),
  },
  {
    id: '2',
    email: 'seller@example.com',
    name: 'Jane Seller',
    role: UserRole.SELLER,
    createdAt: new Date(),
    storeInfo: {
      storeName: 'Jane\'s Store',
      description: 'Quality products at great prices',
    },
  },
];

// Helper function to generate JWT token (mock)
const generateToken = (userId: string) => {
  return `mock-jwt-token-${userId}`;
};

export const handlers = [
  ...productHandlers,
  // Sign In handler
  http.post('/api/auth/signin', async ({ request }) => {
    const data = (await request.json()) as SignInFormData;
    
    const user = mockUsers.find(u => u.email === data.email);
    console.log('Signing in user:', data.email);
    if (!user || data.password !== 'password123') { // For testing, any password = 'password123'
      return new HttpResponse(
        JSON.stringify({ message: 'Invalid credentials' }), 
        { status: 401 }
      );
    }

    return HttpResponse.json({
      user,
      token: generateToken(user.id),
    });
  }),

  // Register handler
  http.post('/api/auth/register', async ({ request }) => {
    const data = (await request.json()) as RegisterFormData;
    
    // Check if email already exists
    if (mockUsers.some(u => u.email === data.email)) {
      return new HttpResponse(
        JSON.stringify({ message: 'Email already registered' }), 
        { status: 400 }
      );
    }

    // Create new user
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      email: data.email,
      name: data.name,
      role: data.role,
      createdAt: new Date(),
      ...(data.role === 'SELLER' && {
        storeInfo: {
          storeName: data.storeName!,
          description: data.storeDescription!,
        },
      }),
    };

    console.log('Registering new user:', newUser);

    mockUsers.push(newUser);

    return HttpResponse.json({
      user: newUser,
      token: generateToken(newUser.id),
    });
  }),
];