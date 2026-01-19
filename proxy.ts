import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth/better-auth';

// Better Auth proxy for Next.js 16
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Define protected routes
  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/news') ||
    pathname.startsWith('/policies') ||
    pathname.startsWith('/events') ||
    pathname.startsWith('/submissions') ||
    pathname.startsWith('/downloads') ||
    pathname.startsWith('/admin');

  if (isProtectedRoute) {
    // Check session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      // Redirect to login with return URL
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

