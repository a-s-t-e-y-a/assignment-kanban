import { z } from 'zod';

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required')
});

const existsSchema = z.object({
  email: z.string().email('Invalid email')
});

const validateSignup = (data) => {
  return signupSchema.parse(data);
};

const validateLogin = (data) => {
  return loginSchema.parse(data);
};

const validateExists = (data) => {
  return existsSchema.parse(data);
};

export { validateSignup, validateLogin, validateExists };
