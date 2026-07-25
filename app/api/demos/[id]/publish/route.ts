import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { NextRequest, NextResponse } from 'next/server'

type Params = { params: Promise<{ id: string }> }

// PATCH /api/demos/[id]/publish — set status=published and assign share_slug
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params

  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { share_slug } = await req.json()

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('demos')
    .update({ status: 'published', share_slug })
    .eq('id', id)
    .eq('user_id', user.id)

  console.log('[v0] PATCH publish demo', id, 'slug:', share_slug, 'user:', user.id, 'err:', error?.message ?? 'ok')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
