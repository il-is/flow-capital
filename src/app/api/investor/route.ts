import { NextResponse } from 'next/server'
import { submitInvestorApplication } from '@/lib/googleSheets'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    await submitInvestorApplication(data)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error submitting investor application:', error)
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    )
  }
} 