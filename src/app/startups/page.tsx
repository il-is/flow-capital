"use client";

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import LoadingModal from '@/components/LoadingModal'
import { useRouter } from 'next/navigation'

const SECTION_TITLES = [
  'Основная',
  'Команда',
  'Технологии',
  'Продукт',
  'Финансы',
  'Риски',
];

const INFO_ICON = (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="inline align-middle text-blue-500 cursor-pointer mx-1">
    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/>
    <rect x="9" y="8" width="2" height="6" rx="1" fill="currentColor"/>
    <rect x="9" y="5" width="2" height="2" rx="1" fill="currentColor"/>
  </svg>
);

type FormData = {
  companyName: string;
  industry: string;
  contactName: string;
  email: string;
  phone: string;
  description: string;
  teamExperience: string;
  teamMembers: string;
  teamJointExp: string;
  vision: string;
  investorExp: string;
  techNovelty: string;
  rndInfra: string;
  scalability: string;
  productDescription: string;
  productUnique: string;
  marketSize: string;
  competAdv: string;
  traction: string;
  investment: string;
  investmentPlan: string;
  scalingForecast: string;
  currentInvestments: string;
  capTable: string;
  companyRegistration: string;
  contracts: string;
  noDisputes: string;
  licenses: string;
  ipClean: string;
  risks: string;
  financials: string;
  competitors: string;
}

