import { NextRequest, NextResponse } from 'next/server'

// Простая система аутентификации на основе cookies
const ADMIN_USERNAME = process.env.DASHBOARD_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.DASHBOARD_PASSWORD || 'admin123'

export function verifyAuthFromRequest(request: NextRequest): boolean {
  const sessionToken = request.cookies.get('dashboard_session')
  return sessionToken?.value === 'authenticated'
}

export async function login(username: string, password: string): Promise<boolean> {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return true
  }
  return false
}

export function setAuthCookie(response: NextResponse) {
  response.cookies.set('dashboard_session', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 дней
    path: '/',
  })
  return response
}

export function removeAuthCookie(response: NextResponse) {
  response.cookies.delete('dashboard_session')
  return response
}

