import { NextResponse } from 'next/server'

const SPREADSHEET_ID = '1O9Rob88GvYmXgfoYAF5g9-woqs-_aFh1PJbOqHn254w'
const SHEET_GID = '0' // Лист1 обычно имеет gid=0

// Типы для конфигурации формы
export type FieldConfig = {
  section: string
  question: string
  placeholder: string
  required: boolean
  fieldType?: 'text' | 'textarea' | 'email' | 'tel' | 'file'
  accept?: string
  maxLength?: number
  rows?: number
}

export type FormConfig = {
  sections: string[]
  fields: FieldConfig[]
}

function parseCSV(csvText: string): string[][] {
  const lines: string[] = []
  let currentLine = ''
  let inQuotes = false
  
  // Нормализуем переносы строк (CRLF -> LF)
  csvText = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i]
    const nextChar = csvText[i + 1]
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentLine += '"'
        i++
      } else {
        // Toggle quote state
        inQuotes = !inQuotes
      }
    } else if (char === '\n') {
      if (inQuotes) {
        // Перенос строки внутри кавычек - заменяем на пробел
        currentLine += ' '
      } else {
        // End of line
        lines.push(currentLine)
        currentLine = ''
      }
    } else {
      currentLine += char
    }
  }
  
  if (currentLine || lines.length === 0) {
    lines.push(currentLine)
  }
  
  return lines.map(line => {
    const fields: string[] = []
    let currentField = ''
    let fieldInQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      const nextChar = line[i + 1]
      
      if (char === '"') {
        if (fieldInQuotes && nextChar === '"') {
          currentField += '"'
          i++
        } else {
          fieldInQuotes = !fieldInQuotes
        }
      } else if (char === ',' && !fieldInQuotes) {
        fields.push(currentField.trim())
        currentField = ''
      } else {
        currentField += char
      }
    }
    
    fields.push(currentField.trim())
    return fields
  })
}

export async function GET() {
  try {
    // Получаем CSV из Google Sheets через публичный экспорт
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${SHEET_GID}`
    
    const response = await fetch(csvUrl, {
      cache: 'no-store', // Отключаем кэш для разработки
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    })
    
    const contentType = response.headers.get('content-type') || ''
    const csvText = await response.text()
    
    if (!response.ok) {
      console.error('Failed to fetch spreadsheet:', response.status, response.statusText, csvText.substring(0, 200))
      throw new Error(`Failed to fetch spreadsheet: ${response.status} ${response.statusText}`)
    }
    
    if (!contentType.includes('text/csv') && !contentType.includes('text/plain') && !csvText.trim().startsWith('Секция')) {
      console.error('Unexpected content type:', contentType, 'Response:', csvText.substring(0, 200))
      throw new Error('Google Sheets returned unexpected content type. Make sure the spreadsheet is publicly accessible.')
    }
    const rows = parseCSV(csvText)
    
    // Пропускаем первую строку (заголовок "Секция")
    if (rows.length < 4) {
      throw new Error('Invalid CSV structure: expected at least 4 rows')
    }
    
    const sections = rows[0].slice(1) // Пропускаем первый столбец "Секция"
    const questions = rows[1].slice(1) // Пропускаем первый столбец "Вопрос"
    const placeholders = rows[2].slice(1) // Пропускаем первый столбец "Placeholder"
    const requiredStatus = rows[3].slice(1) // Пропускаем первый столбец "Обязательность заполнения"
    
    // Определяем уникальные секции и их порядок
    const uniqueSections: string[] = []
    const sectionOrder: { [key: string]: number } = {}
    let currentSectionIndex = 0
    
    sections.forEach((section, index) => {
      if (section && section.trim() && !sectionOrder.hasOwnProperty(section)) {
        uniqueSections.push(section)
        sectionOrder[section] = currentSectionIndex++
      }
    })
    
    // Создаем конфигурацию полей
    const fields: FieldConfig[] = []
    
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]?.trim()
      const section = sections[i]?.trim()
      
      if (!question || !section) continue
      
      const placeholder = placeholders[i]?.trim() || ''
      const requiredText = requiredStatus[i]?.trim().toLowerCase() || ''
      const required = requiredText === 'обязательно'
      
      // Определяем тип поля по вопросу
      let fieldType: 'text' | 'textarea' | 'email' | 'tel' | 'file' = 'textarea'
      let accept: string | undefined
      let maxLength: number | undefined
      let rows: number | undefined
      
      // Определение типа поля по тексту вопроса
      if (question.toLowerCase().includes('email') || question.toLowerCase().includes('почта')) {
        fieldType = 'email'
        maxLength = 100
      } else if (question.toLowerCase().includes('телефон') || question.toLowerCase().includes('phone')) {
        fieldType = 'tel'
        maxLength = 30
      } else if (question.toLowerCase().includes('загрузите') || question.toLowerCase().includes('приложить')) {
        fieldType = 'file'
        if (question.toLowerCase().includes('резюме')) {
          accept = '.pdf,.doc,.docx'
        } else if (question.toLowerCase().includes('финансовая модель') || question.toLowerCase().includes('финансовую модель')) {
          accept = '.xls,.xlsx,.xlsm,.pdf'
        } else if (question.toLowerCase().includes('файл')) {
          accept = '.pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx'
        }
      } else if (question.toLowerCase().includes('название') || question.toLowerCase().includes('сумму') || question.toLowerCase().includes('%')) {
        fieldType = 'text'
        maxLength = question.toLowerCase().includes('название') ? 200 : 100
      } else {
        fieldType = 'textarea'
        // Определяем длину по типу вопроса
        if (question.toLowerCase().includes('описание') || question.toLowerCase().includes('описать')) {
          maxLength = 3000
          rows = 5
        } else {
          maxLength = 2000
          rows = 3
        }
      }
      
      // Если placeholder содержит "не нужен", используем пустую строку
      const finalPlaceholder = placeholder.toLowerCase().includes('плейсхолдер не нужен') || placeholder.toLowerCase().includes('placeholder не нужен') 
        ? '' 
        : placeholder
      
      fields.push({
        section,
        question,
        placeholder: finalPlaceholder,
        required,
        fieldType,
        accept,
        maxLength,
        rows
      })
    }
    
    const config: FormConfig = {
      sections: uniqueSections,
      fields
    }
    
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching form config:', error)
    return NextResponse.json(
      { error: 'Failed to fetch form configuration', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

