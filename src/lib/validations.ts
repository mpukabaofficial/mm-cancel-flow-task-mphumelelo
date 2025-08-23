import { z } from 'zod'

// Validation schemas for cancellation flow

export const downsellVariantSchema = z.enum(['A', 'B'], {
  message: 'Downsell variant must be either "A" or "B"'
})

export const subscriptionStatusSchema = z.enum(['active', 'pending_cancellation', 'cancelled'], {
  message: 'Invalid subscription status'
})

export const cancelReasonSchema = z.enum([
  'Too expensive', 
  'Platform not helpful', 
  'Not enough relevant jobs', 
  'Decided not to move', 
  'Other'
], {
  message: 'Invalid cancellation reason'
})

export const createCancellationSchema = z.object({
  subscription_id: z.uuid('Invalid subscription ID format'),
  downsell_variant: downsellVariantSchema,
  reason: cancelReasonSchema.optional(),
  explanation: z.string().max(1000, 'Explanation must be 1000 characters or less').optional(),
  has_job: z.boolean().optional()
}).strict()

export const updateCancellationSchema = z.object({
  reason: cancelReasonSchema.optional(),
  explanation: z.string().max(1000, 'Explanation must be 1000 characters or less').optional(),
  accepted_downsell: z.boolean().optional(),
  has_job: z.boolean().optional(),
  found_job_with_migratemate: z.enum(['Yes', 'No']).optional(),
  roles_applied_count: z.enum(["0", "1–5", "6–20", "20+"]).optional(),
  companies_emailed_count: z.enum(["0", "1–5", "6–20", "20+"]).optional(),
  companies_interviewed_count: z.enum(["0", "1–2", "3–5", "5+"]).optional()
}).strict()

export const updateSubscriptionSchema = z.object({
  id: z.uuid('Invalid subscription ID format'),
  status: subscriptionStatusSchema
}).strict()

// UUID validation helper
export const uuidSchema = z.uuid('Invalid UUID format')

// Validation result type
type ValidationResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

// Utility function to validate request body
export function validateRequestBody<T>(
  schema: z.ZodSchema<T>, 
  body: unknown
): ValidationResult<T> {
  try {
    const data = schema.parse(body)
    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ')
      return { success: false, error: errorMessage }
    }
    return { success: false, error: 'Validation failed' }
  }
}

// Utility function to validate URL parameters
export function validateParams<T>(
  params: Record<string, string>, 
  schema: z.ZodSchema<T>
): ValidationResult<T> {
  try {
    const data = schema.parse(params)
    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ')
      return { success: false, error: errorMessage }
    }
    return { success: false, error: 'Parameter validation failed' }
  }
}