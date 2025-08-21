import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  try {
    // Insert users
    const { error: userError } = await supabaseAdmin
      .from('users')
      .upsert([
        { id: '550e8400-e29b-41d4-a716-446655440001', email: 'user1@example.com' },
        { id: '550e8400-e29b-41d4-a716-446655440002', email: 'user2@example.com' },
        { id: '550e8400-e29b-41d4-a716-446655440003', email: 'user3@example.com' }
      ], { onConflict: 'email' })

    if (userError) {
      return NextResponse.json({ 
        success: false, 
        error: `User insert error: ${userError.message}` 
      }, { status: 400 })
    }

    // Insert subscriptions
    const { error: subError } = await supabaseAdmin
      .from('subscriptions')
      .upsert([
        { user_id: '550e8400-e29b-41d4-a716-446655440001', monthly_price: 2500, status: 'active' },
        { user_id: '550e8400-e29b-41d4-a716-446655440002', monthly_price: 2900, status: 'active' },
        { user_id: '550e8400-e29b-41d4-a716-446655440003', monthly_price: 2500, status: 'active' }
      ])

    if (subError) {
      return NextResponse.json({ 
        success: false, 
        error: `Subscription insert error: ${subError.message}` 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully' 
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({
      success: false,
      error: 'Failed to seed database'
    }, { status: 500 })
  }
}