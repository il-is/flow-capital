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
    console.log('Received POST request');
    console.log('PostData contents length:', e.postData ? e.postData.contents.length : 0);
    
    // Парсим данные
    const data = JSON.parse(e.postData.contents);
    console.log('Parsed data keys:', Object.keys(data));
    console.log('Submission ID:', data.submissionId);
    console.log('Company name:', data.companyName);
    
    // Создаем папку для этой заявки в Google Drive
    const submissionId = data.submissionId || Date.now().toString();
    const folderName = `Заявка_${submissionId}_${data.companyName || 'Без названия'}`;
    const folder = createSubmissionFolder(folderName);
    const folderUrl = folder.getUrl();
    
    // Сохраняем файлы в папку
    const fileUrls = {};
    
    // Проверяем наличие всех данных о файлах
    console.log('Files data check:', {
      hasDocsBase64: !!data.docsBase64,
      docsBase64Type: typeof data.docsBase64,
      docsBase64Length: data.docsBase64 ? data.docsBase64.length : 0,
      hasDocsFileName: !!data.docsFileName,
      docsFileName: data.docsFileName || 'none',
      hasTeamResumeBase64: !!data.teamResumeBase64,
      teamResumeBase64Type: typeof data.teamResumeBase64,
      teamResumeBase64Length: data.teamResumeBase64 ? data.teamResumeBase64.length : 0,
      hasTeamResumeFileName: !!data.teamResumeFileName,
      teamResumeFileName: data.teamResumeFileName || 'none',
      hasFinancialModelBase64: !!data.financialModelBase64,
      financialModelBase64Type: typeof data.financialModelBase64,
      financialModelBase64Length: data.financialModelBase64 ? data.financialModelBase64.length : 0,
      hasFinancialModelFileName: !!data.financialModelFileName,
      financialModelFileName: data.financialModelFileName || 'none'
    });
    
    // Проверяем все ключи данных
    console.log('All data keys:', Object.keys(data).filter(key => key.includes('Base64') || key.includes('FileName')));
    
    if (data.docsBase64) {
      // Используем оригинальное имя файла или генерируем
      const fileName = data.docsFileName 
        ? `Дополнительные_документы_${submissionId}_${data.docsFileName}`
        : `Дополнительные_документы_${submissionId}`;
      console.log('Saving docs file:', fileName);
      fileUrls.docs = saveFileToDrive(
        folder,
        fileName,
        data.docsBase64
      );
      console.log('Docs file URL:', fileUrls.docs);
    }
    if (data.teamResumeBase64) {
      // Используем оригинальное имя файла или генерируем
      const fileName = data.teamResumeFileName 
        ? `Резюме_команды_${submissionId}_${data.teamResumeFileName}`
        : `Резюме_команды_${submissionId}`;
      console.log('Saving teamResume file:', fileName);
      fileUrls.teamResume = saveFileToDrive(
        folder,
        fileName,
        data.teamResumeBase64
      );
      console.log('TeamResume file URL:', fileUrls.teamResume);
    }
    if (data.financialModelBase64) {
      // Используем оригинальное имя файла или генерируем
      const fileName = data.financialModelFileName 
        ? `Финансовая_модель_${submissionId}_${data.financialModelFileName}`
        : `Финансовая_модель_${submissionId}`;
      console.log('Saving financialModel file:', fileName);
      fileUrls.financialModel = saveFileToDrive(
        folder,
        fileName,
        data.financialModelBase64
      );
      console.log('FinancialModel file URL:', fileUrls.financialModel);
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
    console.log('Saving file to Drive:', fileName);
    
    // Проверяем, что base64 данные не пустые
    if (!base64Data || typeof base64Data !== 'string' || base64Data.length === 0) {
      console.error('Base64 data is empty or invalid for file:', fileName);
      return '';
    }
    
    console.log('Base64 data length:', base64Data.length);
    
    // Пытаемся определить тип файла по содержимому и имени файла
    let mimeType = detectMimeTypeFromBase64(base64Data, fileName);
    
    // Если не удалось определить, пробуем по имени файла
    if (!mimeType) {
      const fileExtension = getFileExtensionFromName(fileName);
      mimeType = getMimeTypeByExtension(fileExtension);
      console.log('MIME type from extension:', mimeType, 'extension:', fileExtension);
    } else {
      console.log('MIME type from detection:', mimeType);
    }
    
    // Декодируем base64 данные
    let decodedData;
    try {
      decodedData = Utilities.base64Decode(base64Data);
      console.log('Decoded data size:', decodedData.length, 'bytes');
      
      if (!decodedData || decodedData.length === 0) {
        console.error('Decoded data is empty for file:', fileName);
        return '';
      }
    } catch (decodeError) {
      console.error('Error decoding base64:', decodeError);
      return '';
    }
    
    const blob = Utilities.newBlob(
      decodedData,
      mimeType || 'application/octet-stream',
      fileName
    );
    
    const file = folder.createFile(blob);
    console.log('File created successfully:', file.getName(), file.getUrl(), 'Size:', file.getSize(), 'bytes');
    return file.getUrl();
  } catch (error) {
    console.error('Error saving file to Drive:', error);
    console.error('Error details:', error.toString());
    console.error('Error stack:', error.stack);
    return '';
  }
}

/**
 * Определяет MIME тип по содержимому base64
 */
function detectMimeTypeFromBase64(base64Data, fileName) {
  try {
    const bytes = Utilities.base64Decode(base64Data.substring(0, 100));
    
    // PDF
    if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
      return 'application/pdf';
    }
    
    // ZIP-based formats (DOCX, XLSX, PPTX)
    if (bytes[0] === 0x50 && bytes[1] === 0x4B && bytes[2] === 0x03 && bytes[3] === 0x04) {
      // Для ZIP-архивов проверяем расширение файла, т.к. содержимое одинаковое
      if (fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        if (extension === 'docx') {
          return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        } else if (extension === 'xlsx' || extension === 'xlsm') {
          return extension === 'xlsm' 
            ? 'application/vnd.ms-excel.sheet.macroEnabled.12'
            : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        } else if (extension === 'pptx') {
          return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        }
      }
      // По умолчанию возвращаем XLSX, если расширение не определено
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    
    // DOC (старый формат Word)
    if (bytes[0] === 0xD0 && bytes[1] === 0xCF && bytes[2] === 0x11 && bytes[3] === 0xE0) {
      // Проверяем расширение для точного определения
      if (fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        if (extension === 'doc') {
          return 'application/msword';
        } else if (extension === 'xls') {
          return 'application/vnd.ms-excel';
        }
      }
      return 'application/msword'; // По умолчанию DOC
    }
    
    return null;
  } catch (error) {
    console.error('Error detecting MIME type:', error);
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

