import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is protected
  const isProtectedPath = pathname.startsWith('/feed');
  
  // Check for session cookie
  const sessionCookie = request.cookies.get('next-auth.session-token') || 
                        request.cookies.get('__Secure-next-auth.session-token');
  const isAuthenticated = !!sessionCookie;

  // Redirect logic
  if (isProtectedPath && !isAuthenticated) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  if (pathname === '/' && isAuthenticated) {
    const url = new URL('/feed', request.url);
    return NextResponse.redirect(url);
  }

  if (pathname === '/' && !isAuthenticated) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  if (pathname === '/login' && isAuthenticated) {
    const url = new URL('/feed', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/feed/:path*'],
}; 