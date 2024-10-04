import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function middleware(request) {
  const cookies = request.cookies;
  const token = cookies.get('token');

  // Determine the API URL based on the path
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
  const isMechanicsRoute = request.nextUrl.pathname.startsWith('/mechanic');

  let apiUrl = '';
  let RedirectUrl = '';

  // Set the API URL based on the route
  if (isDashboardRoute) {
    apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/check-auth`;
    RedirectUrl = '/admin/signin';
  } else if (isMechanicsRoute) {
    apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/mechanic/check-auth`;
    RedirectUrl = '/auth/signin';
  }

  // If token exists, send it in the Authorization header to the API
  if (token && apiUrl) {
    try {
      const apiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value || token}` // Send the token as a Bearer token
        }
      });

      const result = await apiResponse.json();

      if (result.operation === true) {
        const userData = JSON.stringify(result.UserData);
        const response = NextResponse.next();

        response.cookies.set('userDataUpdated', userData, {
          httpOnly: true,
          path: '/',
          maxAge: 60 * 60 * 24
        });

        return response;
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
    }
  }

  const loginUrl = new URL(`${RedirectUrl}`, request.url);
  loginUrl.searchParams.set('redirect', request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/dashboard/:path*', '/mechanic/:path*']
};
