import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'
import { createServerClient } from '@supabase/ssr'

const PROTECTED = ['/editor', '/dashboard']

// Routes allowed even during maintenance
const MAINTENANCE_ALLOWED = ['/', '/maintenance', '/auth']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Maintenance mode — redirect everything except allowed routes
  const isMaintenance = process.env.MAINTENANCE === 'true'
  if (isMaintenance) {
    const allowed = MAINTENANCE_ALLOWED.some((p) => pathname === p || pathname.startsWith(p + '/'))
    if (!allowed) {
      const url = request.nextUrl.clone()
      url.pathname = '/maintenance'
      return NextResponse.redirect(url)
    }
    // Still run session update for allowed routes and return early (no auth check needed)
    return await updateSession(request)
  }

  const response = await updateSession(request)

  const needsAuth = PROTECTED.some((p) => pathname.startsWith(p))
  if (!needsAuth) return response

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: () => {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/auth/login'
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
