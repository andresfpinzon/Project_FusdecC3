import { z } from 'zod'
import { ERole } from "@enums/role.enum";

export const createUserValidation = z.object({
  username: z.string({
    required_error: 'Username is required',
  })
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username cannot exceed 30 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    
  email: z.string({
    required_error: 'Email is required',
  })
  .email('Invalid email format')
  .toLowerCase()
  .trim(),
    
  password: z.string({
    required_error: 'Password is required',
  })
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password is too long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  
  role: z.array(z.nativeEnum(ERole), {
    required_error: 'Role is required',
    invalid_type_error: 'Role must be an array of valid roles',
  }).min(1, 'At least one role must be assigned').default([ERole.USER]),
  
  isActive: z.boolean().default(true).optional(),
})

export const updateUserValidation = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .optional(),
      
  email: z.string()
    .email('Invalid email format')
    .toLowerCase()
    .trim()
    .optional(),
      
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
    .optional(),
      
  role: z.array(z.nativeEnum(ERole), {
    invalid_type_error: 'Role must be an array of valid roles',
  }).min(1, 'At least one role must be assigned').optional(),
      
  isActive: z.boolean().optional(),
});