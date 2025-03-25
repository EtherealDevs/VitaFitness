import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('XSRF-TOKEN')
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (token == undefined) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }
}
