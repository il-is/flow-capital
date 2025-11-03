# Быстрая настройка Google Apps Script

## Шаг 1: Откройте Google Apps Script
1. Перейдите на https://script.google.com/
2. Нажмите "Новый проект"

## Шаг 2: Вставьте код
1. Откройте файл `google-apps-script.js` 
2. Скопируйте **ВЕСЬ** код (Ctrl+A, Ctrl+C / Cmd+A, Cmd+C)
3. В Google Apps Script удалите весь код по умолчанию (функция myFunction)
4. Вставьте скопированный код (Ctrl+V / Cmd+V)

## Шаг 3: Обновите константы
Найдите в коде эти строки и замените значения:

```javascript
const SPREADSHEET_ID = 'ВАШ_SPREADSHEET_ID'; // Замените на ваш ID таблицы
const DRIVE_FOLDER_ID = 'ВАШ_FOLDER_ID'; // Замените на ID папки в Google Drive
```

### Как получить SPREADSHEET_ID:
1. Создайте или откройте Google Таблицу
2. Скопируйте ID из URL:
   - URL выглядит так: `https://docs.google.com/spreadsheets/d/1ABC123xyz.../edit`
   - ID это часть между `/d/` и `/edit`: `1ABC123xyz...`

### Как получить DRIVE_FOLDER_ID:
1. Создайте папку в Google Drive для файлов заявок
2. Откройте папку
3. Скопируйте ID из URL:
   - URL выглядит так: `https://drive.google.com/drive/folders/1XYZ789abc...`
   - ID это часть после `/folders/`: `1XYZ789abc...`

## Шаг 4: Сохраните проект
1. Нажмите Ctrl+S / Cmd+S
2. Дайте проекту название, например: "Flow Capital Startup Applications"

## Шаг 5: Разверните как веб-приложение
1. Нажмите **"Развернуть"** → **"Новое развертывание"**
2. Выберите тип: **"Веб-приложение"**
3. Настройки:
   - **Описание**: "Обработка заявок стартапов"
   - **Выполнять от имени**: **"Я"** (ваш email)
   - **У кого есть доступ**: **"Все"**
4. Нажмите **"Развернуть"**
5. При первом развертывании Google попросит авторизовать доступ:
   - Нажмите **"Авторизовать доступ"**
   - Выберите ваш аккаунт
   - Нажмите **"Дополнительно"** → **"Перейти к [название проекта] (небезопасно)"**
   - Нажмите **"Разрешить"**
6. После развертывания скопируйте **URL веб-приложения**
   - URL будет выглядеть примерно так: `https://script.google.com/macros/s/AKfycb.../exec`

## Шаг 6: Добавьте URL в .env.local
Создайте файл `.env.local` в папке `Cursor created/`:

```env
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/ВАШ_СКОПИРОВАННЫЙ_URL/exec
EMAIL_USER=ваш_email@gmail.com
EMAIL_PASSWORD=ваш_пароль_приложения
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Готово! ✅
После этого все заявки будут автоматически сохраняться в Google Таблицу, а файлы - в папку Google Drive.

