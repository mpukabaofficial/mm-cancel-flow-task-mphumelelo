import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      users: data 
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch users'
    }, { status: 500 })
  }
}