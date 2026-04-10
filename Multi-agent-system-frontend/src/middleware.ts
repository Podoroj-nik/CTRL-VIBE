import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  const { pathname } = request.nextUrl;

  // 1. PUBLIC ROUTES
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api/auth') || 
    pathname === '/login' || 
    pathname === '/register' ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  // 2. AUTH CHECK
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  const userRole = token.role as string;
  const isProfileFilled = !!token.profileFilled;

  // 3. ADMIN PROTECTION
  if (pathname.startsWith('/admin')) {
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 4. STUDENT PROTECTION & PROFILE CHECK
  if (pathname.startsWith('/student')) {
    if (userRole !== 'STUDENT') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Redirect to survey if profile is not filled
    // Avoid infinite redirect if they are already going to the survey page
    if (!isProfileFilled && !pathname.includes('/register/survey')) {
      return NextResponse.redirect(new URL('/register/survey', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/student/:path*',
  ],
};
