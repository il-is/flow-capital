"use client";
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'

export default function InvestorPage() {
  const [step, setStep] = useState(1)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/investor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to submit application')
      }

      // Показать сообщение об успехе
      alert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.')
      
      // Сбросить форму
      setStep(1)
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.')
    }
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Станьте инвестором перспективных стартапов
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl mb-8"
          >
            Заполните форму ниже, и мы свяжемся с вами для обсуждения возможностей инвестирования
          </motion.p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between mb-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    i === step
                      ? 'bg-blue-600 text-white'
                      : i < step
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {i}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Тип инвестора
                    </label>
                    <select
                      {...register('investorType', { required: true })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Выберите тип</option>
                      <option value="individual">Частный инвестор</option>
                      <option value="corporate">Корпоративный инвестор</option>
                      <option value="fund">Инвестиционный фонд</option>
                    </select>
                    {errors.investorType && (
                      <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Предпочитаемые сферы инвестирования
                    </label>
                    <div className="space-y-2">
                      {['fintech', 'ai', 'retail', 'other'].map((industry) => (
                        <label key={industry} className="flex items-center">
                          <input
                            type="checkbox"
                            value={industry}
                            {...register('industries')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-gray-700">
                            {industry === 'fintech' && 'Финтех'}
                            {industry === 'ai' && 'Искусственный интеллект'}
                            {industry === 'retail' && 'Ритейл'}
                            {industry === 'other' && 'Другое'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Опыт инвестирования
                    </label>
                    <select
                      {...register('experience', { required: true })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Выберите опыт</option>
                      <option value="none">Нет опыта</option>
                      <option value="beginner">Начинающий</option>
                      <option value="intermediate">Средний</option>
                      <option value="expert">Эксперт</option>
                    </select>
                    {errors.experience && (
                      <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Размер инвестиций (руб)
                    </label>
                    <input
                      type="number"
                      {...register('investmentSize', { required: true })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.investmentSize && (
                      <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Предпочитаемая стадия проекта
                    </label>
                    <select
                      {...register('preferredStage', { required: true })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Выберите стадию</option>
                      <option value="idea">Идея</option>
                      <option value="mvp">MVP</option>
                      <option value="early">Ранняя стадия</option>
                      <option value="growth">Стадия роста</option>
                    </select>
                    {errors.preferredStage && (
                      <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ожидаемый срок инвестирования
                    </label>
                    <select
                      {...register('investmentPeriod', { required: true })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Выберите срок</option>
                      <option value="1-2">1-2 года</option>
                      <option value="3-5">3-5 лет</option>
                      <option value="5+">Более 5 лет</option>
                    </select>
                    {errors.investmentPeriod && (
                      <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Контактное лицо
                    </label>
                    <input
                      type="text"
                      {...register('contactName', { required: true })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.contactName && (
                      <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">Введите корректный email</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      {...register('phone', { required: true })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>
                    )}
                  </div>
                </motion.div>
              )}

              <div className="flex justify-between pt-6">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Назад
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Далее
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Отправить заявку
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
} 