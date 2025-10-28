import { z } from 'zod';

const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string()
    .min(1, 'Email is required')
    .regex(emailRegex, 'Email must be lowercase and valid')
    .refine((email) => !email.match(/[A-Z]/), {
      message: 'Email cannot contain uppercase letters'
    }),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .regex(emailRegex, 'Email must be lowercase and valid')
    .refine((email) => !email.match(/[A-Z]/), {
      message: 'Email cannot contain uppercase letters'
    }),
  password: z.string().min(1, 'Password is required')
});

const existsSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .regex(emailRegex, 'Email must be lowercase and valid')
    .refine((email) => !email.match(/[A-Z]/), {
      message: 'Email cannot contain uppercase letters'
    })
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
