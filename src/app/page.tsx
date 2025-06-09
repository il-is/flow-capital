"use client";

import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

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
                <span className="text-blue-400 text-3xl">📈</span>
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
                <span className="text-blue-400 text-3xl">🚀</span>
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
                <span className="text-blue-400 text-3xl">🚀</span>
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
                <span className="text-blue-400 text-3xl">📈</span>
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
                icon: "📈"
              },
              {
                title: "Экспертиза",
                description: "Профессиональная команда аналитиков",
                icon: "🎯"
              },
              {
                title: "Сеть",
                description: "Широкая сеть партнеров и инвесторов",
                icon: "🌐"
              },
              {
                title: "Поддержка",
                description: "Комплексная поддержка проектов",
                icon: "🤝"
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
                <div className="text-4xl mb-4">{feature.icon}</div>
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