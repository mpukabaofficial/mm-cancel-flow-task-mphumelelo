import { z } from 'zod'

// Validation schemas for cancellation flow

export const downsellVariantSchema = z.enum(['A', 'B'], {
  message: 'Downsell variant must be either "A" or "B"'
})

export const subscriptionStatusSchema = z.enum(['active', 'pending_cancellation', 'cancelled'], {
  message: 'Invalid subscription status'
})

export const createCancellationSchema = z.object({
  subscription_id: z.uuid('Invalid subscription ID format'),
  downsell_variant: downsellVariantSchema,
  reason: z.string().max(500, 'Reason must be 500 characters or less').optional(),
  has_job: z.boolean().optional()
}).strict()

export const updateCancellationSchema = z.object({
  reason: z.string().max(500, 'Reason must be 500 characters or less').optional(),
  accepted_downsell: z.boolean().optional(),
  has_job: z.boolean().optional()
}).strict()

export const updateSubscriptionSchema = z.object({
  id: z.string().uuid('Invalid subscription ID format'),
  status: subscriptionStatusSchema
}).strict()

// UUID validation helper
export const uuidSchema = z.string().uuid('Invalid UUID format')

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