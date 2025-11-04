'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'

interface Startup {
  [key: string]: any
  scoring?: any
}

export default function StartupDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [startup, setStartup] = useState<Startup | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStartup()
  }, [id])

  const fetchStartup = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard/startups')
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          return
        }
        throw new Error('Failed to fetch startup')
      }

      const data = await response.json()
      const startups = data.startups || []
      
      // Пытаемся найти по ID заявки, затем по индексу
      let foundStartup = null
      
      // Сначала пробуем найти по ID заявки
      foundStartup = startups.find((s: Startup) => 
        s['ID заявки'] === id || 
        s['id заявки'] === id || 
        s['submissionId'] === id
      )
      
      // Если не найдено, пробуем по индексу
      if (!foundStartup) {
        const startupIndex = parseInt(id)
        if (!isNaN(startupIndex) && startupIndex >= 0 && startupIndex < startups.length) {
          foundStartup = startups[startupIndex]
        }
      }
      
      if (foundStartup) {
        setStartup(foundStartup)
      } else {
        setError('Стартап не найден')
      }
    } catch (err) {
      console.error('Error fetching startup:', err)
      setError(err instanceof Error ? err.message : 'Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    )
  }

  if (error || !startup) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Стартап не найден'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Вернуться к списку
          </button>
        </div>
      </div>
    )
  }

  // Получаем скоринг - проверяем разные варианты названий колонок
  const score = startup.scoring?.['Общий скоринг'] || 
                startup.scoring?.['общий скоринг'] ||
                startup.scoring?.['Общий скоринг '] ||
                null
  const scoreValue = score !== null && score !== '' ? parseFloat(score.toString()) : null

  // Секции для отображения
  const sections = [
    {
      title: 'Интро',
      fields: [
        { key: 'Название стартапа', label: 'Название стартапа' },
        { key: 'Контактное лицо (ФИО)', label: 'Контактное лицо' },
        { key: 'Email', label: 'Email' },
        { key: 'Контактный телефон', label: 'Телефон' },
      ],
      scoringKey: 'Скоринг - Интро',
    },
    {
      title: 'Команда',
      fields: [
        { key: 'Отраслевая экспертиза', label: 'Отраслевая экспертиза' },
        { key: 'Полнота команды', label: 'Полнота команды' },
      ],
      scoringKey: 'Скоринг - Команда',
    },
    {
      title: 'Продукт и технологии',
      fields: [
        { key: 'Опишите ваш продукт', label: 'Описание продукта' },
        { key: 'Наличие продукта', label: 'Наличие продукта' },
        { key: 'Аудитория продукта', label: 'Аудитория продукта' },
        { key: 'Уникальное торговое предложение', label: 'УТП' },
        { key: 'Наличие исследований', label: 'Наличие исследований' },
        { key: 'Технологическая масштабируемость', label: 'Технологическая масштабируемость' },
        { key: 'Размер рынка', label: 'Размер рынка' },
      ],
      scoringKey: 'Скоринг - Продукт',
    },
    {
      title: 'Финансы',
      fields: [
        { key: 'Текущие продажи', label: 'Текущие продажи' },
        { key: 'Текущие расходы', label: 'Текущие расходы' },
        { key: 'Текущие пользователи', label: 'Текущие пользователи' },
        { key: 'Запрашиваемая сумма инвестиций', label: 'Запрашиваемая сумма' },
        { key: 'Какой % компании вы готовы продать', label: '% компании' },
        { key: 'План использования инвестиций', label: 'План использования' },
        { key: 'Текущие инвестиции и структура капитала', label: 'Текущие инвестиции' },
        { key: 'Структура капитала', label: 'Структура капитала' },
        { key: 'Оценка компании', label: 'Оценка компании' },
      ],
      scoringKey: 'Скоринг - Финансы',
    },
    {
      title: 'Риски',
      fields: [
        { key: 'Рыночные риски', label: 'Рыночные риски' },
        { key: 'Операционные риски', label: 'Операционные риски' },
        { key: 'Регистрация компании', label: 'Регистрация компании' },
        { key: 'Лицензии и регуляторное соответствие', label: 'Лицензии и соответствие' },
      ],
      scoringKey: 'Скоринг - Риски',
    },
    {
      title: 'Завершение',
      fields: [
        { key: 'Что ограничивает компанию от роста до «единорога»', label: 'Ограничения роста' },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-gray-800 mr-2"
              >
                ← Назад
              </button>
              <Image
                src="/uploads/20250702_1736_Flow. Capital Logo_simple_compose_01jz5s1dttejqsh8w0435jgzra.png"
                alt="Flow.Capital Logo"
                width={40}
                height={40}
                className=""
                priority
              />
              <h1 className="text-2xl font-bold text-gray-800">Детали стартапа</h1>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Общий скоринг */}
        {scoreValue !== null && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Общий скоринг</h2>
                <p className="text-4xl font-bold text-gray-900">{scoreValue}</p>
              </div>
              <div className="w-32">
                <div className="bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full ${
                      scoreValue >= 80
                        ? 'bg-green-500'
                        : scoreValue >= 60
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${scoreValue}%` }}
                  ></div>
                </div>
              </div>
            </div>
            {startup.scoring?.['Анализ от модели'] && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Анализ и рекомендации</h3>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {startup.scoring['Анализ от модели']}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Секции с данными */}
        <div className="space-y-6">
          {sections.map((section, sectionIndex) => {
            const sectionScore = startup.scoring?.[section.scoringKey]
            const sectionScoreValue = sectionScore ? parseFloat(sectionScore) : null

            return (
              <div key={sectionIndex} className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                  {sectionScoreValue !== null && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Скоринг:</span>
                      <span className="text-lg font-bold text-gray-900">{sectionScoreValue}</span>
                    </div>
                  )}
                </div>
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {section.fields.map((field, fieldIndex) => {
                      const value = startup[field.key]
                      
                      // Проверяем, что значение существует и является строкой перед вызовом trim
                      if (!value) return null
                      
                      // Преобразуем в строку, если это не строка
                      const valueStr = typeof value === 'string' ? value : String(value || '')
                      
                      // Проверяем, что строка не пустая после trim
                      if (valueStr.trim() === '') return null

                      return (
                        <div key={fieldIndex}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label}
                          </label>
                          <p className="text-sm text-gray-900 whitespace-pre-line bg-gray-50 p-3 rounded-lg">
                            {valueStr}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Ссылки на файлы */}
        {(startup['Ссылка на папку с файлами'] ||
          startup['Ссылка на резюме команды'] ||
          startup['Ссылка на финансовую модель'] ||
          startup['Ссылка на дополнительные документы']) && (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Файлы</h2>
            <div className="space-y-2">
              {startup['Ссылка на папку с файлами'] && (
                <a
                  href={startup['Ссылка на папку с файлами']}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 text-sm"
                >
                  📁 Папка с файлами
                </a>
              )}
              {startup['Ссылка на резюме команды'] && (
                <a
                  href={startup['Ссылка на резюме команды']}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 text-sm"
                >
                  📄 Резюме команды
                </a>
              )}
              {startup['Ссылка на финансовую модель'] && (
                <a
                  href={startup['Ссылка на финансовую модель']}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 text-sm"
                >
                  📊 Финансовая модель
                </a>
              )}
              {startup['Ссылка на дополнительные документы'] && (
                <a
                  href={startup['Ссылка на дополнительные документы']}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 text-sm"
                >
                  📎 Дополнительные документы
                </a>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

