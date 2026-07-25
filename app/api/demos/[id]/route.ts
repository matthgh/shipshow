import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { NextRequest, NextResponse } from 'next/server'

type Params = { params: Promise<{ id: string }> }

// GET /api/demos/[id] — fetch full demo with steps & hotspots
export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params

  // Identify requester (may be null for unauthenticated)
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()

  // Use service client so RLS doesn't interfere
  const supabase = createServiceClient()

  const { data: demo, error: demoErr } = await supabase
    .from('demos')
    .select('*')
    .eq('id', id)
    .single()

  if (demoErr || !demo) {
    return NextResponse.json({ error: 'Demo not found' }, { status: 404 })
  }

  // Only allow access if: owner OR published
  if (demo.status !== 'published' && demo.user_id !== user?.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const { data: steps, error: stepsErr } = await supabase
    .from('steps')
    .select('*, hotspots!hotspots_step_id_fkey(*)')
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

  // Auth check
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()
  const body = await req.json()
  const { title, status, share_slug, steps } = body

  // Verify ownership before writing
  const { data: existing } = await supabase
    .from('demos')
    .select('user_id')
    .eq('id', id)
    .single()

  if (!existing || existing.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 1. Update demo metadata
  const { error: demoErr } = await supabase
    .from('demos')
    .update({ title, status, share_slug })
    .eq('id', id)

  if (demoErr) {
    return NextResponse.json({ error: demoErr.message }, { status: 500 })
  }

  // 2. Delete all existing steps (cascade deletes hotspots)
  await supabase.from('steps').delete().eq('demo_id', id)

  if (!steps?.length) {
    return NextResponse.json({ ok: true, stepIdMap: [] })
  }

  const isUUID = (v: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v)

  type StepRow = Record<string, unknown>
  const realRows: StepRow[] = []
  const tempRows: StepRow[] = []

  steps.forEach((s: { id: string; label: string; imageUrl?: string; image_url?: string }, idx: number) => {
    const base: StepRow = {
      demo_id: id,
      order_index: idx,
      label: s.label,
      image_url: s.imageUrl ?? s.image_url ?? '',
    }
    if (isUUID(s.id)) {
      realRows.push({ ...base, id: s.id })
    } else {
      tempRows.push(base)
    }
  })

  let insertedReal: Array<{ id: string; order_index: number }> = []
  if (realRows.length) {
    const { data, error } = await supabase.from('steps').insert(realRows).select('id, order_index')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    insertedReal = data ?? []
  }

  let insertedTemp: Array<{ id: string; order_index: number }> = []
  if (tempRows.length) {
    const { data, error } = await supabase.from('steps').insert(tempRows).select('id, order_index')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    insertedTemp = data ?? []
  }

  const idByOrder = new Map<number, string>(
    [...insertedReal, ...insertedTemp].map((r) => [r.order_index, r.id])
  )

  const clientToDb = new Map<string, string>()
  steps.forEach((s: { id: string }, idx: number) => {
    clientToDb.set(s.id, idByOrder.get(idx) ?? s.id)
  })

  type HotspotInput = {
    id: string; type: string
    x: number; y: number; width: number; height: number
    targetStepId: string | null; placeholder?: string; label: string
  }
  type StepInput = { id: string; hotspots: HotspotInput[] }

  const allHotspots: HotspotInput[] = steps.flatMap((s: StepInput) => s.hotspots ?? [])
  const allHotspotUUIDs = allHotspots.length > 0 && allHotspots.every((h) => isUUID(h.id))

  const hotspotRows = steps.flatMap((s: StepInput) => {
    const realStepId = clientToDb.get(s.id)
    if (!realStepId) return []
    return (s.hotspots ?? []).map((h) => {
      const resolvedTarget = h.targetStepId
        ? (clientToDb.get(h.targetStepId) ?? (isUUID(h.targetStepId) ? h.targetStepId : null))
        : null
      const row: Record<string, unknown> = {
        step_id: realStepId,
        type: h.type ?? 'navigate',
        x_pct: h.x,
        y_pct: h.y,
        width_pct: h.width,
        height_pct: h.height,
        target_step_id: resolvedTarget,
        placeholder: h.placeholder ?? null,
        label: h.label ?? '',
      }
      if (allHotspotUUIDs) row.id = h.id
      return row
    })
  })

  if (hotspotRows.length) {
    const { error: hsErr } = await supabase.from('hotspots').insert(hotspotRows)
    if (hsErr) return NextResponse.json({ error: hsErr.message }, { status: 500 })
  }

  const stepIdMap = steps.map((s: { id: string }) => ({
    clientId: s.id,
    dbId: clientToDb.get(s.id) ?? s.id,
  }))

  return NextResponse.json({ ok: true, stepIdMap })
}

// DELETE /api/demos/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params

  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('demos')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
