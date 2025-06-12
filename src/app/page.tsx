"use client";

import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

// Иконки
const ChartBarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
)

const RocketIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
  </svg>
)

const TargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
  </svg>
)

const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
)

const HandshakeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
  </svg>
)

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1685034759882-34583cece8e1?q=80&w=1601&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Hero Background"
            fill
            className="object-cover opacity-50"
            priority
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-6xl font-bold mb-8">Flow.Capital</h1>
            <p className="text-2xl mb-12 max-w-2xl mx-auto">
              Мы соединяем компании с умными инвестициями
            </p>
            <div className="space-x-4">
              {/*<Link href="/startups" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg">
                Для стартапов
              </Link>*/}
              {/*<Link href="/investors" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg">
                Для инвесторов
              </Link>*/}
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-4xl font-bold mb-6">О компании</h2>
              <p className="text-lg text-gray-300 mb-6">
              Flow.Capital — инвестиционная компания нового формата, соединяющая перспективные стартапы с инвесторами для создания прозрачных сделок и синергичного роста бизнеса.
              </p>
              <p className="text-lg text-gray-300">
                Мы объединяем инновационные проекты с опытными инвесторами без сложных структур и заморозки капитала.
              </p>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070"
                alt="About Us"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Target Audience & Terms Section */}
      <section id="terms" className="py-20 bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            Условия сотрудничества
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-10">
            {/* Для инвесторов */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col gap-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-blue-400"><ChartBarIcon /></span>
                <h3 className="text-2xl font-bold">Для инвесторов</h3>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Кто нам подходит:</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Владельцы бизнеса, семейные офисы, HNWI</li>
                  <li>Топ-менеджеры и предприниматели, желающие диверсифицировать активы</li>
                  <li>Корпоративные и международные инвесторы</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Наши условия:</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Порог входа — от 10 млн ₽</li>
                  <li>Гибкие форматы участия (SPV, договорная модель)</li>
                  <li>Доступ к отобранным сделкам с высоким потенциалом роста</li>
                  <li>Юридическая прозрачность и сопровождение</li>
                  <li>Возможность синергии с основным бизнесом</li>
                </ul>
              </div>
            </motion.div>
            {/* Для стартапов */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col gap-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-blue-400"><RocketIcon /></span>
                <h3 className="text-2xl font-bold">Для стартапов</h3>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Кто нам подходит:</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Компании с сильной командой и подтверждённым потенциалом роста</li>
                  <li>Growth-стартапы и зрелые бизнесы, готовые к масштабированию</li>
                  <li>Проекты с амбициями выхода на новые рынки и инновациями</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Наши условия:</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Доступ к "умным деньгам": капитал + экспертиза, связи, менторство</li>
                  <li>Гибкая структура сделки, учёт интересов фаундеров</li>
                  <li>Возможность частичного cash-out на стадии роста</li>
                  <li>Поддержка при масштабировании и выходе на международные рынки</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Сравнение инвестиционных подходов
          </motion.h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-gray-800">
                  <th className="py-3 px-4 text-left text-lg font-semibold rounded-l-xl">Кто</th>
                  <th className="py-3 px-4 text-left text-lg font-semibold">Плюсы</th>
                  <th className="py-3 px-4 text-left text-lg font-semibold rounded-r-xl">Минусы</th>
                </tr>
              </thead>
              <tbody className="text-gray-200 text-base">
                <tr className="bg-gray-850 hover:bg-gray-800 transition">
                  <td className="py-4 px-4 font-semibold">Бизнес ангелы</td>
                  <td className="py-4 px-4">Личное общение и менторство; Гибкие условия; Готовы инвестировать в высокорисковые, ранней стадии компании; Важные контакты; Нет обязательств по возврату капитала</td>
                  <td className="py-4 px-4">Меньшие инвестиционные суммы; Потеря контроля; Возможные конфликты интересов; Менее формальные процессы; Более высокие ожидания</td>
                </tr>
                <tr className="bg-gray-850 hover:bg-gray-800 transition">
                  <td className="py-4 px-4 font-semibold">Венчурные фонды</td>
                  <td className="py-4 px-4">Значительный капитал; Экспертное знание и руководство; Сеть контактов и связей; Укрепление репутации</td>
                  <td className="py-4 px-4">Более высокие ожидания; Потеря контроля; Сложные процессы; Нажим на достижение результатов</td>
                </tr>
                <tr className="bg-gray-850 hover:bg-gray-800 transition">
                  <td className="py-4 px-4 font-semibold">Акселераторы</td>
                  <td className="py-4 px-4">Структурная поддержка и менторство; Сообщество и сетевая поддержка; Больше видимость и распространение; Начальное финансирование</td>
                  <td className="py-4 px-4">Затрата времени; Разбавление капитала; Ограниченный срок</td>
                </tr>
                <tr className="bg-gray-850 hover:bg-gray-800 transition">
                  <td className="py-4 px-4 font-semibold">Корпорации/Банки</td>
                  <td className="py-4 px-4">Стратегические партнерства; Вероятность и стабильность; Долгосрочная поддержка; Доступ к корпоративным сетям</td>
                  <td className="py-4 px-4">Возможные несоответствия интересов; Бюрократические процессы; Меньше гибкости; Возможный приобретение</td>
                </tr>
                <tr className="bg-gray-850 hover:bg-gray-800 transition">
                  <td className="py-4 px-4 font-semibold">Краудфандинг</td>
                  <td className="py-4 px-4">Разнообразные источники финансирования; Формирование общества; Нет разбавления капитала (для определённых типов); Верификация; Маркетинговая поддержка и видимость</td>
                  <td className="py-4 px-4">Затрата времени и усилий; Риск неудачи; Соблюдение регистрационных норм; Проблемы восприятия; Возможные мошеннические действия</td>
                </tr>
                <tr className="bg-green-900/80 hover:bg-green-800/90 transition font-bold rounded-xl shadow-lg">
                  <td className="py-4 px-4 rounded-l-xl">Мы (Flow.Capital)</td>
                  <td className="py-4 px-4">Экспертная поддержка и советы по подготовке к инвестициям; Эффективный процесс поиска и обеспечения инвестиций; Значительный допустимый объем инвестиций; Плата комиссии по завершению сделки с привлечённых средств</td>
                  <td className="py-4 px-4 rounded-r-xl">Зависимость от качества и охвата сетевых контактов Flow; Возможные ограничения в прямом контакте с инвесторами</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            Наши услуги
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Инвестиции в стартапы",
                description: "Финансирование перспективных проектов на ранних стадиях",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070"
              },
              {
                title: "Консультации",
                description: "Профессиональная поддержка в развитии бизнеса",
                image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070"
              },
              {
                title: "Сетевые возможности",
                description: "Доступ к широкой сети инвесторов и партнеров",
                image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2070"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-800 rounded-lg overflow-hidden"
              >
                <div className="relative h-48">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-300">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gradient-to-br from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            Преимущества работы с Flow.Capital
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-10">
            {/* Стартапы */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col gap-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-blue-400"><RocketIcon /></span>
                <h3 className="text-2xl font-bold">Для стартапов</h3>
              </div>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Доступ к "умным деньгам" — не только капитал, но и экспертиза, связи, менторство</li>
                <li>Гибкая структура сделки, учёт интересов фаундеров</li>
                <li>Возможность частичного cash-out на стадии роста</li>
                <li>Поддержка при масштабировании и выходе на международные рынки</li>
                <li>Прозрачность и юридическое сопровождение</li>
              </ul>
            </motion.div>
            {/* Инвесторы */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col gap-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-blue-400"><ChartBarIcon /></span>
                <h3 className="text-2xl font-bold">Для инвесторов</h3>
              </div>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Доступ к тщательно отобранным сделкам с высоким потенциалом роста</li>
                <li>Гибкие форматы участия (SPV, договорная модель)</li>
                <li>Порог входа — от 10 млн ₽</li>
                <li>Структурированное сопровождение, юридическая прозрачность</li>
                <li>Возможность синергии с основным бизнесом или отраслью</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            Почему выбирают нас
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Опыт",
                description: "Более 10 лет в инвестиционной сфере",
                icon: <ChartBarIcon />
              },
              {
                title: "Экспертиза",
                description: "Профессиональная команда аналитиков",
                icon: <TargetIcon />
              },
              {
                title: "Сеть",
                description: "Широкая сеть партнеров и инвесторов",
                icon: <GlobeIcon />
              },
              {
                title: "Поддержка",
                description: "Комплексная поддержка проектов",
                icon: <HandshakeIcon />
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-800 p-6 rounded-lg text-center"
              >
                <div className="text-blue-400 mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            Как мы работаем
          </motion.h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Анализ",
                description: "Изучаем проект и рынок"
              },
              {
                step: "02",
                title: "Заключение договора",
                description: "Заключаем договор"
              },
              {
                step: "03",
                title: "Подбор инвестиций",
                description: "Подбираем инвесторов"
              },
              {
                step: "04",
                title: "Проведение сделки",
                description: "Структурируем сделку"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-6xl font-bold text-blue-600 mb-4">{step.step}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Готовы начать?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              От взаимовыгодного сотрудничества нас отделяет заявка
            </p>
            <div className="space-x-4">
              <Link href="/startups" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg">
                Для стартапа
              </Link>
              <Link href="/investors" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg">
                Для инвестора
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contacts Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-8"
          >
            Контакты
          </motion.h2>
          <div className="flex flex-col md:flex-row justify-center gap-12 text-lg text-gray-300">
            <div className="flex-1 text-center">
              <div className="mb-2 font-semibold text-white">Email</div>
              <div>info@flow.capital</div>
            </div>
            <div className="flex-1 text-center">
              <div className="mb-2 font-semibold text-white">Телефон</div>
              <div>+7 (999) 123-45-67</div>
            </div>
            <div className="flex-1 text-center">
              <div className="mb-2 font-semibold text-white">Адрес</div>
              <div>Москва, ул. Примерная, 1</div>
            </div>
            <div className="flex-1 text-center">
              <div className="mb-2 font-semibold text-white">Соцсети</div>
              <div className="flex justify-center gap-3 mt-1">
              <a href="#" className="hover:text-blue-400" aria-label="Telegram"><svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M9.036 15.684l-.396 4.09c.568 0 .814-.244 1.112-.537l2.664-2.53 5.522 4.04c1.012.557 1.73.264 1.98-.937l3.59-16.84c.327-1.513-.547-2.104-1.523-1.75L1.36 9.36c-1.48.57-1.46 1.38-.253 1.75l4.31 1.347 10.01-6.31c.47-.29.9-.13.55.18"/></svg></a>
              </div>
            </div>
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
    </main>
  )
}