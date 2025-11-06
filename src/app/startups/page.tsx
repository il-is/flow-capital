"use client";

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import LoadingModal from '@/components/LoadingModal'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FormConfig, FieldConfig } from '@/app/api/form-config/route'
import { getFieldKeyFromQuestion, getFieldsForSection } from '@/lib/formConfig'

// SECTION_TITLES теперь будут браться из конфигурации Google Sheets
const DEFAULT_SECTION_TITLES = [
  'Интро',
  'Команда',
  'Продукт и технологии',
  'Финансы',
  'Риски',
  'Юридические вопросы',
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
  
  // Продукт и технологии
  productDescription: string;
  productAvailability: string;
  productAudience: string;
  uniqueSellingPoint: string;
  developmentPlans: string; // Планы развития (было: researchAvailability)
  techScalability: string;
  marketSize: string;
  
  // Финансы
  currentSales: string;
  currentExpenses: string;
  currentUsers: string;
  investmentAmount: string;
  equityPercentage: string;
  investmentPlan: string;
  geographicScalability: string;
  currentInvestments: string;
  capTable: string;
  companyValuation: string;
  
  // Риски
  marketRisks: string;
  operationalRisks: string;
  companyRegistration: string;
  licensesCompliance: string;
  
  // Юридические вопросы
  intellectualProperty: string;
  legalDisputes: string;
  investorAgreements: string;
  ownershipStructure: string;
  contractorAgreements: string;
  
  // Завершение
  growthLimitations: string;
}

