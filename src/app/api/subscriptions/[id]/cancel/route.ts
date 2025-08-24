import { NextRequest, NextResponse } from 'next/server'
import { subscriptionDb } from '@/lib/subscriptionDb'
import { validateParams, uuidSchema } from '@/lib/validations'
import { z } from 'zod'

const paramsSchema = z.object({
  id: uuidSchema
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    // Validate URL parameters
    const paramValidation = validateParams(resolvedParams, paramsSchema)
    if (!paramValidation.success) {
      return NextResponse.json({ 
        error: 'Invalid parameters', 
        details: paramValidation.error 
      }, { status: 400 })
    }

    // Cancel the subscription
    const updatedSubscription = await subscriptionDb.cancelSubscription(resolvedParams.id)

    return NextResponse.json(updatedSubscription)
  } catch (error) {
    console.error('Error cancelling subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}