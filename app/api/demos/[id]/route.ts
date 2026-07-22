import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

type Params = { params: Promise<{ id: string }> }

// GET /api/demos/[id] — fetch full demo with steps & hotspots
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()

  const { data: demo, error: demoErr } = await supabase
    .from('demos')
    .select('*')
    .eq('id', id)
    .single()

  if (demoErr) {
    return NextResponse.json({ error: demoErr.message }, { status: 404 })
  }

  const { data: steps, error: stepsErr } = await supabase
    .from('steps')
    .select('*, hotspots(*)')
    .eq('demo_id', id)
    .order('order_index', { ascending: true })

  if (stepsErr) {
    return NextResponse.json({ error: stepsErr.message }, { status: 500 })
  }

  return NextResponse.json({ ...demo, steps: steps ?? [] })
}

// PUT /api/demos/[id] — full save: upsert steps & hotspots, update demo title/status
export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const body = await req.json()

  const { title, status, share_slug, steps } = body

  // 1. Update demo metadata
  const { error: demoErr } = await supabase
    .from('demos')
    .update({ title, status, share_slug })
    .eq('id', id)

  if (demoErr) {
    return NextResponse.json({ error: demoErr.message }, { status: 500 })
  }

  // 2. Delete all existing steps for this demo (cascade deletes hotspots)
  await supabase.from('steps').delete().eq('demo_id', id)

  // 3. Re-insert steps in order
  if (!steps?.length) {
    return NextResponse.json({ ok: true })
  }

  const stepRows = steps.map((s: { id: string; label: string; imageUrl?: string; image_url?: string }, idx: number) => ({
    id: s.id,
    demo_id: id,
    order_index: idx,
    label: s.label,
    image_url: s.imageUrl ?? s.image_url ?? '',
  }))

  const { error: stepsErr } = await supabase.from('steps').insert(stepRows)
  if (stepsErr) {
    return NextResponse.json({ error: stepsErr.message }, { status: 500 })
  }

  // 4. Re-insert all hotspots
  const hotspotRows = steps.flatMap((s: {
    id: string
    hotspots: Array<{
      id: string
      type: string
      x: number; y: number; width: number; height: number
      targetStepId: string | null
      placeholder?: string
      label: string
    }>
  }) =>
    (s.hotspots ?? []).map((h) => ({
      id: h.id,
      step_id: s.id,
      type: h.type ?? 'navigate',
      x_pct: h.x,
      y_pct: h.y,
      width_pct: h.width,
      height_pct: h.height,
      target_step_id: h.targetStepId ?? null,
      placeholder: h.placeholder ?? null,
      label: h.label ?? '',
    }))
  )

  if (hotspotRows.length) {
    const { error: hsErr } = await supabase.from('hotspots').insert(hotspotRows)
    if (hsErr) {
      return NextResponse.json({ error: hsErr.message }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true })
}
