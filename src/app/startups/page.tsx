"use client";

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import LoadingModal from '@/components/LoadingModal'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const SECTION_TITLES = [
  'Интро',
  'Команда',
  'Продукт и технологии',
  'Финансы',
  'Риски',
  'Завершение',
];

const INFO_ICON = (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="inline align-middle text-blue-500 cursor-pointer mx-1">
    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/>
    <rect x="9" y="8" width="2" height="6" rx="1" fill="currentColor"/>
    <rect x="9" y="5" width="2" height="2" rx="1" fill="currentColor"/>
  </svg>
);

type FormData = {
  // Интро
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  
  // Команда
  teamExperience: string;
  teamMembers: string;
  teamComment: string;
  
  // Продукт и технологии
  productDescription: string;
  productAvailability: string;
  productAudience: string;
  uniqueSellingPoint: string;
  productUniqueness: string;
  researchAvailability: string;
  techScalability: string;
  marketSize: string;
  productTechComment: string;
  
  // Финансы
  currentSales: string;
  currentUsers: string;
  investmentAmount: string;
  equityPercentage: string;
  investmentPlan: string;
  geographicScalability: string;
  unitEconomics: string;
  currentInvestments: string;
  capTable: string;
  companyValuation: string;
  financeComment: string;
  
  // Риски
  marketRisks: string;
  operationalRisks: string;
  companyRegistration: string;
  licensesCompliance: string;
  risksComment: string;
  
  // Завершение
  growthLimitations: string;
}

