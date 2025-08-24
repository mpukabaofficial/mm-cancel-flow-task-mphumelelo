import { NextRequest, NextResponse } from 'next/server'
import { subscriptionDb } from '@/lib/subscriptionService'
import { validateParams, uuidSchema } from '@/lib/validations'
import { z } from 'zod'

const paramsSchema = z.object({
  id: uuidSchema
})

const bodySchema = z.object({
  newPrice: z.number().positive().int(),
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

    // Parse and validate request body
    const body = await request.json()
    const bodyValidation = bodySchema.safeParse(body)
    if (!bodyValidation.success) {
      return NextResponse.json({ 
        error: 'Invalid request body', 
        details: bodyValidation.error.issues 
      }, { status: 400 })
    }

    // Accept downsell offer
    const updatedSubscription = await subscriptionDb.acceptDownsellOffer(
      resolvedParams.id, 
      bodyValidation.data.newPrice
    )

    return NextResponse.json(updatedSubscription)
  } catch (error) {
    console.error('Error accepting downsell offer:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}