import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Define protected routes
  const protectedRoutes = ['/dashboard/landlord', '/dashboard/admin'];
  const authRoutes = ['/auth/login', '/auth/register'];
  
  const { pathname } = request.nextUrl;
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // TODO: Implement proper authentication check
  // For now, we'll use a simple token check in cookies
  const token = request.cookies.get('auth-token')?.value;
  
  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  // If accessing auth route with token, redirect to dashboard
  if (isAuthRoute && token) {
    // TODO: Decode token to determine user role and redirect accordingly
    return NextResponse.redirect(new URL('/dashboard/landlord', request.url));
  }
  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};