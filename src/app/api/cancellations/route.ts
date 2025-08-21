import { supabase } from '@/lib/supabase'
import { CreateCancellationRequest } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body: CreateCancellationRequest = await request.json()
    
    const { data, error } = await supabase
      .from('cancellations')
      .insert([
        {
          subscription_id: body.subscription_id,
          downsell_variant: body.downsell_variant,
          reason: body.reason,
          has_job: body.has_job,
          user_id: '00000000-0000-0000-0000-000000000000' // TODO: Get from auth
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
    console.log(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}