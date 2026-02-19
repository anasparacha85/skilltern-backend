// validationSchemas.js
import { z } from 'zod';

export const loginvalidate = z.object({
  email: z
    .string({ required_error: "Email is Required" })
    .trim()
    .email({ message: 'Invalid Email Address' })
    .min(10, { message: 'Email should be at least 10 characters' })
    .max(40, { message: 'Email should not exceed 40 characters' }),
  password: z
    .string({ required_error: 'Password is required' })
    .trim()
    .min(7, { message: 'Password should be at least 7 characters' })
    .max(55, { message: 'Password should not exceed 55 characters' }),
});

export const signupvalidate = loginvalidate.extend({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(3, { message: 'Name should be at least 3 characters' })
    .max(155, { message: 'Name should not exceed 155 characters' }),
  ConfirmPassword: z
    .string({ required_error: 'Confirm Password is required' })
    .trim()
    .min(7, { message: 'Confirm Password should be at least 7 characters' })
    .max(55, { message: 'Confirm Password should not exceed 55 characters' }),
});

export const Adminsignupvalidate = signupvalidate.extend({
  AdminKey: z
    .string({ required_error: 'Admin key is required' })
    .trim()
    .min(7, { message: 'Admin Key should be at least 7 characters' })
    .max(155, { message: 'Name should not exceed 155 characters' }),
 
});
