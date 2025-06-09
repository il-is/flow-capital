import { NextResponse } from 'next/server'
import { submitStartupApplication } from '@/lib/googleSheets'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    await submitStartupApplication(data)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error submitting startup application:', error)
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    )
  }
} 