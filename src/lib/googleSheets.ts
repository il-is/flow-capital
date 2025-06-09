import { google } from 'googleapis'

// Инициализация клиента Google Sheets
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const sheets = google.sheets({ version: 'v4', auth })

// Функция для добавления данных в Google Sheets
export async function appendToSheet(spreadsheetId: string, range: string, values: any[]) {
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [values],
      },
    })
    return response.data
  } catch (error) {
    console.error('Error appending to sheet:', error)
    throw error
  }
}

// Функция для отправки заявки стартапа
export async function submitStartupApplication(data: any) {
  const spreadsheetId = process.env.STARTUP_SHEET_ID
  const range = 'Sheet1!A:Z'
  
  const values = [
    new Date().toISOString(),
    data.companyName,
    data.industry,
    data.description,
    data.stage,
    data.revenue,
    data.investment,
    data.contactName,
    data.email,
    data.phone,
  ]

  return appendToSheet(spreadsheetId!, range, values)
}

// Функция для отправки заявки инвестора
export async function submitInvestorApplication(data: any) {
  const spreadsheetId = process.env.INVESTOR_SHEET_ID
  const range = 'Sheet1!A:Z'
  
  const values = [
    new Date().toISOString(),
    data.investorType,
    data.industries?.join(', '),
    data.experience,
    data.investmentSize,
    data.preferredStage,
    data.investmentPeriod,
    data.contactName,
    data.email,
    data.phone,
  ]

  return appendToSheet(spreadsheetId!, range, values)
} 