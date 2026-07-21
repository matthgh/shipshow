import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// POST /api/demos — create a new blank demo and return its id
export async function POST() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('demos')
    .insert({ title: 'Nuova Demo' })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ id: data.id })
}
