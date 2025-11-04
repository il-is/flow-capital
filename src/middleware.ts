import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Проверяем, является ли запрос к защищенному роуту дашборда
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const sessionToken = request.cookies.get('dashboard_session')
    
    // Если нет сессии, перенаправляем на страницу логина
    if (!sessionToken || sessionToken.value !== 'authenticated') {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Если запрос к /login и уже есть сессия, перенаправляем на дашборд
  if (request.nextUrl.pathname === '/login') {
    const sessionToken = request.cookies.get('dashboard_session')
    if (sessionToken?.value === 'authenticated') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}

