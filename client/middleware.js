import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token');

  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  if ((pathname === '/' || pathname.startsWith('/signup')) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
