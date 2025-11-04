/**
 * Google Apps Script для чтения данных дашборда
 * Отдельный скрипт для чтения данных, чтобы не влиять на логику записи заявок
 * Обновлено: 03.11.25
 */

// ID основной таблицы с заявками стартапов
const STARTUP_SPREADSHEET_ID = '1w_cGblOqZ1swSI9XZsoo5BNjA_8lJ3v_5_Fl-LFfCfk'; // Замените на ID вашей таблицы с заявками или оставьте пустым (если скрипт привязан к таблице)
const STARTUP_SHEET_NAME = 'Заявки с лендинга'; // Имя листа с заявками

// ID отдельной таблицы для скоринга
const SCORING_SPREADSHEET_ID = '1Q2DMl-r7MZmpNNdYlj1y6jvGJcjgnVrUmHtbNm-r-O0'; // ID таблицы со скорингом
const SCORING_SHEET_NAME = 'Скоринг'; // Имя листа со скорингом

/**
 * Обработчик GET запросов для чтения данных дашборда
 */
function doGet(e) {
  try {
    // Логируем параметры для отладки
    console.log('doGet called with parameters:', e.parameter);
    
    // Получаем action из параметров запроса
    // Может быть в e.parameter.action или e.parameter['action']
    const action = e.parameter.action || e.parameter['action'] || '';
    
    console.log('Action received:', action);
    
    if (action === 'getStartups') {
      console.log('Calling getStartupApplications');
      return getStartupApplications();
    } else if (action === 'getScoring') {
      console.log('Calling getScoringData');
      return getScoringData();
    } else if (action === 'getStartupsWithScoring') {
      console.log('Calling getStartupsWithScoring');
      return getStartupsWithScoring();
    } else {
      // Если action не указан, возвращаем информацию о доступных actions
      console.log('No action specified, returning info');
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Flow Capital Dashboard API is running',
        availableActions: ['getStartups', 'getScoring', 'getStartupsWithScoring'],
        receivedParameters: e.parameter || {},
        hint: 'Add ?action=getStartupsWithScoring to the URL'
      })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    console.error('Error in doGet:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString(),
      stack: error.stack
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Получает данные заявок стартапов из таблицы
 */
function getStartupApplications() {
  try {
    let sheet;
    let ss;
    let availableSheets = [];
    
    if (STARTUP_SPREADSHEET_ID && STARTUP_SPREADSHEET_ID !== '') {
      try {
        ss = SpreadsheetApp.openById(STARTUP_SPREADSHEET_ID);
        // Получаем список всех листов для диагностики
        availableSheets = ss.getSheets().map(s => s.getName());
        sheet = ss.getSheetByName(STARTUP_SHEET_NAME);
      } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: 'Cannot access spreadsheet with ID: ' + STARTUP_SPREADSHEET_ID,
          details: error.toString(),
          hint: 'Check if the script has access to the spreadsheet. Share the spreadsheet with the script execution account.'
        })).setMimeType(ContentService.MimeType.JSON);
      }
    } else {
      // Если скрипт привязан к таблице, используем активную таблицу
      try {
        ss = SpreadsheetApp.getActiveSpreadsheet();
        availableSheets = ss.getSheets().map(s => s.getName());
        sheet = ss.getSheetByName(STARTUP_SHEET_NAME) || ss.getActiveSheet();
      } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: 'Cannot access active spreadsheet',
          details: error.toString(),
          hint: 'Script must be bound to a spreadsheet or STARTUP_SPREADSHEET_ID must be set'
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Sheet not found: ' + STARTUP_SHEET_NAME,
        spreadsheetId: STARTUP_SPREADSHEET_ID || 'active spreadsheet',
        availableSheets: availableSheets,
        hint: 'Available sheets: ' + availableSheets.join(', ') + '. Please check the sheet name or create a sheet with this name.'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const lastRow = sheet.getLastRow();
    if (lastRow === 0) {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        startups: []
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Получаем заголовки
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Получаем данные
    const data = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
    
    // Преобразуем в объекты
    const startups = data.map((row) => {
      const startup = {};
      headers.forEach((header, index) => {
        startup[header] = row[index] || '';
      });
      return startup;
    });
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      startups: startups
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error getting startup applications:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Получает данные скоринга из отдельной таблицы
 */
function getScoringData() {
  try {
    if (!SCORING_SPREADSHEET_ID) {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        scoring: []
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    let ss;
    let availableSheets = [];
    
    try {
      ss = SpreadsheetApp.openById(SCORING_SPREADSHEET_ID);
      availableSheets = ss.getSheets().map(s => s.getName());
    } catch (error) {
      console.warn('Cannot access scoring spreadsheet:', error);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        scoring: [],
        warning: 'Cannot access scoring spreadsheet: ' + error.toString()
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const sheet = ss.getSheetByName(SCORING_SHEET_NAME);
    
    if (!sheet) {
      console.warn('Scoring sheet not found: ' + SCORING_SHEET_NAME);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        scoring: [],
        warning: 'Sheet "' + SCORING_SHEET_NAME + '" not found. Available sheets: ' + availableSheets.join(', ')
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const lastRow = sheet.getLastRow();
    if (lastRow === 0) {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        scoring: []
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Получаем заголовки
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Получаем данные
    const data = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
    
    // Преобразуем в объекты
    const scoring = data.map((row) => {
      const score = {};
      headers.forEach((header, index) => {
        score[header] = row[index] || '';
      });
      return score;
    });
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      scoring: scoring
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error getting scoring data:', error);
    // Возвращаем пустой массив при ошибке, чтобы дашборд продолжал работать
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      scoring: []
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Получает объединенные данные заявок и скоринга
 */
function getStartupsWithScoring() {
  try {
    const startupsResult = getStartupApplications();
    const startupsData = JSON.parse(startupsResult.getContent());
    
    if (!startupsData.success) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Failed to get startups: ' + (startupsData.error || 'Unknown error')
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const scoringResult = getScoringData();
    const scoringData = JSON.parse(scoringResult.getContent());
    
    const scoring = scoringData.scoring || [];
    const startups = startupsData.startups || [];
    
    // Отладочная информация
    console.log('Total startups:', startups.length);
    console.log('Total scoring entries:', scoring.length);
    
    if (startups.length > 0) {
      console.log('First startup keys:', Object.keys(startups[0]));
      console.log('First startup name column:', startups[0]['Название стартапа'] || startups[0]['Название старт'] || 'NOT FOUND');
    }
    
    if (scoring.length > 0) {
      console.log('First scoring keys:', Object.keys(scoring[0]));
      console.log('First scoring name:', scoring[0]['Название стартапа'] || 'NOT FOUND');
      console.log('All scoring names:', scoring.map(s => s['Название стартапа'] || 'N/A'));
    }
    
    // Объединяем данные по названию стартапа
    // Используем нестрогое сравнение (trim + toLowerCase) для учета пробелов и регистра
    const startupsWithScoring = startups.map((startup) => {
      // Пробуем разные варианты названий колонок
      const startupName = (startup['Название стартапа'] || 
                           startup['Название старт'] ||
                           startup['название стартапа'] ||
                           '').toString().trim().toLowerCase();
      
      if (!startupName) {
        console.log('Startup without name:', Object.keys(startup));
        return {
          ...startup,
          scoring: null
        };
      }
      
      const matchingScoring = scoring.find((score) => {
        const scoreName = (score['Название стартапа'] || '').toString().trim().toLowerCase();
        const match = scoreName === startupName;
        if (match) {
          console.log('✅ Matched:', startupName, '→ Score:', score['Общий скоринг']);
        }
        return match;
      });
      
      if (!matchingScoring && scoring.length > 0) {
        console.log('❌ No match for:', startupName);
        console.log('   Available scoring names:', scoring.map(s => (s['Название стартапа'] || '').toString().trim()));
      }
      
      return {
        ...startup,
        scoring: matchingScoring || null
      };
    });
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      startups: startupsWithScoring
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error getting startups with scoring:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

