"use client";

import { useState, useRef, useEffect } from 'react'
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
  'Контакты',
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
        return ['companyName', 'industry', 'description']
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
      case 7:
        return ['contactName', 'email', 'phone']
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

  const scrollNav = (dir: 'left' | 'right') => {
    if (sectionNavRef.current) {
      const scrollAmount = 120; // px
      sectionNavRef.current.scrollBy({
        left: dir === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return 'bg-gray-200 text-gray-500 border-gray-200';
    if (progress < 50) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    if (progress < 100) return 'bg-blue-100 text-blue-700 border-blue-400';
    return 'bg-green-500 text-white border-green-600';
  };

  const getProgressBarColor = (progress: number) => {
    if (progress === 0) return 'bg-gray-200';
    if (progress < 50) return 'bg-yellow-400';
    if (progress < 100) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const sectionNav = (
    <div className="mb-8 relative">
      <button
        type="button"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100 transition disabled:opacity-30"
        onClick={() => scrollNav('left')}
        aria-label="Листать влево"
        style={{ display: 'block' }}
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M13 15l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <div
        ref={sectionNavRef}
        className="flex gap-6 mb-2 px-2 flex-nowrap overflow-x-auto scrollbar-hide"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {[1,2,3,4,5,6,7].map((i) => {
          const filledCount = getFilledFieldsCount(i);
          const requiredCount = getRequiredFieldsCount(i);
          const progress = requiredCount > 0 ? Math.round((filledCount / requiredCount) * 100) : 0;
          const colorClass = step === i
            ? 'bg-blue-600 text-white border-blue-600'
            : getProgressColor(progress);
          return (
            <div key={i} className="flex flex-col items-center min-w-[80px]">
              <button
                onClick={() => goToStep(i)}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-colors mb-1 relative ${colorClass}`}
                style={{ minWidth: 48 }}
              >
                {i}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${getProgressBarColor(progress)}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
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
      <button
        type="button"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100 transition disabled:opacity-30"
        onClick={() => scrollNav('right')}
        aria-label="Листать вправо"
        style={{ display: 'block' }}
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <div className="text-center text-sm text-gray-500 mb-2 mt-2">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Сфера деятельности</label>
                    <select {...register('industry', { required: true })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" onFocus={() => setFocusedField('industry')} onBlur={() => setFocusedField(null)}>
                      <option value="">Выберите сферу</option>
                      <option value="fintech">Финтех</option>
                      <option value="ai">AI/ML</option>
                      <option value="retail">Ритейл</option>
                      <option value="tech">Технологии</option>
                      <option value="other">Другое, укажу в описании</option>
                    </select>
                    <CharLimit limit={100} field="industry" />
                    <div className="min-h-[22px]">{triedNext && errors.industry && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}</div>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Отраслевая экспертиза команды</label>
                    <textarea {...register('teamExperience', { required: true, maxLength: 3000 })} rows={5} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={3000} placeholder="Опыт команды проекта в отрасли" onFocus={() => setFocusedField('teamExperience')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={3000} field="teamExperience" />
                    {triedNext && errors.teamExperience && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Прошлые достижения команды</label>
                    <textarea {...register('teamMembers', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" placeholder="Ваши прошлые успехи: стартапы, выходы, награды" onFocus={() => setFocusedField('teamMembers')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="teamMembers" />
                    {triedNext && errors.teamMembers && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Полнота команды</label>
                    <textarea {...register('teamJointExp', { maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Состав вашей команды. Кто уже работает над проектом и открытые вакансии" onFocus={() => setFocusedField('teamJointExp')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="teamJointExp" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Сработанность команды</label>
                    <textarea {...register('vision', { required: true, maxLength: 3000 })} rows={5} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={3000} placeholder="Совместный опыт команды, которая работает над проектом" onFocus={() => setFocusedField('vision')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={3000} field="vision" />
                    {triedNext && errors.vision && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Видение и стратегия развития</label>
                    <textarea {...register('techNovelty', { required: true, maxLength: 3000 })} rows={5} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={3000} placeholder="Опишите планы развития проекта и цели" onFocus={() => setFocusedField('techNovelty')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={3000} field="techNovelty" />
                    {triedNext && errors.techNovelty && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Наличие продукта</label>
                    <textarea {...register('rndInfra', { maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Есть ли у вас рабочий прототип или продукт?" onFocus={() => setFocusedField('rndInfra')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="rndInfra" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Уникальность решения</label>
                    <textarea {...register('scalability', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Насколько ваш продукт уникален?" onFocus={() => setFocusedField('scalability')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="scalability" />
                    {triedNext && errors.scalability && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Инновационность технологий</label>
                    <textarea {...register('productDescription', { required: true, maxLength: 1000 })} rows={6} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" placeholder="Какие технологии применяются в проекте?" />
                    <CharLimit limit={1000} field="productDescription" />
                    {triedNext && errors.productDescription && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Технологическая масштабируемость</label>
                    <textarea {...register('productUnique', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Есть ли какие либо технологические ограничения в проекте? Насколько технически возможно масштабирование?" />
                    <CharLimit limit={2000} field="productUnique" />
                    {triedNext && errors.productUnique && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Размер рынка</label>
                    <textarea {...register('marketSize', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Приведите результаты вашего анализа рынка (TAM/SAM/SOM)" />
                    <CharLimit limit={2000} field="marketSize" />
                    {triedNext && errors.marketSize && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Конкуренция</label>
                    <textarea {...register('competAdv', { maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Приведите резултаты оценки уровня конкуренции в рынке" />
                    <CharLimit limit={2000} field="competAdv" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Уникальное торговое предложение</label>
                    <textarea {...register('competAdv', { maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Опишите ваше уникальное торговое предложение" />
                    <CharLimit limit={2000} field="competAdv" />
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Текущие продажи</label>
                    <textarea {...register('traction', { required: true, maxLength: 1000 })} rows={6} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" placeholder="Какая выручка за последний месяц/квартал/год" />
                    <CharLimit limit={1000} field="traction" />
                    {triedNext && errors.traction && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Текущие пользователи</label>
                    <textarea {...register('investment', { required: true, maxLength: 1000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" placeholder="Какая динамика по пользователям за последний год (DAU/MAU)" />
                    <CharLimit limit={1000} field="investment" />
                    {triedNext && errors.investment && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Запрашиваемая сумма инвестиций</label>
                    <input type="text" {...register('investmentPlan', { required: true })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" placeholder="Укажите сумму инвестиций" />
                    {triedNext && errors.investmentPlan && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Какой % компании вы готовы продать?</label>
                    <input type="text" {...register('scalingForecast', { required: true })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" placeholder="Укажите % компании, который вы готовы продать" />
                    {triedNext && errors.scalingForecast && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">План использования инвестиций</label>
                    <textarea {...register('currentInvestments', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Какой план использования привлекаемых инвестиций" />
                    <CharLimit limit={2000} field="currentInvestments" />
                    {triedNext && errors.currentInvestments && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Масштабируемость проекта (географическая)</label>
                    <textarea {...register('capTable', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Какой потенциал географического роста" />
                    <CharLimit limit={2000} field="capTable" />
                    {triedNext && errors.capTable && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unit-экономика</label>
                    <textarea {...register('capTable', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Опишите и предоставьте расчеты по ключевым метрикам вашего проекта" />
                    <CharLimit limit={2000} field="capTable" />
                    {triedNext && errors.capTable && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Рыночные риски</label>
                    <textarea {...register('companyRegistration', { required: true, maxLength: 1000 })} rows={6} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" placeholder="Возможные рыночные риски: регуляции, конкуренция" />
                    <CharLimit limit={1000} field="companyRegistration" />
                    {triedNext && errors.companyRegistration && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Операционные риски</label>
                    <textarea {...register('contracts', { maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Операционные риски: зависимость от персонала, информационных систем" />
                    <CharLimit limit={2000} field="contracts" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Регистрация компании</label>
                    <textarea {...register('noDisputes', { required: true, maxLength: 1000 })} rows={2} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={1000} placeholder="Зарегестрирована ли компания?" />
                    <CharLimit limit={1000} field="noDisputes" />
                    {triedNext && errors.noDisputes && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Договорная база</label>
                    <textarea {...register('licenses', { maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Есть ли договорная база и её состояние" />
                    <CharLimit limit={2000} field="licenses" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Судебные споры</label>
                    <textarea {...register('ipClean', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Наличие судебных споров" />
                    <CharLimit limit={2000} field="ipClean" />
                    {triedNext && errors.ipClean && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Лицензии и регуляторное соответствие</label>
                    <textarea {...register('risks', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Требуется ли лицензия на деятельность, соответствует ли компания требованиям регуляторов?" />
                    <CharLimit limit={2000} field="risks" />
                    {triedNext && errors.risks && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                </motion.div>
              )}
              {step === 7 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 0.5 }} 
                  className="space-y-6"
                  data-step="7"
                >
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Контактный телефон</label>
                    <input type="tel" {...register('phone')} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={30} field="phone" />
                    <div className="min-h-[22px]">&nbsp;</div>
                  </div>
                </motion.div>
              )}
              <div className="flex justify-between pt-6">
                {step > 1 && (
                  <button type="button" onClick={() => goToStep(step - 1)} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">Назад</button>
                )}
                {step < 7 ? (
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