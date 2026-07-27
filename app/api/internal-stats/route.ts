import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export const runtime = 'edge'

const VALID_STATUSES = ['building', 'beta', 'live', 'maintenance'] as const

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey || apiKey !== process.env.INTERNAL_STATS_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createServiceClient()

    const [signupsResult, viewsResult] = await Promise.all([
      // count_auth_users() is a SECURITY DEFINER fn that counts auth.users
      supabase.rpc('count_auth_users'),
      supabase.from('demos').select('view_count'),
    ])

    if (signupsResult.error) throw new Error('signups')
    if (viewsResult.error) throw new Error('views')

    const signups = Number(signupsResult.data ?? 0)
    const views = (viewsResult.data ?? []).reduce(
      (sum: number, row: { view_count: number }) => sum + (row.view_count ?? 0),
      0
    )

    const rawStatus = process.env.PROJECT_STATUS ?? 'building'
    const status = VALID_STATUSES.includes(rawStatus as typeof VALID_STATUSES[number])
      ? rawStatus
      : 'building'

    return NextResponse.json({ status, signups, views })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
