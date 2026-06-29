// import { headers } from 'next/headers'
// import type { NextRequest } from 'next/server'
// import { NextResponse } from 'next/server'
// import { auth } from './lib/auth'

// // This function can be marked `async` if using `await` inside
// export async function proxy(request: NextRequest) {
//   const publicPaths = ['/', '/login', '/signup']
//   const isPublicPath = publicPaths.includes(request.nextUrl.pathname)

//   const session = await auth.api.getSession({
//     headers: await headers()
//   })

//   if (session && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
//     return NextResponse.redirect(new URL('/dashboard', request.url))
//   }

//   if (!session && !isPublicPath) {
//     const urlQuery = new URLSearchParams()
//     if (request.nextUrl.pathname !== "/") {
//       urlQuery.set("return_url", request.nextUrl.pathname + request.nextUrl.search)
//     }
//     return NextResponse.redirect(new URL(`/login?${urlQuery.toString()}`, request.url))
//   }
//   const isStartWithAdminPath = request.nextUrl.pathname.startsWith('/admin')
//   if (isStartWithAdminPath && session?.user?.role !== 'admin') {
//     return NextResponse.rewrite(new URL('/not-found', request.url))
//   }
//   return NextResponse.next()
// }

// // Alternatively, you can use a default export:
// // export default function proxy(request: NextRequest) { ... }

// export const config = {
//   // matcher: [
//   //   '/((?!api/me(?:/|$)|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
//   // ],
//   matcher: ['/admin/:path*', '/admin'],
// }

import { headers } from 'next/headers'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { auth } from './lib/auth'

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  const { pathname } = request.nextUrl;

  const isAuthPath = pathname === '/login' || pathname === '/signup';
  const isDashboardPath = pathname.startsWith('/dashboard');
  const isAdminPath = pathname.startsWith('/admin');

  // Redirect authenticated users away from auth pages
  if (session && isAuthPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users away from protected routes
  if (!session && (isDashboardPath || isAdminPath)) {
    const urlQuery = new URLSearchParams();
    urlQuery.set("return_url", pathname + request.nextUrl.search);
    return NextResponse.redirect(new URL(`/login?${urlQuery.toString()}`, request.url));
  }

  // Prevent non-admin users from accessing admin routes
  if (session && isAdminPath && session.user?.role !== 'admin') {
    return NextResponse.rewrite(new URL('/not-found', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/admin', '/dashboard/:path*', '/dashboard', '/login', '/signup'],
}