export default function StartupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null)
  const [configLoading, setConfigLoading] = useState(true)
  const [configError, setConfigError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors }, trigger, getValues, setValue, watch } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      teamExperience: '',
      teamMembers: '',
      productDescription: '',
      productAvailability: '',
      productAudience: '',
      uniqueSellingPoint: '',
      developmentPlans: '',
      techScalability: '',
      marketSize: '',
      currentSales: '',
      currentExpenses: '',
      currentUsers: '',
      investmentAmount: '',
      equityPercentage: '',
      investmentPlan: '',
      geographicScalability: '',
      currentInvestments: '',
      capTable: '',
      companyValuation: '',
      marketRisks: '',
      operationalRisks: '',
      companyRegistration: '',
      licensesCompliance: '',
      intellectualProperty: '',
      legalDisputes: '',
      investorAgreements: '',
      ownershipStructure: '',
      contractorAgreements: '',
      growthLimitations: ''
    }
  })
  const [docs, setDocs] = useState<File | null>(null)
  const [teamResume, setTeamResume] = useState<File | null>(null)
  const [financialModel, setFinancialModel] = useState<File | null>(null)
  const [showInfo, setShowInfo] = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [triedNext, setTriedNext] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [validationError, setValidationError] = useState<string | null>(null)

  const sectionNavRef = useRef<HTMLDivElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);

  // Загрузка конфигурации формы из Google Sheets
  useEffect(() => {
    async function loadFormConfig() {
      try {
        const response = await fetch('/api/form-config')
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          console.error('Failed to load form config:', errorData)
          throw new Error(errorData.error || 'Failed to load form configuration')
        }
        const config = await response.json()
        console.log('Form config loaded:', config)
        setFormConfig(config)
      } catch (error) {
        console.error('Error loading form config:', error)
        setConfigError(error instanceof Error ? error.message : 'Ошибка загрузки конфигурации')
        // При ошибке продолжаем работать с дефолтной конфигурацией
      } finally {
        setConfigLoading(false)
      }
    }
    loadFormConfig()
  }, [])

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
      
      // Проверяем и добавляем файлы
      console.log('Submitting files:', {
        docs: docs ? `File: ${docs.name}, ${docs.size} bytes` : 'null',
        teamResume: teamResume ? `File: ${teamResume.name}, ${teamResume.size} bytes` : 'null',
        financialModel: financialModel ? `File: ${financialModel.name}, ${financialModel.size} bytes` : 'null'
      })
      
      if (docs) {
        formData.append('docs', docs)
        console.log('Added docs file to FormData:', docs.name)
      }
      if (teamResume) {
        formData.append('teamResume', teamResume)
        console.log('Added teamResume file to FormData:', teamResume.name)
      }
      if (financialModel) {
        formData.append('financialModel', financialModel)
        console.log('Added financialModel file to FormData:', financialModel.name)
      }

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
    // Очищаем предыдущие ошибки валидации
    setValidationError(null);
    
    // При переходе вперед проверяем валидацию всех промежуточных шагов
    if (target > step) {
      setTriedNext(true);
      
      // Проверяем все шаги от текущего до целевого (не включая целевой)
      for (let i = step; i < target; i++) {
        const sectionFields = getSectionFields(i);
        if (sectionFields.length > 0) {
          const valid = await trigger(sectionFields);
          if (!valid) {
            // Если валидация не прошла, находим все поля с ошибками
            const sectionName = getSectionTitles()[i - 1] || `Секция ${i}`;
            const values = getValues();
            const currentErrors = errors;
            
            // Находим все поля с ошибками валидации
            const fieldsWithErrors = sectionFields.filter(field => {
              const error = currentErrors[field];
              if (error) return true;
              
              // Также проверяем пустые обязательные поля
              const value = values[field];
              if (!value || (typeof value === 'string' && value.trim() === '')) {
                return true;
              }
              
              return false;
            });
            
            // Формируем список полей с ошибками
            let errorMessage = `Пожалуйста, исправьте ошибки в блоке "${sectionName}":\n`;
            
            // Получаем названия полей из конфигурации или используем ключи
            if (formConfig) {
              const sectionFieldsConfig = getFieldsForSection(formConfig, sectionName);
              fieldsWithErrors.forEach(fieldKey => {
                const fieldConfig = sectionFieldsConfig.find(f => 
                  getFieldKeyFromQuestion(f.question) === fieldKey
                );
                if (fieldConfig) {
                  const error = currentErrors[fieldKey];
                  if (error?.message) {
                    errorMessage += `• ${fieldConfig.question}: ${error.message}\n`;
                  } else {
                    errorMessage += `• ${fieldConfig.question} (не заполнено)\n`;
                  }
                }
              });
            } else {
              // Fallback: используем ключи полей
              fieldsWithErrors.forEach(fieldKey => {
                const error = currentErrors[fieldKey];
                if (error?.message) {
                  errorMessage += `• ${String(fieldKey)}: ${error.message}\n`;
                } else {
                  errorMessage += `• ${String(fieldKey)} (не заполнено)\n`;
                }
              });
            }
            
            setValidationError(errorMessage.trim());
            setTriedNext(false);
            
            // Автоматически скрываем ошибку через 5 секунд
            setTimeout(() => {
              setValidationError(null);
            }, 5000);
            
            // Прокручиваем к началу формы, чтобы пользователь увидел ошибку
            setTimeout(() => {
              if (formContainerRef.current) {
                formContainerRef.current.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                });
              }
            }, 100);
            
            return;
          }
        }
      }
    }
    
    setTriedNext(false);
    setValidationError(null);
    setStep(target);

    // Прокрутка страницы в начало формы (к навигации секций)
    setTimeout(() => {
      if (formContainerRef.current) {
        formContainerRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        // Если ref не найден, прокручиваем в начало страницы
        window.scrollTo({ 
          top: 0, 
          behavior: 'smooth' 
        });
      }
    }, 100);
  };

  // Получение полей секции на основе конфигурации или дефолтной структуры
  // Включает обязательные поля + поля с валидацией формата (email, phone)
  function getSectionFields(section: number): (keyof FormData)[] {
    if (formConfig && formConfig.sections.length >= section) {
      const sectionName = formConfig.sections[section - 1]
      const fields = getFieldsForSection(formConfig, sectionName)
      // Получаем обязательные поля + поля с валидацией формата (email, phone)
      return fields
        .filter(field => {
          if (field.required) return true;
          // Включаем email и phone даже если они необязательные, т.к. у них есть валидация формата
          const isEmail = field.fieldType === 'email' || field.question.toLowerCase().includes('email');
          const isPhone = field.fieldType === 'tel' || field.question.toLowerCase().includes('телефон') || field.question.toLowerCase().includes('phone');
          return isEmail || isPhone;
        })
        .map(field => getFieldKeyFromQuestion(field.question) as keyof FormData)
    }
    
    // Fallback к дефолтной структуре (включаем email для проверки формата)
    switch (section) {
      case 1:
        return ['companyName', 'contactName', 'email', 'phone']
      case 2:
        return ['teamExperience', 'teamMembers']
      case 3:
        return ['productDescription', 'productAvailability', 'productAudience', 'uniqueSellingPoint', 'developmentPlans', 'techScalability']
      case 4:
        return ['currentSales', 'currentExpenses', 'investmentAmount', 'investmentPlan', 'currentInvestments', 'capTable']
      case 5:
        return ['marketRisks', 'operationalRisks', 'companyRegistration', 'licensesCompliance']
      case 6:
        return ['intellectualProperty', 'legalDisputes', 'investorAgreements', 'ownershipStructure', 'contractorAgreements']
      case 7:
        return ['growthLimitations']
      default:
        return []
    }
  }

  // Получение названий секций из конфигурации или дефолтные
  function getSectionTitles(): string[] {
    return formConfig?.sections || DEFAULT_SECTION_TITLES
  }

  // Получение конфигурации поля по вопросу
  function getFieldConfig(questionText: string): FieldConfig | null {
    if (!formConfig) return null
    return formConfig.fields.find(f => 
      f.question === questionText || 
      f.question.includes(questionText) || 
      questionText.includes(f.question)
    ) || null
  }

  // Получение всех полей для текущего шага
  function getFieldsForCurrentStep(): FieldConfig[] {
    if (!formConfig || !formConfig.sections || formConfig.sections.length < step) {
      console.log('No config or sections:', { hasConfig: !!formConfig, sectionsCount: formConfig?.sections?.length, step })
      return []
    }
    const sectionName = formConfig.sections[step - 1]
    if (!sectionName) {
      console.log('No section name for step:', step)
      return []
    }
    const fields = getFieldsForSection(formConfig, sectionName)
    console.log(`Step ${step}, section "${sectionName}", fields:`, fields.length)
    return fields
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

  // Компонент для label с иконкой точки (Вариант 4)
  function FieldLabel({ children, required = false }: { children: React.ReactNode, required?: boolean }) {
    if (required) {
      return (
        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
          {children}
        </label>
      )
    } else {
      return (
        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-500 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 border border-gray-400 flex-shrink-0"></span>
          {children}
          <span className="text-xs text-gray-400 ml-1 font-normal">(опционально)</span>
        </label>
      )
    }
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

  // Проверяем, доступен ли шаг для перехода (все предыдущие шаги должны быть заполнены)
  const isStepAccessible = (targetStep: number) => {
    if (targetStep <= step) return true; // Назад всегда можно
    
    // Проверяем все шаги от 1 до targetStep-1
    for (let i = 1; i < targetStep; i++) {
      const fields = getSectionFields(i);
      if (fields.length > 0) {
        // Проверяем, заполнены ли все обязательные поля текущего шага
        const currentValues = getValues();
        const allFieldsFilled = fields.every(field => {
          const value = currentValues[field];
          // Проверяем, является ли поле обязательным через проверку схемы валидации
          // Все поля в getSectionFields являются обязательными для валидации перехода
          return value && value.toString().trim() !== '';
        });
        if (!allFieldsFilled) return false;
      }
    }
    return true;
  };

  const sectionNav = (
    <div className="mb-8">
      <div className="flex gap-6 mb-2 px-2 -mx-2 flex-wrap justify-center">
        {Array.from({ length: getSectionTitles().length }, (_, i) => i + 1).map((i) => {
          const filledCount = getFilledFieldsCount(i);
          const requiredCount = getRequiredFieldsCount(i);
          const progress = requiredCount > 0 ? Math.round((filledCount / requiredCount) * 100) : 0;
          
          const isAccessible = isStepAccessible(i);
          return (
            <div key={i} className="flex flex-col items-center min-w-[80px]">
              <button
                onClick={() => isAccessible && goToStep(i)}
                disabled={!isAccessible}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-colors mb-1 relative
                  ${step === i ? 'bg-blue-600 text-white border-blue-600' : 
                    isAccessible ? 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-blue-50 cursor-pointer' : 
                    'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed opacity-50'}`}
                style={{ minWidth: 48 }}
                title={!isAccessible ? 'Заполните предыдущие блоки для перехода' : ''}
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
                {getSectionTitles()[i-1] || DEFAULT_SECTION_TITLES[i-1] || `Секция ${i}`}
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
        <div ref={formContainerRef} className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {configLoading && !formConfig ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Загрузка конфигурации формы...</p>
              </div>
            ) : (
              <>
                {configError && (
                  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⚠️ {configError}. Используется дефолтная конфигурация.
                    </p>
                  </div>
                )}
                {!configError && formConfig && (
                  <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-xs text-green-700">
                      ✅ Конфигурация загружена ({formConfig.sections.length} секций, {formConfig.fields.length} полей)
                    </p>
                  </div>
                )}
                {validationError && (
                  <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3 flex-1">
                        <h3 className="text-sm font-medium text-red-800 mb-2">
                          Не все обязательные поля заполнены
                        </h3>
                        <div className="text-sm text-red-700 whitespace-pre-line">
                          {validationError}
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          onClick={() => setValidationError(null)}
                          className="inline-flex text-red-400 hover:text-red-500 focus:outline-none"
                        >
                          <span className="sr-only">Закрыть</span>
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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
                  {(() => {
                    const fields = getFieldsForCurrentStep()
                    console.log('Rendering step 1, fields from config:', fields.length, 'has config:', !!formConfig, 'configLoading:', configLoading)
                    // Если конфигурация загружена и есть поля, используем её
                    // Иначе используем дефолтные поля
                    if (fields.length > 0 && formConfig && !configLoading) {
                      return fields.map((fieldConfig, idx) => {
                        const fieldKey = getFieldKeyFromQuestion(fieldConfig.question) as keyof FormData
                        const isEmail = fieldConfig.fieldType === 'email' || fieldConfig.question.toLowerCase().includes('email')
                        const isPhone = fieldConfig.fieldType === 'tel' || fieldConfig.question.toLowerCase().includes('телефон') || fieldConfig.question.toLowerCase().includes('phone')
                        
                        // Специальная обработка для файловых полей (они рендерятся отдельно)
                        if (fieldConfig.fieldType === 'file') {
                          if (fieldConfig.question.includes('резюме')) {
                            return (
                              <div key={idx}>
                                <FieldLabel required={fieldConfig.required}>{fieldConfig.question}</FieldLabel>
                                {fieldConfig.placeholder && (
                                  <div className="text-sm text-gray-600 mb-3">{fieldConfig.placeholder}</div>
                                )}
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Резюме команды</label>
                                    <input 
                                      type="file" 
                                      accept={fieldConfig.accept || ".pdf,.doc,.docx"}
                                      onChange={(e) => setTeamResume(e.target.files?.[0] || null)}
                                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                    />
                                    {teamResume && (
                                      <p className="mt-2 text-sm text-gray-600">Выбран файл: {teamResume.name}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          }
                          return null
                        }
                        
                        return (
                          <div key={idx}>
                            <FieldLabel required={fieldConfig.required}>{fieldConfig.question}</FieldLabel>
                            {fieldConfig.fieldType === 'textarea' ? (
                              <>
                                <textarea 
                                  {...register(fieldKey, { 
                                    required: fieldConfig.required,
                                    maxLength: fieldConfig.maxLength
                                  })} 
                                  rows={fieldConfig.rows || 3} 
                                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" 
                                  maxLength={fieldConfig.maxLength}
                                  placeholder={fieldConfig.placeholder || ''}
                                  onFocus={() => setFocusedField(fieldKey as string)} 
                                  onBlur={() => setFocusedField(null)} 
                                />
                                {fieldConfig.maxLength && <CharLimit limit={fieldConfig.maxLength} field={fieldKey} />}
                                <div className="min-h-[22px]">
                                  {triedNext && errors[fieldKey] && (
                                    <p className="mt-1 text-sm text-red-600">
                                      {errors[fieldKey]?.message || 'Это поле обязательно'}
                                    </p>
                                  )}
                                </div>
                              </>
                            ) : (
                              <>
                                <input 
                                  type={fieldConfig.fieldType || 'text'}
                                  {...register(fieldKey, { 
                                    required: fieldConfig.required,
                                    maxLength: fieldConfig.maxLength,
                                    ...(isEmail && {
                                      validate: (value) => {
                                        if (!fieldConfig.required && !value) return true;
                                        if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                                          return 'Введите корректный email адрес';
                                        }
                                        return true;
                                      }
                                    }),
                                    ...(isPhone && {
                                      pattern: {
                                        value: /^[0-9+\s()-]*$/,
                                        message: 'Телефон может содержать только цифры и символы +, -, (, ), пробелы'
                                      },
                                      validate: (value) => {
                                        if (!fieldConfig.required && !value) return true;
                                        if (value && value.trim().length < 5) {
                                          return 'Телефон слишком короткий';
                                        }
                                        return true;
                                      }
                                    })
                                  })} 
                                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                                    triedNext && errors[fieldKey] ? 'border-red-500' : ''
                                  }`}
                                  placeholder={fieldConfig.placeholder || ''}
                                  onFocus={() => setFocusedField(fieldKey as string)} 
                                  onBlur={() => setFocusedField(null)}
                                  {...(isPhone && {
                                    onInput: (e) => {
                                      const target = e.target as HTMLInputElement
                                      const value = target.value.replace(/[^\d+\s()-]/g, '')
                                      if (target.value !== value) {
                                        setValue('phone', value, { shouldValidate: true })
                                      }
                                    }
                                  })}
                                />
                                {fieldConfig.maxLength && <CharLimit limit={fieldConfig.maxLength} field={fieldKey} />}
                                <div className="min-h-[22px]">
                                  {triedNext && errors[fieldKey] && (
                                    <p className="mt-1 text-sm text-red-600">
                                      {errors[fieldKey]?.message || 'Это поле обязательно'}
                                    </p>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        )
                      })
                    }
                    
                    // Дефолтные поля, если конфигурация не загружена
                    return (
                      <>
                        <div>
                          <FieldLabel required={true}>Название стартапа</FieldLabel>
                          <input type="text" {...register('companyName', { required: true })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" onFocus={() => setFocusedField('companyName')} onBlur={() => setFocusedField(null)} />
                          <CharLimit limit={200} field="companyName" />
                          <div className="min-h-[22px]">{triedNext && errors.companyName && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}</div>
                        </div>
                        <div>
                          <FieldLabel required={true}>Контактное лицо (ФИО)</FieldLabel>
                          <input type="text" {...register('contactName', { required: true })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" onFocus={() => setFocusedField('contactName')} onBlur={() => setFocusedField(null)} />
                          <CharLimit limit={100} field="contactName" />
                          <div className="min-h-[22px]">{triedNext && errors.contactName && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}</div>
                        </div>
                        <div>
                          <FieldLabel required={false}>Email</FieldLabel>
                          <input 
                            type="email" 
                            {...register('email', {
                              validate: (value) => {
                                if (!value) return true; // Необязательное поле
                                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                                  return 'Введите корректный email адрес';
                                }
                                return true;
                              }
                            })} 
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                              triedNext && errors.email ? 'border-red-500' : ''
                            }`}
                            onFocus={() => setFocusedField('email')} 
                            onBlur={() => setFocusedField(null)} 
                          />
                          <CharLimit limit={100} field="email" />
                          <div className="min-h-[22px]">
                            {triedNext && errors.email && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.email.message || 'Введите корректный email адрес'}
                              </p>
                            )}
                          </div>
                        </div>
                        <div>
                          <FieldLabel required={true}>Контактный телефон</FieldLabel>
                          <input 
                            type="tel" 
                            {...register('phone', { 
                              required: true,
                              pattern: {
                                value: /^[0-9+\s()-]*$/,
                                message: 'Телефон может содержать только цифры и символы +, -, (, ), пробелы'
                              },
                              validate: (value) => {
                                if (!value || value.trim().length < 5) {
                                  return 'Телефон слишком короткий';
                                }
                                return true;
                              }
                            })} 
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                              triedNext && errors.phone ? 'border-red-500' : ''
                            }`}
                            onFocus={() => setFocusedField('phone')} 
                            onBlur={() => setFocusedField(null)}
                            onInput={(e) => {
                              const target = e.target as HTMLInputElement
                              const value = target.value.replace(/[^\d+\s()-]/g, '')
                              if (target.value !== value) {
                                setValue('phone', value, { shouldValidate: true })
                              }
                            }}
                          />
                          <CharLimit limit={30} field="phone" />
                          <div className="min-h-[22px]">
                            {triedNext && errors.phone && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.phone.message || 'Это поле обязательно'}
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    )
                  })()}
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
                    <FieldLabel required={true}>Отраслевая экспертиза</FieldLabel>
                    <textarea {...register('teamExperience', { required: true, maxLength: 3000 })} rows={5} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={3000} placeholder="Опыт команды проекта в отрасли, опыт фаундеров" onFocus={() => setFocusedField('teamExperience')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={3000} field="teamExperience" />
                    {triedNext && errors.teamExperience && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <FieldLabel required={true}>Полнота команды</FieldLabel>
                    <textarea {...register('teamMembers', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Состав вашей команды. Кто уже работает над проектом и какие потребности" onFocus={() => setFocusedField('teamMembers')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="teamMembers" />
                    {triedNext && errors.teamMembers && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <FieldLabel required={false}>Загрузите ваше резюме или агрегированное резюме состава участников команды</FieldLabel>
                    <div className="text-sm text-gray-600 mb-3">
                      Загрузка резюме существенно увеличивает шансы финансирования
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Резюме команды</label>
                        <input 
                          type="file" 
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => setTeamResume(e.target.files?.[0] || null)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                        {teamResume && (
                          <p className="mt-2 text-sm text-gray-600">Выбран файл: {teamResume.name}</p>
                        )}
                      </div>
                    </div>
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
                    <FieldLabel required={true}>Опишите ваш продукт</FieldLabel>
                    <textarea {...register('productDescription', { required: true, maxLength: 3000 })} rows={5} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={3000} placeholder="Опишите проблему и как её решает ваш продукт. Опишите основные применяемые технологии" onFocus={() => setFocusedField('productDescription')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={3000} field="productDescription" />
                    {triedNext && errors.productDescription && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <FieldLabel required={true}>Наличие продукта</FieldLabel>
                    <textarea {...register('productAvailability', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Есть ли у вас рабочий прототип или продукт?" onFocus={() => setFocusedField('productAvailability')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="productAvailability" />
                    {triedNext && errors.productAvailability && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <FieldLabel required={true}>Аудитория продукта</FieldLabel>
                    <textarea {...register('productAudience', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Опишите вашу целевую аудиторию" onFocus={() => setFocusedField('productAudience')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="productAudience" />
                    {triedNext && errors.productAudience && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <FieldLabel required={true}>Уникальное торговое предложение</FieldLabel>
                    <textarea {...register('uniqueSellingPoint', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Опишите ваше уникальное торговое предложение" onFocus={() => setFocusedField('uniqueSellingPoint')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="uniqueSellingPoint" />
                    {triedNext && errors.uniqueSellingPoint && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <FieldLabel required={true}>Планы развития</FieldLabel>
                    <textarea {...register('developmentPlans', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Опишите планы развития проекта и цели" onFocus={() => setFocusedField('developmentPlans')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="developmentPlans" />
                    {triedNext && errors.developmentPlans && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <FieldLabel required={true}>Технологическая масштабируемость</FieldLabel>
                    <textarea {...register('techScalability', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Есть ли какие либо технологические ограничения в проекте? Насколько технически возможно масштабирование?" onFocus={() => setFocusedField('techScalability')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="techScalability" />
                    {triedNext && errors.techScalability && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <FieldLabel required={false}>Размер рынка</FieldLabel>
                    <textarea {...register('marketSize', { required: false, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Приведите результаты вашего исследования рынка" onFocus={() => setFocusedField('marketSize')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="marketSize" />
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
                    <FieldLabel required={true}>Текущие продажи</FieldLabel>
                    <textarea {...register('currentSales', { required: true, maxLength: 1000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={1000} placeholder="Какая выручка за последний месяц/квартал/год" onFocus={() => setFocusedField('currentSales')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={1000} field="currentSales" />
                    {triedNext && errors.currentSales && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <FieldLabel required={true}>Текущие расходы</FieldLabel>
                    <textarea {...register('currentExpenses', { required: true, maxLength: 1000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={1000} placeholder="Какие расходы за последний месяц/квартал/год" onFocus={() => setFocusedField('currentExpenses')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={1000} field="currentExpenses" />
                    {triedNext && errors.currentExpenses && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <FieldLabel required={false}>Текущие пользователи</FieldLabel>
                    <textarea {...register('currentUsers', { required: false, maxLength: 1000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={1000} placeholder="Какая динамика по пользователям за последний год (DAU/MAU)" onFocus={() => setFocusedField('currentUsers')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={1000} field="currentUsers" />
                  </div>
                  <div>
                    <FieldLabel required={true}>Запрашиваемая сумма инвестиций</FieldLabel>
                    <input type="text" {...register('investmentAmount', { required: true })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" placeholder="Укажите сумму инвестиций" onFocus={() => setFocusedField('investmentAmount')} onBlur={() => setFocusedField(null)} />
                    {triedNext && errors.investmentAmount && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <FieldLabel required={false}>Какой % компании вы готовы продать?</FieldLabel>
                    <input type="text" {...register('equityPercentage', { required: false })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" placeholder="Укажите % компании, который вы готовы продать" onFocus={() => setFocusedField('equityPercentage')} onBlur={() => setFocusedField(null)} />
                  </div>
                  <div>
                    <FieldLabel required={true}>План использования инвестиций</FieldLabel>
                    <textarea {...register('investmentPlan', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Какой план использования привлекаемых инвестиций" onFocus={() => setFocusedField('investmentPlan')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="investmentPlan" />
                    {triedNext && errors.investmentPlan && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <FieldLabel required={false}>Масштабируемость проекта (географическая)</FieldLabel>
                    <textarea {...register('geographicScalability', { required: false, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Какой потенциал географического роста" onFocus={() => setFocusedField('geographicScalability')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="geographicScalability" />
                  </div>
                  <div>
                    <FieldLabel required={true}>Текущие инвестиции и структура капитала</FieldLabel>
                    <textarea {...register('currentInvestments', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Опишите текущие инвестиции в проект" onFocus={() => setFocusedField('currentInvestments')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="currentInvestments" />
                    {triedNext && errors.currentInvestments && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <FieldLabel required={true}>Структура капитала</FieldLabel>
                    <textarea {...register('capTable', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Распределение долей компании. Укажите также договоренности по распределению долей компании. Например, опционы для сотрудников." onFocus={() => setFocusedField('capTable')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="capTable" />
                    {triedNext && errors.capTable && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <FieldLabel required={false}>Оценка компании</FieldLabel>
                    <textarea {...register('companyValuation', { required: false, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Укажите собственную оценку компании и оценку сторонней организацией" onFocus={() => setFocusedField('companyValuation')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="companyValuation" />
                  </div>
                  <div>
                    <FieldLabel required={false}>Загрузите финансовую модель вашей компании</FieldLabel>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Финансовая модель</label>
                        <input 
                          type="file" 
                          accept=".xls,.xlsx,.xlsm,.pdf"
                          onChange={(e) => setFinancialModel(e.target.files?.[0] || null)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                        {financialModel && (
                          <p className="mt-2 text-sm text-gray-600">Выбран файл: {financialModel.name}</p>
                        )}
                      </div>
                    </div>
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
                    <FieldLabel required={true}>Рыночные риски</FieldLabel>
                    <textarea {...register('marketRisks', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Возможные рыночные риски: регуляции, конкуренция" onFocus={() => setFocusedField('marketRisks')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="marketRisks" />
                    {triedNext && errors.marketRisks && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <FieldLabel required={true}>Операционные риски</FieldLabel>
                    <textarea {...register('operationalRisks', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Операционные риски: зависимость от узкоспециализированного персонала, информационных систем, человеческого фактора" onFocus={() => setFocusedField('operationalRisks')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="operationalRisks" />
                    {triedNext && errors.operationalRisks && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <FieldLabel required={true}>Регистрация компании</FieldLabel>
                    <textarea {...register('companyRegistration', { required: true, maxLength: 1000 })} rows={2} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={1000} placeholder="Наименование юридического лица" onFocus={() => setFocusedField('companyRegistration')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={1000} field="companyRegistration" />
                    {triedNext && errors.companyRegistration && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                  </div>
                  <div>
                    <FieldLabel required={true}>Лицензии и регуляторное соответствие</FieldLabel>
                    <textarea {...register('licensesCompliance', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Требуется ли лицензия на деятельность, соответствует ли компания требованиям регуляторов?" onFocus={() => setFocusedField('licensesCompliance')} onBlur={() => setFocusedField(null)} />
                    <CharLimit limit={2000} field="licensesCompliance" />
                    {triedNext && errors.licensesCompliance && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
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
                  {(() => {
                    const fields = getFieldsForCurrentStep()
                    if (fields.length > 0 && formConfig && !configLoading) {
                      return fields.map((fieldConfig, idx) => {
                        const fieldKey = getFieldKeyFromQuestion(fieldConfig.question) as keyof FormData
                        return (
                          <div key={idx}>
                            <FieldLabel required={fieldConfig.required}>{fieldConfig.question}</FieldLabel>
                            {fieldConfig.fieldType === 'textarea' ? (
                              <>
                                <textarea 
                                  {...register(fieldKey, { 
                                    required: fieldConfig.required,
                                    maxLength: fieldConfig.maxLength
                                  })} 
                                  rows={fieldConfig.rows || 3} 
                                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                                    triedNext && errors[fieldKey] ? 'border-red-500' : ''
                                  }`}
                                  maxLength={fieldConfig.maxLength}
                                  placeholder={fieldConfig.placeholder || ''}
                                  onFocus={() => setFocusedField(fieldKey as string)} 
                                  onBlur={() => setFocusedField(null)} 
                                />
                                {fieldConfig.maxLength && <CharLimit limit={fieldConfig.maxLength} field={fieldKey} />}
                                <div className="min-h-[22px]">
                                  {triedNext && errors[fieldKey] && (
                                    <p className="mt-1 text-sm text-red-600">
                                      {errors[fieldKey]?.message || 'Это поле обязательно'}
                                    </p>
                                  )}
                                </div>
                              </>
                            ) : (
                              <>
                                <input 
                                  type={fieldConfig.fieldType || 'text'}
                                  {...register(fieldKey, { 
                                    required: fieldConfig.required,
                                    maxLength: fieldConfig.maxLength
                                  })} 
                                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                                    triedNext && errors[fieldKey] ? 'border-red-500' : ''
                                  }`}
                                  placeholder={fieldConfig.placeholder || ''}
                                  onFocus={() => setFocusedField(fieldKey as string)} 
                                  onBlur={() => setFocusedField(null)} 
                                />
                                {fieldConfig.maxLength && <CharLimit limit={fieldConfig.maxLength} field={fieldKey} />}
                                <div className="min-h-[22px]">
                                  {triedNext && errors[fieldKey] && (
                                    <p className="mt-1 text-sm text-red-600">
                                      {errors[fieldKey]?.message || 'Это поле обязательно'}
                                    </p>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        )
                      })
                    }
                    // Дефолтные поля для юридических вопросов
                    return (
                      <>
                        <div>
                          <FieldLabel required={true}>Наличие зарегистрированных интеллектуальных прав</FieldLabel>
                          <textarea {...register('intellectualProperty', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Предоставьте сведения о наличии зарегистрированных интеллектуальных прав у компании/акционеров компании (Оформлены ли права на продукт/код т.д.)" onFocus={() => setFocusedField('intellectualProperty')} onBlur={() => setFocusedField(null)} />
                          <CharLimit limit={2000} field="intellectualProperty" />
                          {triedNext && errors.intellectualProperty && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                        </div>
                        <div>
                          <FieldLabel required={true}>Наличие текущих судебных споров</FieldLabel>
                          <textarea {...register('legalDisputes', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Предоставьте сведения о наличии текущих судебных споров" onFocus={() => setFocusedField('legalDisputes')} onBlur={() => setFocusedField(null)} />
                          <CharLimit limit={2000} field="legalDisputes" />
                          {triedNext && errors.legalDisputes && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                        </div>
                        <div>
                          <FieldLabel required={true}>Наличие договоров с инвесторами</FieldLabel>
                          <textarea {...register('investorAgreements', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Предоставьте сведения о наличии договоров/соглашений с инвесторами, которые предоставляют права инвесторам на долю в компании (соглашения о конвертируемом займе/опционы, займы и т.д.)" onFocus={() => setFocusedField('investorAgreements')} onBlur={() => setFocusedField(null)} />
                          <CharLimit limit={2000} field="investorAgreements" />
                          {triedNext && errors.investorAgreements && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                        </div>
                        <div>
                          <FieldLabel required={true}>Формализованная структура владения</FieldLabel>
                          <textarea {...register('ownershipStructure', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Есть ли формализованная структура владения и документы между основателями (SHA/vesting)?" onFocus={() => setFocusedField('ownershipStructure')} onBlur={() => setFocusedField(null)} />
                          <CharLimit limit={2000} field="ownershipStructure" />
                          {triedNext && errors.ownershipStructure && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                        </div>
                        <div>
                          <FieldLabel required={true}>Наличие подписанных договоров с подрядчиками</FieldLabel>
                          <textarea {...register('contractorAgreements', { required: true, maxLength: 2000 })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={2000} placeholder="Есть ли подписанные договоры или оферты с клиентами/подрядчиками?" onFocus={() => setFocusedField('contractorAgreements')} onBlur={() => setFocusedField(null)} />
                          <CharLimit limit={2000} field="contractorAgreements" />
                          {triedNext && errors.contractorAgreements && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                        </div>
                      </>
                    )
                  })()}
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
                  {(() => {
                    const fields = getFieldsForCurrentStep()
                    if (fields.length > 0 && formConfig && !configLoading) {
                      return fields.map((fieldConfig, idx) => {
                        const fieldKey = getFieldKeyFromQuestion(fieldConfig.question) as keyof FormData
                        // Специальная обработка для файлового поля
                        if (fieldConfig.fieldType === 'file') {
                          return (
                            <div key={idx}>
                              <FieldLabel required={fieldConfig.required}>{fieldConfig.question}</FieldLabel>
                              {fieldConfig.placeholder && (
                                <div className="text-sm text-gray-600 mb-3">{fieldConfig.placeholder}</div>
                              )}
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Дополнительные документы</label>
                                  <input 
                                    type="file" 
                                    accept={fieldConfig.accept || ".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx"}
                                    onChange={(e) => setDocs(e.target.files?.[0] || null)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                  />
                                  {docs && (
                                    <p className="mt-2 text-sm text-gray-600">Выбран файл: {docs.name}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return (
                          <div key={idx}>
                            <FieldLabel required={fieldConfig.required}>{fieldConfig.question}</FieldLabel>
                            {fieldConfig.fieldType === 'textarea' ? (
                              <>
                                <textarea 
                                  {...register(fieldKey, { 
                                    required: fieldConfig.required,
                                    maxLength: fieldConfig.maxLength
                                  })} 
                                  rows={fieldConfig.rows || 5} 
                                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                                    triedNext && errors[fieldKey] ? 'border-red-500' : ''
                                  }`}
                                  maxLength={fieldConfig.maxLength}
                                  placeholder={fieldConfig.placeholder || ''}
                                  onFocus={() => setFocusedField(fieldKey as string)} 
                                  onBlur={() => setFocusedField(null)} 
                                />
                                {fieldConfig.maxLength && <CharLimit limit={fieldConfig.maxLength} field={fieldKey} />}
                                <div className="min-h-[22px]">
                                  {triedNext && errors[fieldKey] && (
                                    <p className="mt-1 text-sm text-red-600">
                                      {errors[fieldKey]?.message || 'Это поле обязательно'}
                                    </p>
                                  )}
                                </div>
                              </>
                            ) : (
                              <>
                                <input 
                                  type={fieldConfig.fieldType || 'text'}
                                  {...register(fieldKey, { 
                                    required: fieldConfig.required,
                                    maxLength: fieldConfig.maxLength
                                  })} 
                                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                                    triedNext && errors[fieldKey] ? 'border-red-500' : ''
                                  }`}
                                  placeholder={fieldConfig.placeholder || ''}
                                  onFocus={() => setFocusedField(fieldKey as string)} 
                                  onBlur={() => setFocusedField(null)} 
                                />
                                {fieldConfig.maxLength && <CharLimit limit={fieldConfig.maxLength} field={fieldKey} />}
                                <div className="min-h-[22px]">
                                  {triedNext && errors[fieldKey] && (
                                    <p className="mt-1 text-sm text-red-600">
                                      {errors[fieldKey]?.message || 'Это поле обязательно'}
                                    </p>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        )
                      })
                    }
                    // Дефолтные поля для завершения
                    return (
                      <>
                        <div>
                          <FieldLabel required={true}>Что ограничивает компанию от роста до «единорога»</FieldLabel>
                          <textarea {...register('growthLimitations', { required: true, maxLength: 3000 })} rows={5} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" maxLength={3000} placeholder="Опишите основные ограничения и препятствия для роста вашей компании" onFocus={() => setFocusedField('growthLimitations')} onBlur={() => setFocusedField(null)} />
                          <CharLimit limit={3000} field="growthLimitations" />
                          {triedNext && errors.growthLimitations && <p className="mt-1 text-sm text-red-600">Это поле обязательно</p>}
                        </div>
                        <div>
                          <FieldLabel required={false}>Приложить файлы</FieldLabel>
                          <div className="text-sm text-gray-600 mb-3">
                            Приложите сопутствующие документы для оценки. Например, презентации по проекту, проведенные вами исследования рынка или конкурентов.
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
                              {docs && (
                                <p className="mt-2 text-sm text-gray-600">Выбран файл: {docs.name}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  })()}
                </motion.div>
              )}
              <div className="flex justify-between pt-6">
                {step > 1 && (
                  <button type="button" onClick={() => goToStep(step - 1)} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">Назад</button>
                )}
                {step < getSectionTitles().length ? (
                  <button type="button" onClick={() => goToStep(step + 1)} className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Далее</button>
                ) : (
                  <button type="submit" className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Отправить заявку</button>
                )}
              </div>
            </form>
              </>
            )}
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