export default function StartupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const { register, handleSubmit, formState: { errors }, trigger, getValues, setValue, watch } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      companyName: '',
      industry: '',
      contactName: '',
      email: '',
      phone: '',
      description: '',
      teamExperience: '',
      teamMembers: '',
      teamJointExp: '',
      vision: '',
      investorExp: '',
      techNovelty: '',
      rndInfra: '',
      scalability: '',
      productDescription: '',
      productUnique: '',
      marketSize: '',
      competAdv: '',
      traction: '',
      investment: '',
      investmentPlan: '',
      scalingForecast: '',
      currentInvestments: '',
      capTable: '',
      companyRegistration: '',
      contracts: '',
      noDisputes: '',
      licenses: '',
      ipClean: '',
      risks: '',
      financials: '',
      competitors: ''
    }
  })
  const [pitchDeck, setPitchDeck] = useState<File | null>(null)
  const [docs, setDocs] = useState<File | null>(null)
  const [showInfo, setShowInfo] = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [triedNext, setTriedNext] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true)
      setSubmitStatus('loading')
      
      data.submissionDate = new Date().toISOString()
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => formData.append(key, value as string))
      if (pitchDeck) formData.append('pitchDeck', pitchDeck)
      if (docs) formData.append('docs', docs)

      const response = await fetch('/api/startup', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to submit application')

      setSubmitStatus('success')
      setTimeout(() => {
        router.push('/success')
      }, 3000)
    } catch (error) {
      console.error('Error submitting application:', error)
      setSubmitStatus('error')
      setTimeout(() => {
        setSubmitStatus('idle')
        setIsSubmitting(false)
      }, 3000)
    }
  }

  const goToStep = async (target: number) => {
    if (target > step) {
      setTriedNext(true)
      const valid = await trigger(getSectionFields(step))
      if (!valid) return
    }
    setTriedNext(false)
    setStep(target)

    setTimeout(() => {
      const firstInput = document.querySelector(`[data-step="${target}"] input, [data-step="${target}"] textarea`) as HTMLElement
      if (firstInput) {
        firstInput.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        })
        firstInput.focus()
      }
    }, 100)
  }

  function getSectionFields(section: number): (keyof FormData)[] {
    switch (section) {
      case 1:
        return ['companyName', 'industry', 'contactName', 'email', 'phone', 'description']
      case 2:
        return ['teamExperience', 'teamMembers', 'teamJointExp', 'vision', 'investorExp']
      case 3:
        return ['techNovelty', 'rndInfra', 'scalability']
      case 4:
        return ['productDescription', 'productUnique', 'marketSize', 'competAdv']
      case 5:
        return ['traction', 'investment', 'investmentPlan', 'scalingForecast', 'currentInvestments', 'capTable']
      case 6:
        return ['companyRegistration', 'contracts', 'noDisputes', 'licenses', 'ipClean', 'risks', 'financials', 'competitors']
      default:
        return []
    }
  }

  function CharLimit({ limit, field }: { limit: number, field: keyof FormData }) {
    const value = watch(field)?.length || 0;
    const remainingChars = limit - value;
    const showWarning = remainingChars <= limit * 0.2; // Show when 20% or less remaining

    if (!showWarning) return null;
    
    return (
      <div className={`h-6 mt-1 text-sm ${remainingChars <= 0 ? 'text-red-500' : 'text-gray-500'}`}>
        {value}/{limit} символов
      </div>
    );
  }

  function InfoTooltip({ section }: { section: number }) {
    return (
      <span className="relative">
        <span onClick={() => setShowInfo(showInfo === `section${section}` ? null : `section${section}`)}>{INFO_ICON}</span>
        {showInfo === `section${section}` && (
          <span className="absolute left-6 top-0 z-10 bg-white text-gray-800 text-xs rounded shadow-lg px-3 py-2 w-64">
            Заполните поля анкеты для перехода к следующей секции. Если вопрос нерелевантен вашей компании, то поставьте "-".
          </span>
        )}
      </span>
    )
  }

  const sectionNav = (
    <div className="mb-8">
      <div className="flex justify-center gap-6 mb-2">
        {[1,2,3,4,5,6].map((i) => (
          <div key={i} className="flex flex-col items-center">
            <button
              onClick={() => goToStep(i)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-colors mb-1 ${step === i ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-blue-50'}`}
            >
              {i}
            </button>
            <div className={`text-xs md:text-sm text-center mt-1 font-semibold ${step === i ? 'text-blue-700' : 'text-gray-500'}`} style={{maxWidth: 110}}>
              {SECTION_TITLES[i-1]}
            </div>
          </div>
        ))}
        <span className="ml-3 align-middle self-start"><InfoTooltip section={step} /></span>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen pt-16 flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Привлеките инвестиции для вашего стартапа
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl mb-8"
          >
            Заполните форму ниже, и мы свяжемся с вами для обсуждения возможностей сотрудничества
          </motion.p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 px-4 flex-1">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {sectionNav}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
              {step === 1 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 0.5 }} 
                  className="space-y-6"
                  data-step="1"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Название стартапа</label>
                    <input type="text" {...register('companyName', { required: true })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" onFocus={() => setFocusedField('companyName')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={200} field="companyName" />
                    <div className="min-h-[22px]">{triedNext && errors.companyName && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Сфера деятельности</label>
                    <select {...register('industry', { required: true })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" onFocus={() => setFocusedField('industry')} onBlur={() => setFocusedField(null)}>
                      <option value="">Выберите сферу</option>
                      <option value="fintech">Финтех</option>
                      <option value="ai">AI/ML</option>
                      <option value="retail">Ритейл</option>
                      <option value="tech">Технологии</option>
                      <option value="other">Другое</option>
                    </select>
                    <CharLimit limit={100} field="industry" />
                    <div className="min-h-[22px]">{triedNext && errors.industry && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Контактное лицо</label>
                      <input type="text" {...register('contactName', { required: true })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" onFocus={() => setFocusedField('contactName')} onBlur={() => setFocusedField(null)} />
                      <CharLimit limit={100} field="contactName" />
                      <div className="min-h-[22px]">{triedNext && errors.contactName && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input type="email" {...register('email', { required: true, pattern: /^\S+@\S+$/i })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} />
                      <CharLimit limit={100} field="email" />
                      <div className="min-h-[22px]">{triedNext && errors.email && <p className="mt-1 text-sm text-red-600">Введите корректный email</p>}</div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Контактный телефон</label>
                    <input type="tel" {...register('phone')} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={30} field="phone" />
                    <div className="min-h-[22px]">&nbsp;</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Краткое описание стартапа</label>
                    <textarea {...register('description', { required: true, maxLength: 2000 })} rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} onFocus={() => setFocusedField('description')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="description" />
                    {triedNext && errors.description && <p className="mt-1 text-sm text-red-600">Это поле обязательно (до 200 слов)</p>}
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 0.5 }} 
                  className="space-y-6"
                  data-step="2"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Опыт команды в отрасли</label>
                    <textarea {...register('teamExperience', { required: true, maxLength: 3000 })} rows={5} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={3000} onFocus={() => setFocusedField('teamExperience')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={3000} field="teamExperience" />
                    {triedNext && errors.teamExperience && <p className="mt-1 text-sm text-red-600">Это поле обязательно (до 300 слов)</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Состав команды</label>
                    <textarea {...register('teamMembers', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" onFocus={() => setFocusedField('teamMembers')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="teamMembers" />
                    {triedNext && errors.teamMembers && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Совместный опыт команды</label>
                    <textarea {...register('teamJointExp', { maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} onFocus={() => setFocusedField('teamJointExp')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="teamJointExp" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Видение и стратегия</label>
                    <textarea {...register('vision', { required: true, maxLength: 3000 })} rows={5} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={3000} onFocus={() => setFocusedField('vision')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={3000} field="vision" />
                    {triedNext && errors.vision && <p className="mt-1 text-sm text-red-600">Это поле обязательно (до 300 слов)</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Опыт общения с инвесторами</label>
                    <textarea {...register('investorExp', { maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} onFocus={() => setFocusedField('investorExp')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="investorExp" />
                  </div>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 0.5 }} 
                  className="space-y-6"
                  data-step="3"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Новизна технологии</label>
                    <textarea {...register('techNovelty', { required: true, maxLength: 3000 })} rows={5} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={3000} onFocus={() => setFocusedField('techNovelty')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={3000} field="techNovelty" />
                    {triedNext && errors.techNovelty && <p className="mt-1 text-sm text-red-600">Это поле обязательно (до 300 слов)</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">R&D-инфраструктура</label>
                    <textarea {...register('rndInfra', { maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} onFocus={() => setFocusedField('rndInfra')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="rndInfra" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Технологическая масштабируемость</label>
                    <textarea {...register('scalability', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} onFocus={() => setFocusedField('scalability')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="scalability" />
                    {triedNext && errors.scalability && <p className="mt-1 text-sm text-red-600">Это поле обязательно (до 200 слов)</p>}
                  </div>
                </motion.div>
              )}
              {step === 4 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 0.5 }} 
                  className="space-y-6"
                  data-step="4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Описание продукта и стадии</label>
                    <div className="relative">
                      <textarea
                        {...register('productDescription', { 
                          required: 'Это поле обязательно',
                          maxLength: {
                            value: 1000,
                            message: 'Максимум 1000 символов'
                          }
                        })}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.productDescription ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                        rows={6}
                        placeholder="Опишите ваш продукт и на какой стадии разработки он находится"
                      />
                      <CharLimit limit={1000} field="productDescription" />
                    </div>
                    {errors.productDescription && (
                      <p className="mt-1 text-sm text-red-500">{errors.productDescription.message as string}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Уникальность продукта</label>
                    <textarea {...register('productUnique', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} onFocus={() => setFocusedField('productUnique')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="productUnique" />
                    {triedNext && errors.productUnique && <p className="mt-1 text-sm text-red-600">Это поле обязательно (до 200 слов)</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Размер и динамика рынка</label>
                    <textarea {...register('marketSize', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} onFocus={() => setFocusedField('marketSize')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="marketSize" />
                    {triedNext && errors.marketSize && <p className="mt-1 text-sm text-red-600">Это поле обязательно (до 200 слов)</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Конкурентные преимущества</label>
                    <textarea {...register('competAdv', { maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} onFocus={() => setFocusedField('competAdv')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="competAdv" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Питч-дек (PDF, до 10 МБ)</label>
                    <input type="file" accept="application/pdf" onChange={e => setPitchDeck(e.target.files?.[0] || null)} className="w-full" />
                    {triedNext && pitchDeck && pitchDeck.size > 10 * 1024 * 1024 && <p className="mt-1 text-sm text-red-600">Файл не должен превышать 10 МБ</p>}
                  </div>
                </motion.div>
              )}
              {step === 5 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 0.5 }} 
                  className="space-y-6"
                  data-step="5"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Текущие результаты (traction)</label>
                    <div className="relative">
                      <textarea
                        {...register('traction', { 
                          required: 'Это поле обязательно',
                          maxLength: {
                            value: 1000,
                            message: 'Максимум 1000 символов'
                          }
                        })}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.traction ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                        rows={6}
                        placeholder="Опишите текущие результаты проекта"
                      />
                      <CharLimit limit={1000} field="traction" />
                    </div>
                    {errors.traction && (
                      <p className="mt-1 text-sm text-red-500">{errors.traction.message as string}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Сумма инвестиций</label>
                    <input type="text" {...register('investment', { required: true })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" />
                    {triedNext && errors.investment && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">План использования инвестиций</label>
                    <div className="relative">
                      <textarea
                        {...register('investmentPlan', { 
                          required: 'Это поле обязательно',
                          maxLength: {
                            value: 1000,
                            message: 'Максимум 1000 символов'
                          }
                        })}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.investmentPlan ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                        rows={6}
                        placeholder="Опишите, как вы планируете использовать инвестиции"
                      />
                      <CharLimit limit={1000} field="investmentPlan" />
                    </div>
                    {errors.investmentPlan && (
                      <p className="mt-1 text-sm text-red-500">{errors.investmentPlan.message as string}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Прогноз масштабирования</label>
                    <textarea {...register('scalingForecast', { maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} onFocus={() => setFocusedField('scalingForecast')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="scalingForecast" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Текущие инвестиции</label>
                    <textarea {...register('currentInvestments', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} onFocus={() => setFocusedField('currentInvestments')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="currentInvestments" />
                    {triedNext && errors.currentInvestments && <p className="mt-1 text-sm text-red-600">Это поле обязательно (до 200 слов)</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Структура капитала</label>
                    <textarea {...register('capTable', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} onFocus={() => setFocusedField('capTable')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="capTable" />
                    {triedNext && errors.capTable && <p className="mt-1 text-sm text-red-600">Это поле обязательно (до 200 слов)</p>}
                  </div>
                </motion.div>
              )}
              {step === 6 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 0.5 }} 
                  className="space-y-6"
                  data-step="6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Регистрация компании</label>
                    <div className="relative">
                      <textarea
                        {...register('companyRegistration', { 
                          required: false,
                          maxLength: {
                            value: 1000,
                            message: 'Максимум 1000 символов'
                          }
                        })}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.companyRegistration ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                        rows={6}
                        placeholder="Опишите статус регистрации компании"
                      />
                      <CharLimit limit={1000} field="companyRegistration" />
                    </div>
                    {errors.companyRegistration && (
                      <p className="mt-1 text-sm text-red-500">{errors.companyRegistration.message as string}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Договорная база</label>
                    <textarea {...register('contracts', { maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} onFocus={() => setFocusedField('contracts')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="contracts" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Отсутствие споров</label>
                    <textarea {...register('noDisputes', { required: true, maxLength: 1000 })} rows={2} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={1000} onFocus={() => setFocusedField('noDisputes')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={1000} field="noDisputes" />
                    {triedNext && errors.noDisputes && <p className="mt-1 text-sm text-red-600">Это поле обязательно (до 100 слов)</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Лицензии и соответствие</label>
                    <textarea {...register('licenses', { maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} onFocus={() => setFocusedField('licenses')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="licenses" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Чистота IP</label>
                    <textarea {...register('ipClean', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} onFocus={() => setFocusedField('ipClean')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="ipClean" />
                    {triedNext && errors.ipClean && <p className="mt-1 text-sm text-red-600">Это поле обязательно (до 200 слов)</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Рыночные и операционные риски</label>
                    <textarea {...register('risks', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} onFocus={() => setFocusedField('risks')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="risks" />
                    {triedNext && errors.risks && <p className="mt-1 text-sm text-red-600">Это поле обязательно (до 200 слов)</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Финансовые показатели</label>
                    <div className="relative">
                      <textarea
                        {...register('financials', { 
                          
                          maxLength: {
                            value: 1000,
                            message: 'Максимум 1000 символов'
                          }
                        })}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.financials ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                        rows={6}
                        placeholder="Опишите финансовые показатели проекта"
                      />
                      <CharLimit limit={1000} field="financials" />
                    </div>
                    {errors.financials && (
                      <p className="mt-1 text-sm text-red-500">{errors.financials.message as string}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Конкуренты</label>
                    <div className="relative">
                      <textarea
                        {...register('competitors', { 
                          
                          maxLength: {
                            value: 1000,
                            message: 'Максимум 1000 символов'
                          }
                        })}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.competitors ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                        rows={6}
                        placeholder="Опишите конкурентов и ваши конкурентные преимущества"
                      />
                      <CharLimit limit={1000} field="competitors" />
                    </div>
                    {errors.competitors && (
                      <p className="mt-1 text-sm text-red-500">{errors.competitors.message as string}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Документы (PDF, до 10 МБ)</label>
                    <input type="file" accept="application/pdf" onChange={e => setDocs(e.target.files?.[0] || null)} className="w-full" />
                    {triedNext && docs && docs.size > 10 * 1024 * 1024 && <p className="mt-1 text-sm text-red-600">Файл не должен превышать 10 МБ</p>}
                  </div>
                </motion.div>
              )}
              <div className="flex justify-between pt-6">
                {step > 1 && (
                  <button type="button" onClick={() => goToStep(step - 1)} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">Назад</button>
                )}
                {step < 6 ? (
                  <button type="button" onClick={() => goToStep(step + 1)} className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Далее</button>
                ) : (
                  <button type="submit" className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Отправить заявку</button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8 mt-0">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-white">Flow.Capital</span>
            <span className="text-xs text-gray-400">© {new Date().getFullYear()} Все права защищены</span>
          </div>
          <nav className="flex gap-6 text-gray-400 text-sm">
            </nav>
          <div className="flex gap-4 text-gray-400">
           </div>
        </div>
      </footer>

      {/* Loading Modal */}
      <LoadingModal 
        isOpen={isSubmitting} 
        message={
          submitStatus === 'loading' ? 'Отправка заявки...' :
          submitStatus === 'success' ? 'Заявка успешно отправлена!' :
          submitStatus === 'error' ? 'Произошла ошибка при отправке заявки' :
          'Отправка заявки...'
        }
      />
    </div>
  )
} 