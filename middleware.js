import { NextResponse } from 'next/server';
// import { verifyToken } from '@/utils/auth';

export function middleware(req) {
    
  const token = req.cookies.get('token')?.value;


  // If token is missing or invalid, redirect to the login page
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next()

}

// Apply middleware to all routes under /dashboard
export const config = {
  matcher: ['/dash/:path*'],
};
