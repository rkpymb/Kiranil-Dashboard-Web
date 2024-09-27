import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function middleware(request) {
  const cookies = request.cookies;

  const token = cookies.get('token');

  if (token) {
    return NextResponse.next();
  } else {
    const loginUrl = new URL('/auth/signin', request.url);
    loginUrl.searchParams.set('redirect', request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/dashboard/:path*']
};
