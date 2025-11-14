const { z } = require('zod');

const roles = ['user', 'admin'];

const signupSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must be at most 50 characters long'),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email address'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters long'),
  role: z.enum(roles, {
    errorMap: () => ({ message: 'Role must be either user or admin' }),
  }),
});

const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email address'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters long'),
});

const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must be at most 50 characters long')
    .optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .optional(),
  role: z.enum(roles, {
    errorMap: () => ({ message: 'Role must be either user or admin' }),
  }).optional(),
});

module.exports = {
  roles,
  signupSchema,
  loginSchema,
  updateUserSchema,
};

