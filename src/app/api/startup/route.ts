import { NextResponse } from 'next/server'
import { submitStartupApplication } from '@/lib/googleSheets'

export async function POST(request: Request) {
  try {
    // Проверяем все необходимые переменные окружения
    console.log('Checking environment variables...')
    console.log('GOOGLE_SCRIPT_URL:', process.env.GOOGLE_SCRIPT_URL ? 'Set' : 'Not set')
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set')
    console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set' : 'Not set')
    console.log('NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL ? 'Set' : 'Not set')

    if (!process.env.GOOGLE_SCRIPT_URL) {
      throw new Error('GOOGLE_SCRIPT_URL is not configured')
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error('Email configuration is not complete')
    }

    const formData = await request.formData()
    console.log('Form data received:', Object.fromEntries(formData.entries()))
    
    const data = Object.fromEntries(formData.entries())
    const pitchDeck = formData.get('pitchDeck') as File | null
    const docs = formData.get('docs') as File | null

    console.log('Files received:', {
      pitchDeck: pitchDeck ? `File: ${pitchDeck.name}, Size: ${pitchDeck.size}` : 'No pitch deck',
      docs: docs ? `File: ${docs.name}, Size: ${docs.size}` : 'No docs'
    })

    const result = await submitStartupApplication(data, pitchDeck, docs)
    console.log('Application submitted successfully:', result)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Detailed error in startup route:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process application',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 