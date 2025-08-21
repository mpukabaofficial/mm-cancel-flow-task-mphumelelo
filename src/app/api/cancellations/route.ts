import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { createCancellationSchema, validateRequestBody, uuidSchema } from '@/lib/validations'
import { getMockUser } from '@/lib/mockUser'

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const rawBody = await request.json()
    const validation = validateRequestBody(createCancellationSchema, rawBody)
    
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validation.error 
      }, { status: 400 })
    }

    const body = validation.data
    const mockUser = getMockUser()
    
    const { data, error } = await supabase
      .from('cancellations')
      .insert([
        {
          subscription_id: body.subscription_id,
          downsell_variant: body.downsell_variant,
          reason: body.reason,
          has_job: body.has_job,
          user_id: mockUser.id // Use actual mock user ID
        }
      ])
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    // Validate user_id if provided
    if (userId) {
      const validation = validateRequestBody(uuidSchema, userId)
      if (!validation.success) {
        return NextResponse.json({ 
          error: 'Invalid user_id format', 
          details: validation.error 
        }, { status: 400 })
      }
    }

    let query = supabase.from('cancellations').select('*')
    
    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query

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