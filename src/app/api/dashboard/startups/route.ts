import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthFromRequest } from '@/lib/auth'
import { getStartupsWithScoring } from '@/lib/googleSheetsReader'

export async function GET(request: NextRequest) {
  try {
    // Проверка аутентификации
    if (!verifyAuthFromRequest(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Проверяем наличие GOOGLE_SCRIPT_DASHBOARD_URL
    const dashboardUrl = process.env.GOOGLE_SCRIPT_DASHBOARD_URL || process.env.GOOGLE_SCRIPT_URL
    if (!dashboardUrl) {
      return NextResponse.json(
        {
          error: 'GOOGLE_SCRIPT_DASHBOARD_URL is not configured',
          details: 'Please set GOOGLE_SCRIPT_DASHBOARD_URL in .env.local',
        },
        { status: 500 }
      )
    }

    const startups = await getStartupsWithScoring()

    return NextResponse.json({ startups })
  } catch (error) {
    console.error('Error fetching startups:', error)
    
    // Более детальная информация об ошибке
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
      GOOGLE_SCRIPT_DASHBOARD_URL: process.env.GOOGLE_SCRIPT_DASHBOARD_URL ? 'Set' : 'Not set',
      GOOGLE_SCRIPT_URL: process.env.GOOGLE_SCRIPT_URL ? 'Set' : 'Not set',
    })

    return NextResponse.json(
      {
        error: 'Failed to fetch startups',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}

