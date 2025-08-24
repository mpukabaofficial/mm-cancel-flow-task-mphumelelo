import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { createCancellationSchema, validateRequestBody, uuidSchema } from '@/lib/validations'

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
    
    // Get the first user from the database (for demo purposes)
    const { data: users, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(1)
    
    if (userError) {
      console.error('Error fetching user:', userError)
      return NextResponse.json({ 
        error: 'Failed to fetch user' 
      }, { status: 500 })
    }
    
    if (!users || users.length === 0) {
      return NextResponse.json({ 
        error: 'No users found in database' 
      }, { status: 404 })
    }
    
    const user = users[0]
    
    // Only include defined fields to avoid validation issues
    const insertData: Record<string, unknown> = {
      subscription_id: body.subscription_id,
      downsell_variant: body.downsell_variant,
      user_id: user.id
    }
    
    // Only add optional fields if they are defined
    if (body.reason !== undefined) {
      insertData.reason = body.reason
    }
    if (body.has_job !== undefined) {
      insertData.has_job = body.has_job
    }
    
    const { data, error } = await supabaseAdmin
      .from('cancellations')
      .insert([insertData])
      .select()
      .single()

    if (error) {
      console.error('Supabase cancellation insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Cancellation creation error:', error)
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
      try {
        uuidSchema.parse(userId)
      } catch (error) {
        return NextResponse.json({ 
          error: 'Invalid user_id format', 
          details: 'user_id must be a valid UUID' 
        }, { status: 400 })
      }
    }

    let query = supabaseAdmin.from('cancellations').select('*')
    
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