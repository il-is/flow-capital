// ID веб-приложения Google Apps Script для дашборда (отдельный скрипт)
const GOOGLE_SCRIPT_DASHBOARD_URL = process.env.GOOGLE_SCRIPT_DASHBOARD_URL || process.env.GOOGLE_SCRIPT_URL

// Получение данных из Google Sheets через Google Apps Script
export async function getStartupApplications() {
  try {
    if (!GOOGLE_SCRIPT_DASHBOARD_URL) {
      throw new Error('GOOGLE_SCRIPT_DASHBOARD_URL is not configured')
    }

    const url = `${GOOGLE_SCRIPT_DASHBOARD_URL}?action=getStartups`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text()
      throw new Error(`Expected JSON but got ${contentType}. Response: ${text.substring(0, 200)}`)
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch startups: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to get startups')
    }

    return data.startups || []
  } catch (error) {
    console.error('Error reading startup applications:', error)
    throw error
  }
}

// Получение данных скоринга из отдельной таблицы через Google Apps Script
// Структура листа "Скоринг":
// Дата скоринга | Название стартапа | ФИО | Email | Контактный телефон | 
// Общий скоринг | Скоринг - Интро | Скоринг - Команда | Скоринг - Продукт | 
// Скоринг - Финансы | Скоринг - Риски | Анализ от модели
export async function getScoringData() {
  try {
    if (!GOOGLE_SCRIPT_DASHBOARD_URL) {
      return []
    }

    const url = `${GOOGLE_SCRIPT_DASHBOARD_URL}?action=getScoring`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('Expected JSON but got:', contentType)
      return []
    }

    if (!response.ok) {
      console.warn('Failed to fetch scoring data, returning empty array')
      return []
    }

    const data = await response.json()
    
    if (!data.success) {
      console.warn('Failed to get scoring data, returning empty array')
      return []
    }

    return data.scoring || []
  } catch (error) {
    console.error('Error reading scoring data:', error)
    // Если лист не существует или произошла ошибка, возвращаем пустой массив
    return []
  }
}

// Объединение данных заявок и скоринга через Google Apps Script
export async function getStartupsWithScoring() {
  try {
    if (!GOOGLE_SCRIPT_DASHBOARD_URL) {
      throw new Error('GOOGLE_SCRIPT_DASHBOARD_URL is not configured')
    }

    const url = `${GOOGLE_SCRIPT_DASHBOARD_URL}?action=getStartupsWithScoring`
    console.log('Fetching from:', url)

    // Используем единый endpoint для получения объединенных данных
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    // Проверяем Content-Type перед парсингом
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text()
      console.error('Expected JSON but got:', contentType)
      console.error('Response preview:', text.substring(0, 500))
      
      // Если это HTML, скорее всего это страница ошибки или авторизации
      if (text.includes('<!doctype') || text.includes('<html')) {
        throw new Error(
          'Google Apps Script returned HTML instead of JSON. ' +
          'This usually means: 1) Script is not deployed correctly, ' +
          '2) Script requires authorization, or 3) Script URL is incorrect. ' +
          'Please check the script deployment and URL.'
        )
      }
      
      throw new Error(`Invalid response type: ${contentType}. Response: ${text.substring(0, 200)}`)
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      throw new Error(`Failed to fetch startups with scoring: ${response.status} - ${errorText.substring(0, 200)}`)
    }

    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to get startups with scoring')
    }

    return data.startups || []
  } catch (error) {
    console.error('Error combining startup and scoring data:', error)
    throw error
  }
}

