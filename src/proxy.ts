// import { headers } from 'next/headers'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
// import { auth } from './lib/auth'

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    // const session = await auth.api.getSession({
    //     headers: await headers()
    // })
    // const isStartWithAdminPath = request.nextUrl.pathname.startsWith('/admin')
    // if (isStartWithAdminPath && session?.user?.role !== 'admin') {
    //     return NextResponse.rewrite(new URL('/not-found', request.url))
    // }
    return NextResponse.next()
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: [
    '/((?!api/me(?:/|$)|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}