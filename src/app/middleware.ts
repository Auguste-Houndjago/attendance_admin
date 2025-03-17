import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function middleware(request: NextRequest) {
  const supabase = await createClient()
  
  // Vérifier la session
  const { data: { session } } = await supabase.auth.getSession()
  
  // Obtenir le chemin actuel
  const path = request.nextUrl.pathname
  
  if (!session) {
    if (path.startsWith('/admin') || path.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }


  const role = session.user.user_metadata?.role
  
  switch (role) {
    case 'TEACHER':
      if (path.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/', request.url))
      }
      break
      
    case 'ADMIN':
      if (path.startsWith('/teacher')) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      break
      
    default:
      // Si pas de rôle ou rôle non reconnu
      if (path.startsWith('/admin') || path.startsWith('/teacher')) {
        return NextResponse.redirect(new URL('/auth/register', request.url))
      }
  }

  return NextResponse.next()
}

// Configure paths that should be handled by the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * And excluding authentication and login paths
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public|auth/|login/).*)",
  ],
}