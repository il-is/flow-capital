import { FieldConfig, FormConfig } from '@/app/api/form-config/route'

// Маппинг вопросов к ключам полей формы (для обратной совместимости)
const questionToFieldKey: { [key: string]: string } = {
  'Название стартапа': 'companyName',
  'Контактное лицо (ФИО)': 'contactName',
  'Email': 'email',
  'Контактный телефон': 'phone',
  'Отраслевая экспертиза команды': 'teamExperience',
  'Отраслевая экспертиза': 'teamExperience',
  'Полнота команды': 'teamMembers',
  'Опишите ваш продукт': 'productDescription',
  'Наличие продукта': 'productAvailability',
  'Аудитория продукта': 'productAudience',
  'Уникальное торговое предложение': 'uniqueSellingPoint',
  'Наличие исследований': 'researchAvailability',
  'Технологическая масштабируемость': 'techScalability',
  'Размер рынка': 'marketSize',
  'Текущие продажи': 'currentSales',
  'Текущие расходы': 'currentExpenses',
  'Текущие пользователи': 'currentUsers',
  'Запрашиваемая сумма инвестиций': 'investmentAmount',
  'Какой % компании вы готовы продать?': 'equityPercentage',
  'План использования инвестиций': 'investmentPlan',
  'Масштабируемость проекта (географическая)': 'geographicScalability',
  'Текущие инвестиции и структура капитала': 'currentInvestments',
  'Структура капитала': 'capTable',
  'Оценка компании': 'companyValuation',
  'Рыночные риски': 'marketRisks',
  'Операционные риски': 'operationalRisks',
  'Регистрация компании': 'companyRegistration',
  'Лицензии и регуляторное соответствие': 'licensesCompliance',
  'Что ограничивает компанию от роста до «единорога»': 'growthLimitations',
}

// Функция для генерации ключа поля из вопроса (fallback)
function generateFieldKey(question: string): string {
  return question
    .toLowerCase()
    .replace(/[^a-zа-яё0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 50)
}

// Функция для получения ключа поля из вопроса
export function getFieldKeyFromQuestion(question: string): string {
  // Проверяем точное совпадение
  if (questionToFieldKey[question]) {
    return questionToFieldKey[question]
  }
  
  // Проверяем частичное совпадение
  for (const [keyQuestion, fieldKey] of Object.entries(questionToFieldKey)) {
    if (question.includes(keyQuestion) || keyQuestion.includes(question)) {
      return fieldKey
    }
  }
  
  // Генерируем новый ключ
  return generateFieldKey(question)
}

// Группировка полей по секциям
export function groupFieldsBySection(config: FormConfig): { [section: string]: FieldConfig[] } {
  const grouped: { [section: string]: FieldConfig[] } = {}
  
  config.fields.forEach(field => {
    if (!grouped[field.section]) {
      grouped[field.section] = []
    }
    grouped[field.section].push(field)
  })
  
  return grouped
}

// Получение полей для конкретной секции
export function getFieldsForSection(config: FormConfig, sectionName: string): FieldConfig[] {
  return config.fields.filter(field => field.section === sectionName)
}

// Получение индекса секции по имени
export function getSectionIndex(config: FormConfig, sectionName: string): number {
  return config.sections.indexOf(sectionName)
}

