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
 * Поддерживает два типа запросов:
 * 1. type: 'application' - основная заявка (без файлов)
 * 2. type: 'file' - загрузка одного файла
 */
function doPost(e) {
  try {
    console.log('Received POST request');
    console.log('PostData contents length:', e.postData ? e.postData.contents.length : 0);
    
    // Парсим данные
    const data = JSON.parse(e.postData.contents);
    const requestType = data.requestType || 'application'; // По умолчанию старая версия для обратной совместимости
    
    console.log('Request type:', requestType);
    
    if (requestType === 'file') {
      // Обработка загрузки одного файла
      return handleFileUpload(data);
    } else {
      // Обработка основной заявки (без файлов)
      return handleApplicationSubmission(data);
    }
    
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Обрабатывает отправку основной заявки (без файлов)
 */
function handleApplicationSubmission(data) {
  try {
    console.log('Handling application submission');
    console.log('Parsed data keys:', Object.keys(data));
    console.log('Submission ID:', data.submissionId);
    console.log('Company name:', data.companyName);
    
    // Создаем папку для этой заявки в Google Drive
    const submissionId = data.submissionId || Date.now().toString();
    const folderName = `Заявка_${submissionId}_${data.companyName || 'Без названия'}`;
    const folder = createSubmissionFolder(folderName);
    const folderUrl = folder.getUrl();
    
    console.log('Created folder:', folderName, folderUrl);
    
    // Записываем данные в Google Таблицу (пока без файлов, ссылки обновим позже)
    let sheet;
    if (SPREADSHEET_ID && SPREADSHEET_ID !== '') {
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      sheet = ss.getSheetByName(SHEET_NAME);
      
      if (!sheet) {
        sheet = ss.insertSheet(SHEET_NAME);
        createHeaderRow(sheet);
      }
    } else {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();
    }
    
    // Проверяем, есть ли заголовки
    if (sheet.getLastRow() === 0) {
      createHeaderRow(sheet);
    }
    
    // Записываем данные с пустыми ссылками на файлы (они обновятся позже)
    writeDataToSheet(sheet, data, folderUrl, {});
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      submissionId: submissionId,
      folderUrl: folderUrl,
      folderId: folder.getId(),
      message: 'Application submitted successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error in handleApplicationSubmission:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Обрабатывает загрузку одного файла
 */
function handleFileUpload(data) {
  try {
    console.log('Handling file upload');
    console.log('File type:', data.fileType); // 'teamResume', 'financialModel', 'docs'
    console.log('Submission ID:', data.submissionId);
    console.log('File name:', data.fileName);
    console.log('Base64 length:', data.base64 ? data.base64.length : 0);
    
    const submissionId = data.submissionId;
    const folderId = data.folderId;
    const fileType = data.fileType; // 'teamResume', 'financialModel', 'docs'
    const base64Data = data.base64;
    const fileName = data.fileName;
    
    if (!submissionId || !folderId || !fileType || !base64Data) {
      throw new Error('Missing required fields: submissionId, folderId, fileType, base64');
    }
    
    // Находим папку
    let folder;
    try {
      folder = DriveApp.getFolderById(folderId);
    } catch (error) {
      throw new Error('Folder not found: ' + folderId);
    }
    
    // Формируем имя файла
    let finalFileName;
    const fileTypeNames = {
      'teamResume': 'Резюме_команды',
      'financialModel': 'Финансовая_модель',
      'docs': 'Дополнительные_документы'
    };
    const typePrefix = fileTypeNames[fileType] || 'Файл';
    
    if (fileName) {
      finalFileName = `${typePrefix}_${submissionId}_${fileName}`;
    } else {
      finalFileName = `${typePrefix}_${submissionId}`;
    }
    
    console.log('Saving file:', finalFileName);
    
    // Сохраняем файл
    const fileUrl = saveFileToDrive(folder, finalFileName, base64Data);
    
    if (!fileUrl) {
      throw new Error('Failed to save file to Drive');
    }
    
    console.log('File saved successfully:', fileUrl);
    
    // Обновляем ссылку на файл в таблице
    updateFileUrlInSheet(submissionId, fileType, fileUrl);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      fileUrl: fileUrl,
      fileType: fileType,
      message: 'File uploaded successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error in handleFileUpload:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Обновляет ссылку на файл в строке таблицы
 */
function updateFileUrlInSheet(submissionId, fileType, fileUrl) {
  try {
    let sheet;
    if (SPREADSHEET_ID && SPREADSHEET_ID !== '') {
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      sheet = ss.getSheetByName(SHEET_NAME);
    } else {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();
    }
    
    if (!sheet) {
      console.error('Sheet not found');
      return;
    }
    
    // Находим строку по submissionId
    const headerRow = 1;
    const submissionIdColumn = 2; // Колонка с submissionId (начинается с 1)
    
    const lastRow = sheet.getLastRow();
    let foundRow = -1;
    
    for (let row = headerRow + 1; row <= lastRow; row++) {
      const cellValue = sheet.getRange(row, submissionIdColumn).getValue();
      if (cellValue === submissionId) {
        foundRow = row;
        break;
      }
    }
    
    if (foundRow === -1) {
      console.error('Row with submissionId not found:', submissionId);
      return;
    }
    
    // Определяем колонку для файла
    // Порядок колонок в заголовке (последние 4):
    // 31: 'Ссылка на папку с файлами' (folderUrl)
    // 32: 'Ссылка на резюме команды' (teamResume)
    // 33: 'Ссылка на финансовую модель' (financialModel)
    // 34: 'Ссылка на дополнительные документы' (docs)
    const lastColumn = sheet.getLastColumn();
    const folderUrlColumn = lastColumn - 3; // Колонка 31 из 34 (если 34 колонки)
    const teamResumeColumn = lastColumn - 2; // Колонка 32
    const financialModelColumn = lastColumn - 1; // Колонка 33
    const docsColumn = lastColumn; // Колонка 34
    
    let targetColumn;
    if (fileType === 'teamResume') {
      targetColumn = teamResumeColumn;
    } else if (fileType === 'financialModel') {
      targetColumn = financialModelColumn;
    } else if (fileType === 'docs') {
      targetColumn = docsColumn;
    } else {
      console.error('Unknown file type:', fileType);
      return;
    }
    
    // Обновляем ячейку
    sheet.getRange(foundRow, targetColumn).setValue(fileUrl);
    console.log('Updated file URL in row', foundRow, 'column', targetColumn);
    
  } catch (error) {
    console.error('Error updating file URL in sheet:', error);
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
    'Планы развития',
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
    'Наличие зарегистрированных интеллектуальных прав',
    'Наличие текущих судебных споров',
    'Наличие договоров с инвесторами',
    'Формализованная структура владения',
    'Наличие подписанных договоров с подрядчиками',
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
    data.developmentPlans || '',
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
    
    // Юридические вопросы
    data.intellectualProperty || '',
    data.legalDisputes || '',
    data.investorAgreements || '',
    data.ownershipStructure || '',
    data.contractorAgreements || '',
    
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

