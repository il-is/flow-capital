# Настройка переменных окружения в Vercel

## Шаг 1: Вход в Vercel Dashboard

1. Откройте [Vercel Dashboard](https://vercel.com/dashboard)
2. Войдите в свой аккаунт
3. Найдите проект `flow-capital` (или создайте новый, если его нет)

## Шаг 2: Добавление переменных окружения

1. В проекте перейдите в раздел **Settings** (в верхнем меню)
2. В левом меню выберите **Environment Variables**
3. Нажмите кнопку **Add New** или **+ Add**

## Шаг 3: Добавьте следующие переменные

Добавьте каждую переменную отдельно, выбрав окружения: **Production**, **Preview**, и **Development** (или только Production, если нужно):

### Основные переменные:

```env
GOOGLE_SCRIPT_URL
```
Значение: `https://script.google.com/macros/s/AKfycbxIh05XLt5JI8FhQ4rz2IAtqA07AUzg7XeEo-YPzeAYeCWv4WLllPuUx19pie2TFJC1/exec`

---

```env
GOOGLE_SCRIPT_DASHBOARD_URL
```
Значение: `https://script.google.com/macros/s/AKfycbxPtiiAiAH5OTffbCsUEg1Y-AAJE7AITPkn8mCki12khSq6z2RAdpJaAhNoj-PyoXiJ/exec`

---

```env
EMAIL_USER
```
Значение: `il.isachenkov@gmail.com`

---

```env
EMAIL_PASSWORD
```
Значение: `borm ezpv eiug psiw`

---

```env
NEXT_PUBLIC_BASE_URL
```
Значение: `https://ваш-домен.vercel.app` (замените на реальный домен вашего проекта)

---

```env
DASHBOARD_USERNAME
```
Значение: `admin` (или ваш желаемый логин)

---

```env
DASHBOARD_PASSWORD
```
Значение: `ваш_безопасный_пароль` (создайте надежный пароль)

## Шаг 4: Сохранение и применение

1. После добавления всех переменных нажмите **Save**
2. Перейдите в раздел **Deployments**
3. Найдите последний деплой и нажмите **...** (три точки) → **Redeploy**
4. Или создайте новый деплой через **Deployments** → **Create Deployment**

## Шаг 5: Проверка

После деплоя проверьте:
1. Главная страница работает: `https://ваш-домен.vercel.app`
2. Форма стартапа работает: `https://ваш-домен.vercel.app/startups`
3. Дашборд доступен: `https://ваш-домен.vercel.app/dashboard`
4. Логин работает: `https://ваш-домен.vercel.app/login`

## Важные замечания

⚠️ **Безопасность:**
- После удаления `.env.local` из репозитория, файл все еще виден в истории Git
- Рекомендуется сменить пароли и токены, которые были в файле
- Для полного удаления из истории нужно использовать `git filter-branch` или `git filter-repo` (опционально, для будущего)

✅ **Следующие шаги:**
1. Переменные добавлены в Vercel
2. Файл удален из репозитория
3. Новые коммиты не будут включать `.env.local`

## Альтернатива: Ротация секретов (рекомендуется)

Для повышения безопасности рекомендуется:
1. Сгенерировать новые пароли для `EMAIL_PASSWORD` и `DASHBOARD_PASSWORD`
2. Обновить их в Vercel
3. Обновить локальный `.env.local` с новыми значениями

