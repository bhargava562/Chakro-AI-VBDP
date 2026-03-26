import { z } from 'zod';

// ==================== Auth Validation Schemas ====================

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must be less than 255 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and numbers'
    ),
  companyName: z
    .string()
    .min(1, 'Company name is required')
    .min(2, 'Company name must be at least 2 characters')
    .max(500, 'Company name must be less than 500 characters'),
});

export type RegisterFormData = z.infer<typeof RegisterSchema>;

export const OTPSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  otp: z
    .string()
    .min(1, 'OTP is required')
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain only digits'),
});

export type OTPFormData = z.infer<typeof OTPSchema>;

// ==================== Contact Form Validation ====================

export const ContactFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  company: z
    .string()
    .min(1, 'Company name is required')
    .min(2, 'Company name must be at least 2 characters'),
  message: z
    .string()
    .min(1, 'Message is required')
    .min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;

// ==================== Utility function for validation ====================

/**
 * Validates data against a Zod schema and returns errors.
 * @param schema Zod validation schema
 * @param data Data to validate
 * @returns Object with field errors, or null if valid
 */
export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Record<string, string> | null {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path.join('.');
      errors[path] = issue.message;
    });
    return errors;
  }

  return null;
}

/**
 * Validates form data and returns validated data or throws error.
 */
export function parseForm<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Safe validation that returns result instead of throwing.
 */
export function safeParse<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: boolean; data?: T; errors?: Record<string, string> } {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path.join('.');
      errors[path] = issue.message;
    });
    return { success: false, errors };
  }

  return { success: true, data: result.data };
}
