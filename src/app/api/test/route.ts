import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1)

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      data 
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to connect to database'
    }, { status: 500 })
  }
}