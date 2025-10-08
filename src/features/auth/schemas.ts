import { z } from 'zod';
import { UserRole, SignInFormData } from '../../models/types';

export const signInSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().trim().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().default(false),
}) satisfies z.ZodType<SignInFormData>;

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().min(1, 'Email is required').email('Invalid email format'),
  password: z.string()
    .trim()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/, 
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string().trim(),
  role: z.nativeEnum(UserRole),
  // Conditional fields based on role
  storeName: z.string().trim().optional(),
  storeDescription: z.string().trim().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine(
  (data) => {
    if (data.role === 'SELLER') {
      return !!data.storeName && !!data.storeDescription;
    }
    return true;
  },
  {
    message: "Store information is required for sellers",
    path: ["storeName"],
  }
);

export type SignInSchemaType = z.infer<typeof signInSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;