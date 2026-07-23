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

  const isUUID = (v: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v)

  // Only include id if it's already a real UUID (from a previous save).
  // Otherwise let Postgres generate one via gen_random_uuid().
  const stepRows = steps.map((s: { id: string; label: string; imageUrl?: string; image_url?: string }, idx: number) => {
    const row: Record<string, unknown> = {
      demo_id: id,
      order_index: idx,
      label: s.label,
      image_url: s.imageUrl ?? s.image_url ?? '',
    }
    if (isUUID(s.id)) row.id = s.id
    return row
  })

  const { data: insertedSteps, error: stepsErr } = await supabase
    .from('steps')
    .insert(stepRows)
    .select('id, order_index')

  if (stepsErr) {
    return NextResponse.json({ error: stepsErr.message }, { status: 500 })
  }

  // Build a map from order_index → new DB id for hotspot wiring
  const idByOrder = new Map<number, string>(
    (insertedSteps ?? []).map((r: { id: string; order_index: number }) => [r.order_index, r.id])
  )

  // 4. Re-insert all hotspots using the real DB step IDs
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
  }, sIdx: number) => {
    const realStepId = isUUID(s.id) ? s.id : (idByOrder.get(sIdx) ?? null)
    if (!realStepId) return []
    return (s.hotspots ?? []).map((h) => {
      const row: Record<string, unknown> = {
        step_id: realStepId,
        type: h.type ?? 'navigate',
        x_pct: h.x,
        y_pct: h.y,
        width_pct: h.width,
        height_pct: h.height,
        target_step_id: h.targetStepId && isUUID(h.targetStepId) ? h.targetStepId : null,
        placeholder: h.placeholder ?? null,
        label: h.label ?? '',
      }
      if (isUUID(h.id)) row.id = h.id
      return row
    })
  })

  if (hotspotRows.length) {
    const { error: hsErr } = await supabase.from('hotspots').insert(hotspotRows)
    if (hsErr) {
      return NextResponse.json({ error: hsErr.message }, { status: 500 })
    }
  }

  // Return the newly assigned step IDs so the client can replace temp IDs
  const stepIdMap = steps.map((s: { id: string }, idx: number) => ({
    clientId: s.id,
    dbId: isUUID(s.id) ? s.id : (idByOrder.get(idx) ?? s.id),
  }))

  return NextResponse.json({ ok: true, stepIdMap })
}

// DELETE /api/demos/[id] — remove demo (RLS ensures ownership)
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('demos')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
