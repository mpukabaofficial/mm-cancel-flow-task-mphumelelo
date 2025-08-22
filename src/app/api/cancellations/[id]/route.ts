import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { updateCancellationSchema, validateRequestBody, validateParams, uuidSchema } from '@/lib/validations'
import { z } from 'zod'

const paramsSchema = z.object({
  id: uuidSchema
})

export async function GET(
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

    const { data, error } = await supabaseAdmin
      .from('cancellations')
      .select('*')
      .eq('id', resolvedParams.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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
    const rawBody = await request.json()
    const bodyValidation = validateRequestBody(updateCancellationSchema, rawBody)
    
    if (!bodyValidation.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: bodyValidation.error 
      }, { status: 400 })
    }

    const body = bodyValidation.data
    
    const { data, error } = await supabaseAdmin
      .from('cancellations')
      .update(body)
      .eq('id', resolvedParams.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    const { error } = await supabaseAdmin
      .from('cancellations')
      .delete()
      .eq('id', resolvedParams.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Cancellation deleted successfully' })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}