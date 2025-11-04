'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Startup {
  [key: string]: any
  scoring?: any
}

export default function DashboardPage() {
  const router = useRouter()
  const [startups, setStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Загрузка данных при монтировании
  useEffect(() => {
    fetchStartups()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Автоматическое обновление каждые 30 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStartups(true) // true = silent refresh (без показа loading)
    }, 30000) // 30 секунд

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchStartups = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true)
      } else {
        setIsRefreshing(true)
      }
      setError(null)
      
      const response = await fetch('/api/dashboard/startups', {
        cache: 'no-store', // Отключаем кэш
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          return
        }
        
        // Пытаемся получить детали ошибки
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.details || errorData.error || 'Failed to fetch startups')
      }

      const data = await response.json()
      const startupsData = data.startups || []
      
      // Добавляем отладочную информацию
      console.log('Received startups:', startupsData.length)
      startupsData.forEach((s: Startup, idx: number) => {
        console.log(`Startup ${idx}:`, {
          name: s['Название стартапа'] || s['название стартапа'] || 'N/A',
          hasScoring: !!s.scoring,
          score: s.scoring?.['Общий скоринг'] || 'N/A'
        })
      })
      
      setStartups(startupsData)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Error fetching startups:', err)
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки данных'
      setError(errorMessage)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchStartups()
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  // Подсчет метрик
  const totalStartups = startups.length
  const startupsWithScoring = startups.filter(s => s.scoring).length
  const averageScore = startupsWithScoring > 0
    ? Math.round(
        startups
          .filter(s => s.scoring && s.scoring['Общий скоринг'])
          .reduce((sum, s) => sum + parseFloat(s.scoring['Общий скоринг'] || '0'), 0) /
          startupsWithScoring
      )
    : 0

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/uploads/20250702_1736_Flow. Capital Logo_simple_compose_01jz5s1dttejqsh8w0435jgzra.png"
                alt="Flow.Capital Logo"
                width={40}
                height={40}
                className=""
                priority
              />
              <h1 className="text-2xl font-bold text-gray-800">Дашборд Flow.Capital</h1>
            </div>
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <div className="text-xs text-gray-500">
                  Обновлено: {lastUpdated.toLocaleTimeString('ru-RU')}
                </div>
              )}
              <button
                onClick={handleRefresh}
                disabled={loading || isRefreshing}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                title="Обновить данные"
              >
                <svg 
                  className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Обновить
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">Ошибка загрузки данных</p>
                <p className="text-sm mt-1">{error}</p>
                <p className="text-xs mt-2 text-red-600">
                  Проверьте настройки GOOGLE_SCRIPT_DASHBOARD_URL в .env.local и доступ скрипта к таблицам
                </p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600 ml-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Метрики */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Всего заявок</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalStartups}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Проанализировано</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{startupsWithScoring}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Средний скоринг</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {averageScore > 0 ? `${averageScore}` : '—'}
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Таблица стартапов */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Список стартапов</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Название
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Контакт
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата заявки
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Скоринг
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {startups.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      Нет данных для отображения
                    </td>
                  </tr>
                ) : (
                  startups.map((startup, index) => {
                    // Получаем скоринг - проверяем разные варианты названий колонок
                    const score = startup.scoring?.['Общий скоринг'] || 
                                   startup.scoring?.['общий скоринг'] ||
                                   startup.scoring?.['Общий скоринг '] ||
                                   null
                    const scoreValue = score !== null && score !== '' ? parseFloat(score.toString()) : null
                    
                    // Используем индекс для навигации (более надежно чем ID)
                    // Получаем название стартапа - проверяем разные варианты названий колонок
                    const startupName = startup['Название стартапа'] || 
                                       startup['Название старт'] ||
                                       startup['название стартапа'] ||
                                       'Без названия'
                    
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {startupName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {startup['Контактное лицо (ФИО)'] || 
                             startup['ФИО'] || 
                             startup['Контактное лицо'] || 
                             '—'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {startup['Email'] || startup['email'] || ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {startup['Дата заявки'] || startup['дата заявки'] || startup['Timestamp']
                            ? new Date(startup['Дата заявки'] || startup['дата заявки'] || startup['Timestamp']).toLocaleDateString('ru-RU')
                            : '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {scoreValue !== null && !isNaN(scoreValue) ? (
                            <div className="flex items-center">
                              <span className="text-sm font-semibold text-gray-900">{scoreValue}</span>
                              <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    scoreValue >= 80
                                      ? 'bg-green-500'
                                      : scoreValue >= 60
                                      ? 'bg-yellow-500'
                                      : 'bg-red-500'
                                  }`}
                                  style={{ width: `${Math.min(scoreValue, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Нет данных</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              router.push(`/dashboard/startup/${index}`)
                            }}
                            className="text-blue-600 hover:text-blue-900 hover:underline cursor-pointer"
                          >
                            Подробнее
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

