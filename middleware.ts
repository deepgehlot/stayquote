import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  const { pathname } = request.nextUrl;

  // Define protected routes
  const isDashboardPage = pathname.startsWith('/dashboard') || pathname === '/subscribe';
  const isLoginPage = pathname === '/login' || pathname === '/signup';

  // 1. If trying to access protected routes without token, redirect to login
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. If already logged in and trying to access login/signup, redirect to dashboard
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/login', '/signup', '/subscribe', '/dashboard/:path*'],
};
