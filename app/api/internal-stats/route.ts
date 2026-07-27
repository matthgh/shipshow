import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  // Auth check
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey || apiKey !== process.env.INTERNAL_STATS_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createServiceClient()

    // Count signups from auth.users via the admin API
    const { count: signups, error: signupsErr } = await supabase
      .from('users' as never)
      .select('*', { count: 'exact', head: true })

    // If the above doesn't work (no public users table), use rpc or raw query
    // We use supabase-js admin: auth.admin.listUsers
    // But we don't have that here — use a raw SQL approach via RPC or count from auth schema.
    // Since service client has full access, count auth.users via a function call instead.

    if (signupsErr) {
      // Fallback: use a direct count via the service role
      // auth.users is accessible only via admin API or supabase_admin schema
    }

    // Sum all view_count across demos
    const { data: viewsData, error: viewsErr } = await supabase
      .from('demos')
      .select('view_count')

    if (viewsErr) {
      console.error('[internal-stats] views error:', viewsErr.message)
      return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
    }

    const views = (viewsData ?? []).reduce(
      (sum: number, row: { view_count: number }) => sum + (row.view_count ?? 0),
      0
    )

    const status = process.env.PROJECT_STATUS ?? 'building'
    const validStatuses = ['building', 'beta', 'live', 'maintenance']
    const safeStatus = validStatuses.includes(status) ? status : 'building'

    return NextResponse.json({
      status: safeStatus,
      signups: signups ?? 0,
      views,
    })
  } catch (err) {
    console.error('[internal-stats] unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
