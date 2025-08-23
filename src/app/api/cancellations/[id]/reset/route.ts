import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
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

    // Reset cancellation to basic fields only
    const resetData = {
      reason: null,
      explanation: null,
      accepted_downsell: false,
      has_job: null,
      found_job_with_migratemate: null,
      roles_applied_count: null,
      companies_emailed_count: null,
      companies_interviewed_count: null,
      has_immigration_lawyer: null,
      visa_type: null
    }
    
    const { data, error } = await supabaseAdmin
      .from('cancellations')
      .update(resetData)
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