export default function StartupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const { register, handleSubmit, formState: { errors }, trigger, getValues, setValue, watch } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      teamExperience: '',
      teamMembers: '',
      teamComment: '',
      productDescription: '',
      productAvailability: '',
      productAudience: '',
      uniqueSellingPoint: '',
      productUniqueness: '',
      researchAvailability: '',
      techScalability: '',
      marketSize: '',
      productTechComment: '',
      currentSales: '',
      currentUsers: '',
      investmentAmount: '',
      equityPercentage: '',
      investmentPlan: '',
      geographicScalability: '',
      unitEconomics: '',
      currentInvestments: '',
      capTable: '',
      companyValuation: '',
      financeComment: '',
      marketRisks: '',
      operationalRisks: '',
      companyRegistration: '',
      licensesCompliance: '',
      risksComment: '',
      growthLimitations: ''
    }
  })
  const [pitchDeck, setPitchDeck] = useState<File | null>(null)
  const [docs, setDocs] = useState<File | null>(null)
  const [showInfo, setShowInfo] = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [triedNext, setTriedNext] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const sectionNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Автопрокрутка к активному шагу
    const activeBtn = sectionNavRef.current?.querySelector('.section-step-active');
    if (activeBtn && sectionNavRef.current) {
      const parent = sectionNavRef.current;
      const btnRect = (activeBtn as HTMLElement).getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      // Скроллим так, чтобы активный шаг был по центру
      parent.scrollTo({
        left: (activeBtn as HTMLElement).offsetLeft - parentRect.width / 2 + btnRect.width / 2,
        behavior: 'smooth',
      });
    }
  }, [step]);

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
      setTriedNext(true);
      const valid = await trigger(getSectionFields(step));
      if (!valid) return;
    }
    setTriedNext(false);
    setStep(target);

    // Плавная анимация перехода к новой секции
    const formSection = document.querySelector(`[data-step="${target}"]`);
    if (formSection) {
      formSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  function getSectionFields(section: number): (keyof FormData)[] {
    switch (section) {
      case 1:
        return ['companyName', 'contactName', 'phone']
      case 2:
        return ['teamExperience', 'teamMembers']
      case 3:
        return ['productDescription', 'productAvailability', 'productAudience', 'uniqueSellingPoint', 'productUniqueness', 'researchAvailability', 'techScalability', 'marketSize']
      case 4:
        return ['currentSales', 'currentUsers', 'investmentAmount', 'equityPercentage', 'investmentPlan', 'geographicScalability', 'unitEconomics', 'currentInvestments', 'capTable', 'companyValuation']
      case 5:
        return ['marketRisks', 'operationalRisks', 'companyRegistration', 'licensesCompliance']
      case 6:
        return ['growthLimitations']
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

  // Добавляем функцию для подсчета заполненных полей в секции
  const getFilledFieldsCount = (section: number) => {
    const fields = getSectionFields(section);
    return fields.filter(field => {
      const value = watch(field);
      return value && value.trim() !== '';
    }).length;
  };

  // Добавляем функцию для подсчета обязательных полей в секции
  const getRequiredFieldsCount = (section: number) => {
    const fields = getSectionFields(section);
    return fields.filter(field => {
      const validation = register(field).required;
      return validation;
    }).length;
  };

  const sectionNav = (
    <div className="mb-8">
      <div className="flex gap-6 mb-2 px-2 -mx-2 flex-wrap justify-center">
        {[1,2,3,4,5,6].map((i) => {
          const filledCount = getFilledFieldsCount(i);
          const requiredCount = getRequiredFieldsCount(i);
          const progress = requiredCount > 0 ? Math.round((filledCount / requiredCount) * 100) : 0;
          
          return (
            <div key={i} className="flex flex-col items-center min-w-[80px]">
              <button
                onClick={() => goToStep(i)}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-colors mb-1 relative
                  ${step === i ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-blue-50'}`}
                style={{ minWidth: 48 }}
              >
                {i}
                {progress > 0 && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </button>
              <div className={`text-xs md:text-sm text-center mt-1 font-semibold ${step === i ? 'text-blue-700' : 'text-gray-500'}`} style={{maxWidth: 110}}>
                {SECTION_TITLES[i-1]}
              </div>
              {progress > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  {progress}%
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="text-center text-sm text-gray-500 mb-2">
        Заполните информацию для перехода к следующей секции. Если вопрос нерелевантен вашему проекту или ответа нет на данном этапе, то поставьте "-".
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Контактное лицо (ФИО)</label>
                    <input type="text" {...register('contactName', { required: true })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" onFocus={() => setFocusedField('contactName')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={100} field="contactName" />
                    <div className="min-h-[22px]">{triedNext && errors.contactName && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" {...register('email')} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={100} field="email" />
                    <div className="min-h-[22px]">&nbsp;</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Контактный телефон</label>
                    <input type="tel" {...register('phone', { required: true })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={30} field="phone" />
                    <div className="min-h-[22px]">{triedNext && errors.phone && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}</div>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Отраслевая экспертиза</label>
                    <textarea {...register('teamExperience', { required: true, maxLength: 3000 })} rows={5} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={3000} placeholder="Опыт команды проекта в отрасли, опыт фаундеров" onFocus={() => setFocusedField('teamExperience')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={3000} field="teamExperience" />
                    {triedNext && errors.teamExperience && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Полнота команды</label>
                    <textarea {...register('teamMembers', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" placeholder="Состав вашей команды. Кто уже работает над проектом и какие потребности" onFocus={() => setFocusedField('teamMembers')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="teamMembers" />
                    {triedNext && errors.teamMembers && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Комментарий к блоку "Команда"</label>
                    <textarea {...register('teamComment', { maxLength: 1000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={1000} placeholder="Любой комментарий к блоку 'Команда'. Заполнение необязательно." onFocus={() => setFocusedField('teamComment')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={1000} field="teamComment" />
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Опишите ваш продукт</label>
                    <textarea {...register('productDescription', { required: true, maxLength: 3000 })} rows={5} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={3000} placeholder="Опишите проблему и как её решает ваш продукт. Опишите основные применяемые технологии." onFocus={() => setFocusedField('productDescription')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={3000} field="productDescription" />
                    {triedNext && errors.productDescription && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Наличие продукта</label>
                    <textarea {...register('productAvailability', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Есть ли у вас рабочий прототип или продукт?" onFocus={() => setFocusedField('productAvailability')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="productAvailability" />
                    {triedNext && errors.productAvailability && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Аудитория продукта</label>
                    <textarea {...register('productAudience', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Опишите вашу целевую аудиторию" onFocus={() => setFocusedField('productAudience')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="productAudience" />
                    {triedNext && errors.productAudience && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Уникальное торговое предложение</label>
                    <textarea {...register('uniqueSellingPoint', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Опишите ваше уникальное торговое предложение" onFocus={() => setFocusedField('uniqueSellingPoint')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="uniqueSellingPoint" />
                    {triedNext && errors.uniqueSellingPoint && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Уникальность решения</label>
                    <textarea {...register('productUniqueness', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Насколько ваш продукт уникален?" onFocus={() => setFocusedField('productUniqueness')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="productUniqueness" />
                    {triedNext && errors.productUniqueness && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Наличие исследований</label>
                    <textarea {...register('researchAvailability', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Опишите планы развития проекта и цели" onFocus={() => setFocusedField('researchAvailability')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="researchAvailability" />
                    {triedNext && errors.researchAvailability && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Технологическая масштабируемость</label>
                    <textarea {...register('techScalability', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Есть ли какие либо технологические ограничения в проекте? Насколько технически возможно масштабирование?" onFocus={() => setFocusedField('techScalability')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="techScalability" />
                    {triedNext && errors.techScalability && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Размер рынка</label>
                    <textarea {...register('marketSize', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Приведите результаты вашего анализа рынка" onFocus={() => setFocusedField('marketSize')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="marketSize" />
                    {triedNext && errors.marketSize && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Комментарий к блоку "Продукт и технологии"</label>
                    <textarea {...register('productTechComment', { maxLength: 1000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={1000} placeholder="Любой комментарий к блоку 'Продукт и технологии'. Заполнение необязательно." onFocus={() => setFocusedField('productTechComment')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={1000} field="productTechComment" />
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Текущие продажи</label>
                    <textarea {...register('currentSales', { required: true, maxLength: 1000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" placeholder="Какая выручка за последний месяц/квартал/год" />
                    <CharLimit limit={1000} field="currentSales" />
                    {triedNext && errors.currentSales && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Текущие пользователи</label>
                    <textarea {...register('currentUsers', { required: true, maxLength: 1000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" placeholder="Какая динамика по пользователям за последний год (DAU/MAU)" />
                    <CharLimit limit={1000} field="currentUsers" />
                    {triedNext && errors.currentUsers && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Запрашиваемая сумма инвестиций</label>
                    <input type="text" {...register('investmentAmount', { required: true })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" placeholder="Укажите сумму инвестиций" />
                    {triedNext && errors.investmentAmount && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Какой % компании вы готовы продать?</label>
                    <input type="text" {...register('equityPercentage', { required: true })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" placeholder="Укажите % компании, который вы готовы продать" />
                    {triedNext && errors.equityPercentage && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">План использования инвестиций</label>
                    <textarea {...register('investmentPlan', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Какой план использования привлекаемых инвестиций" />
                    <CharLimit limit={2000} field="investmentPlan" />
                    {triedNext && errors.investmentPlan && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Масштабируемость проекта (географическая)</label>
                    <textarea {...register('geographicScalability', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Какой потенциал географического роста" />
                    <CharLimit limit={2000} field="geographicScalability" />
                    {triedNext && errors.geographicScalability && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unit-экономика</label>
                    <textarea {...register('unitEconomics', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Опишите и предоставьте расчеты по ключевым метрикам вашего проекта" />
                    <CharLimit limit={2000} field="unitEconomics" />
                    {triedNext && errors.unitEconomics && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Текущие инвестиции</label>
                    <textarea {...register('currentInvestments', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Опишите текущие инвестиции в проект" />
                    <CharLimit limit={2000} field="currentInvestments" />
                    {triedNext && errors.currentInvestments && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Структура капитала</label>
                    <textarea {...register('capTable', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Распределение долей компании" />
                    <CharLimit limit={2000} field="capTable" />
                    {triedNext && errors.capTable && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Оценка компании</label>
                    <textarea {...register('companyValuation', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="При наличии сторонней оценки компании" />
                    <CharLimit limit={2000} field="companyValuation" />
                    {triedNext && errors.companyValuation && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Комментарий к блоку "Финансы"</label>
                    <textarea {...register('financeComment', { maxLength: 1000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={1000} placeholder="Любой комментарий к блоку 'Финансы'. Заполнение необязательно." />
                    <CharLimit limit={1000} field="financeComment" />
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Рыночные риски</label>
                    <textarea {...register('marketRisks', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" placeholder="Возможные рыночные риски: регуляции, конкуренция" />
                    <CharLimit limit={2000} field="marketRisks" />
                    {triedNext && errors.marketRisks && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Операционные риски</label>
                    <textarea {...register('operationalRisks', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Операционные риски: зависимость от персонала, информационных систем" />
                    <CharLimit limit={2000} field="operationalRisks" />
                    {triedNext && errors.operationalRisks && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Регистрация компании</label>
                    <textarea {...register('companyRegistration', { required: true, maxLength: 1000 })} rows={2} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={1000} placeholder="Наименование юридического лица" />
                    <CharLimit limit={1000} field="companyRegistration" />
                    {triedNext && errors.companyRegistration && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Лицензии и регуляторное соответствие</label>
                    <textarea {...register('licensesCompliance', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Требуется ли лицензия на деятельность, соответствует ли компания требованиям регуляторов?" />
                    <CharLimit limit={2000} field="licensesCompliance" />
                    {triedNext && errors.licensesCompliance && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Комментарий к блоку "Риски"</label>
                    <textarea {...register('risksComment', { maxLength: 1000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={1000} placeholder="Любой комментарий к блоку 'Риски'. Заполнение необязательно." />
                    <CharLimit limit={1000} field="risksComment" />
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Что ограничивает компанию от роста до «единорога»</label>
                    <textarea {...register('growthLimitations', { required: true, maxLength: 3000 })} rows={5} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={3000} placeholder="Опишите основные ограничения и препятствия для роста вашей компании" onFocus={() => setFocusedField('growthLimitations')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={3000} field="growthLimitations" />
                    {triedNext && errors.growthLimitations && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Приложить файлы</label>
                    <div className="text-sm text-gray-600 mb-3">
                      Приложите сопутствующие документы для анализа. Например, презентации по проекту, проведенные вами анализы рынка или конкурентов.
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Дополнительные документы</label>
                        <input 
                          type="file" 
                          accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx"
                          onChange={(e) => setDocs(e.target.files?.[0] || null)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                      </div>
                    </div>
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
            <Image
              src="/uploads/20250702_1736_Flow. Capital Logo_simple_compose_01jz5s1dttejqsh8w0435jgzra.png"
              alt="Flow.Capital Logo"
              width={60}
              height={60}
              className=""
              priority
            />
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