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
    
    // Извлекаем текстовые данные (исключаем файлы)
    const data: any = {}
    // Преобразуем итератор в массив для совместимости с TypeScript
    const entries = Array.from(formData.entries())
    for (const [key, value] of entries) {
      if (value instanceof File) {
        // Пропускаем файлы при извлечении текстовых данных
        continue
      }
      data[key] = value
    }
    
    console.log('Form data received:', Object.keys(data))
    console.log('Form data entries count:', Array.from(formData.entries()).length)
    
    // Извлекаем файлы - проверяем каждый отдельно
    const docs = formData.get('docs') as File | null
    const teamResume = formData.get('teamResume') as File | null
    const financialModel = formData.get('financialModel') as File | null

    console.log('Files extraction:', {
      docs: docs ? `File: ${docs.name}, Size: ${docs.size} bytes, Type: ${docs.type}, instanceof File: ${docs instanceof File}` : 'No docs',
      teamResume: teamResume ? `File: ${teamResume.name}, Size: ${teamResume.size} bytes, Type: ${teamResume.type}, instanceof File: ${teamResume instanceof File}` : 'No teamResume',
      financialModel: financialModel ? `File: ${financialModel.name}, Size: ${financialModel.size} bytes, Type: ${financialModel.type}, instanceof File: ${financialModel instanceof File}` : 'No financialModel'
    })
    
    // Проверяем все файловые поля в FormData
    const allEntries = Array.from(formData.entries())
    console.log('All FormData entries:', allEntries.map(([key, value]) => [
      key, 
      value instanceof File 
        ? `File: ${value.name}, ${value.size} bytes` 
        : typeof value === 'string' 
          ? `String: ${value.substring(0, 50)}...` 
          : typeof value
    ]))

    const result = await submitStartupApplication(data, docs, teamResume, financialModel)
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