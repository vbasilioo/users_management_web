import { z } from 'zod';

export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name cannot exceed 100 characters')
  .refine((value) => /^[a-zA-ZÀ-ÿ\s'-]+$/.test(value), {
    message: 'Name can only contain letters, spaces, hyphens and apostrophes',
  });

export const emailSchema = z.string()
  .min(1, 'Email is required')
  .email('Invalid email format')
  .transform(email => email.toLowerCase().trim());

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password cannot exceed 100 characters')
  .refine((value) => /[A-Z]/.test(value), {
    message: 'Password must contain at least one uppercase letter',
  })
  .refine((value) => /[a-z]/.test(value), {
    message: 'Password must contain at least one lowercase letter',
  })
  .refine((value) => /[0-9]/.test(value), {
    message: 'Password must contain at least one number',
  })
  .refine((value) => /[^A-Za-z0-9]/.test(value), {
    message: 'Password must contain at least one special character',
  });

export const usernameSchema = z.string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username cannot exceed 30 characters')
  .refine((value) => /^[a-z0-9_.-]+$/.test(value), {
    message: 'Username can only contain lowercase letters, numbers, dots, hyphens and underscores',
  });

export const phoneSchema = z.string()
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number cannot exceed 15 digits')
  .refine((value) => /^[+]?[0-9\s()-]+$/.test(value), {
    message: 'Phone number can only contain digits, spaces, parentheses, hyphens and a plus sign',
  });

export const urlSchema = z.string()
  .url('Invalid URL format')
  .max(2048, 'URL cannot exceed 2048 characters');

export const postalCodeSchema = z.string()
  .min(5, 'Postal code must be at least 5 characters')
  .max(10, 'Postal code cannot exceed 10 characters')
  .refine((value) => /^[a-zA-Z0-9\s-]+$/.test(value), {
    message: 'Postal code can only contain letters, numbers, spaces and hyphens',
  });

export const addressSchema = z.object({
  street: z.string().min(3, 'Street is required').max(100),
  city: z.string().min(2, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(100),
  postalCode: postalCodeSchema,
  country: z.string().min(2, 'Country is required').max(100),
});

export const creditCardSchema = z.object({
  number: z.string()
    .min(13, 'Card number must be at least 13 digits')
    .max(19, 'Card number cannot exceed 19 digits')
    .refine((value) => /^[0-9]+$/.test(value), {
      message: 'Card number can only contain digits',
    }),
  name: nameSchema,
  expiryMonth: z.string()
    .refine((value) => /^(0[1-9]|1[0-2])$/.test(value), {
      message: 'Expiry month must be between 01 and 12',
    }),
  expiryYear: z.string()
    .refine((value) => /^[0-9]{4}$/.test(value) && parseInt(value) >= new Date().getFullYear(), {
      message: 'Expiry year must be a valid future year',
    }),
  cvv: z.string()
    .refine((value) => /^[0-9]{3,4}$/.test(value), {
      message: 'CVV must be 3 or 4 digits',
    }),
});

export const dateSchema = z.coerce.date()
  .refine((date) => !isNaN(date.getTime()), {
    message: 'Invalid date format',
  });

export const futureDate = dateSchema.refine((date) => date > new Date(), {
  message: 'Date must be in the future',
});

export const pastDate = dateSchema.refine((date) => date < new Date(), {
  message: 'Date must be in the past',
});

export const ageSchema = dateSchema.refine(
  (date) => {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 18;
  },
  { message: 'You must be at least 18 years old' }
);

export const amountSchema = z.number()
  .positive('Amount must be positive')
  .refine((val) => !isNaN(val), {
    message: 'Amount must be a valid number',
  });

export const percentageSchema = z.number()
  .min(0, 'Percentage cannot be negative')
  .max(100, 'Percentage cannot exceed 100');

export const colorSchema = z.string()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color format');

export type Name = z.infer<typeof nameSchema>;
export type Email = z.infer<typeof emailSchema>;
export type Password = z.infer<typeof passwordSchema>;
export type Username = z.infer<typeof usernameSchema>;
export type Phone = z.infer<typeof phoneSchema>;
export type Url = z.infer<typeof urlSchema>;
export type PostalCode = z.infer<typeof postalCodeSchema>;
export type Address = z.infer<typeof addressSchema>;
export type CreditCard = z.infer<typeof creditCardSchema>;
export type DateInput = z.infer<typeof dateSchema>;
export type FutureDate = z.infer<typeof futureDate>;
export type PastDate = z.infer<typeof pastDate>;
export type Age = z.infer<typeof ageSchema>;
export type Amount = z.infer<typeof amountSchema>;
export type Percentage = z.infer<typeof percentageSchema>;
export type Color = z.infer<typeof colorSchema>; 