/**
 * Google Apps Script для обработки заявок стартапов
 * Обновлено: 03.11.25
 */

// ID вашей Google Таблицы (оставьте пустым, если скрипт привязан к таблице)
// Если скрипт привязан к таблице, будет использоваться активная таблица
const SPREADSHEET_ID = ''; // Замените на ваш ID таблицы или оставьте пустым

// Имя листа в таблице
const SHEET_NAME = 'Заявки стартапов'; // Имя листа

// ID папки в Google Drive для сохранения файлов (оставьте пустым для сохранения в корне)
const DRIVE_FOLDER_ID = ''; // Замените на ID папки или оставьте пустым

/**
 * Обработчик GET запросов (требуется для веб-приложения)
 */
function doGet(e) {
  return ContentService.createTextOutput('Flow Capital API is running')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Обработчик POST запросов от веб-приложения
 */
function doPost(e) {
  try {
    // Парсим данные
    const data = JSON.parse(e.postData.contents);
    console.log('Received data:', Object.keys(data));
    
    // Создаем папку для этой заявки в Google Drive
    const submissionId = data.submissionId || Date.now().toString();
    const folderName = `Заявка_${submissionId}_${data.companyName || 'Без названия'}`;
    const folder = createSubmissionFolder(folderName);
    const folderUrl = folder.getUrl();
    
    // Сохраняем файлы в папку
    const fileUrls = {};
    if (data.docsBase64) {
      fileUrls.docs = saveFileToDrive(
        folder,
        `Дополнительные_документы_${submissionId}`,
        data.docsBase64
      );
    }
    if (data.teamResumeBase64) {
      fileUrls.teamResume = saveFileToDrive(
        folder,
        `Резюме_команды_${submissionId}`,
        data.teamResumeBase64
      );
    }
    if (data.financialModelBase64) {
      fileUrls.financialModel = saveFileToDrive(
        folder,
        `Финансовая_модель_${submissionId}`,
        data.financialModelBase64
      );
    }
    
    // Записываем данные в Google Таблицу
    let sheet;
    if (SPREADSHEET_ID && SPREADSHEET_ID !== '') {
      // Используем указанный ID таблицы
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      sheet = ss.getSheetByName(SHEET_NAME);
      
      if (!sheet) {
        sheet = ss.insertSheet(SHEET_NAME);
        createHeaderRow(sheet);
      }
    } else {
      // Используем активную таблицу (старый подход)
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();
    }
    
    // Проверяем, есть ли заголовки
    if (sheet.getLastRow() === 0) {
      createHeaderRow(sheet);
    }
    
    writeDataToSheet(sheet, data, folderUrl, fileUrls);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      submissionId: submissionId,
      folderUrl: folderUrl,
      fileUrls: fileUrls
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Создает заголовки в таблице
 */
function createHeaderRow(sheet) {
  const headers = [
    'Дата заявки',
    'ID заявки',
    'Название стартапа',
    'Контактное лицо (ФИО)',
    'Email',
    'Контактный телефон',
    'Отраслевая экспертиза',
    'Полнота команды',
    'Опишите ваш продукт',
    'Наличие продукта',
    'Аудитория продукта',
    'Уникальное торговое предложение',
    'Наличие исследований',
    'Технологическая масштабируемость',
    'Размер рынка',
    'Текущие продажи',
    'Текущие расходы',
    'Текущие пользователи',
    'Запрашиваемая сумма инвестиций',
    'Какой % компании вы готовы продать',
    'План использования инвестиций',
    'Масштабируемость проекта (географическая)',
    'Текущие инвестиции и структура капитала',
    'Структура капитала',
    'Оценка компании',
    'Рыночные риски',
    'Операционные риски',
    'Регистрация компании',
    'Лицензии и регуляторное соответствие',
    'Что ограничивает компанию от роста до единорога',
    'Ссылка на папку с файлами',
    'Ссылка на резюме команды',
    'Ссылка на финансовую модель',
    'Ссылка на дополнительные документы'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.getRange(1, 1, 1, headers.length).setBackground('#4285f4');
  sheet.getRange(1, 1, 1, headers.length).setFontColor('#ffffff');
}

/**
 * Записывает данные в таблицу
 */
function writeDataToSheet(sheet, data, folderUrl, fileUrls) {
  const row = [
    data.submissionDate || new Date().toISOString(),
    data.submissionId || '',
    
    // Интро
    data.companyName || '',
    data.contactName || '',
    data.email || '',
    data.phone || '',
    
    // Команда
    data.teamExperience || '',
    data.teamMembers || '',
    
    // Продукт и технологии
    data.productDescription || '',
    data.productAvailability || '',
    data.productAudience || '',
    data.uniqueSellingPoint || '',
    data.researchAvailability || '',
    data.techScalability || '',
    data.marketSize || '',
    
    // Финансы
    data.currentSales || '',
    data.currentExpenses || '',
    data.currentUsers || '',
    data.investmentAmount || '',
    data.equityPercentage || '',
    data.investmentPlan || '',
    data.geographicScalability || '',
    data.currentInvestments || '',
    data.capTable || '',
    data.companyValuation || '',
    
    // Риски
    data.marketRisks || '',
    data.operationalRisks || '',
    data.companyRegistration || '',
    data.licensesCompliance || '',
    
    // Завершение
    data.growthLimitations || '',
    
    // Ссылки на файлы
    folderUrl,
    fileUrls.teamResume || '',
    fileUrls.financialModel || '',
    fileUrls.docs || ''
  ];
  
  sheet.appendRow(row);
}

/**
 * Создает папку для заявки в Google Drive
 */
function createSubmissionFolder(folderName) {
  try {
    if (DRIVE_FOLDER_ID && DRIVE_FOLDER_ID !== '') {
      // Создаем в указанной папке
      const parentFolder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
      return parentFolder.createFolder(folderName);
    } else {
      // Создаем в корне Drive (старый подход)
      return DriveApp.createFolder(folderName);
    }
  } catch (error) {
    console.error('Error creating folder:', error);
    // Если не удалось создать в указанной папке, создаем в корне Drive
    return DriveApp.createFolder(folderName);
  }
}

/**
 * Сохраняет файл в Google Drive
 */
function saveFileToDrive(folder, fileName, base64Data) {
  try {
    // Пытаемся определить тип файла по содержимому
    let mimeType = detectMimeTypeFromBase64(base64Data);
    
    // Если не удалось определить, пробуем по имени файла
    if (!mimeType) {
      const fileExtension = getFileExtensionFromName(fileName);
      mimeType = getMimeTypeByExtension(fileExtension);
    }
    
    const blob = Utilities.newBlob(
      Utilities.base64Decode(base64Data),
      mimeType || 'application/octet-stream',
      fileName
    );
    
    const file = folder.createFile(blob);
    return file.getUrl();
  } catch (error) {
    console.error('Error saving file to Drive:', error);
    return '';
  }
}

/**
 * Определяет MIME тип по содержимому base64
 */
function detectMimeTypeFromBase64(base64Data) {
  try {
    const bytes = Utilities.base64Decode(base64Data.substring(0, 100));
    
    // PDF
    if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
      return 'application/pdf';
    }
    
    // ZIP-based formats (DOCX, XLSX, PPTX)
    if (bytes[0] === 0x50 && bytes[1] === 0x4B && bytes[2] === 0x03 && bytes[3] === 0x04) {
      // Нужно проверить внутреннюю структуру для точного определения
      // По умолчанию возвращаем XLSX, т.к. чаще всего это Excel файлы
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    
    // DOC (старый формат Word)
    if (bytes[0] === 0xD0 && bytes[1] === 0xCF && bytes[2] === 0x11 && bytes[3] === 0xE0) {
      return 'application/msword';
    }
    
    // XLS (старый формат Excel)
    if (bytes[0] === 0xD0 && bytes[1] === 0xCF && bytes[2] === 0x11 && bytes[3] === 0xE0) {
      return 'application/vnd.ms-excel';
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Определяет расширение файла из имени
 */
function getFileExtensionFromName(fileName) {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Определяет MIME тип по расширению
 */
function getMimeTypeByExtension(extension) {
  const mimeTypes = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'xlsm': 'application/vnd.ms-excel.sheet.macroEnabled.12',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  };
  return mimeTypes[extension] || 'application/octet-stream';
}

