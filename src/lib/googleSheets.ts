import nodemailer from 'nodemailer'
import { writeFile } from 'fs/promises'
import path from 'path'

// ID веб-приложения Google Apps Script
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL

// Функция для конвертации File в base64
async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  return Buffer.from(buffer).toString('base64')
}

// Функция для сохранения файлов
async function saveFiles(docs: File | null, submissionId: string) {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    const filePaths = {
      docs: null as string | null
    }

    if (docs) {
      const docsPath = path.join(uploadsDir, `${submissionId}_docs.${getFileExtension(docs.name)}`)
      await writeFile(docsPath, Buffer.from(await docs.arrayBuffer()))
      filePaths.docs = `/uploads/${submissionId}_docs.${getFileExtension(docs.name)}`
    }

    return filePaths
  } catch (error) {
    console.error('Error saving files:', error)
    throw error
  }
}

// Функция для получения расширения файла
function getFileExtension(filename: string): string {
  return filename.split('.').pop() || 'bin'
}

// Функция для отправки email
async function sendEmailNotification(data: any, folderUrl: string) {
  try {
    console.log('Setting up email transporter...')
    console.log('EMAIL_USER:', process.env.EMAIL_USER)
    console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set' : 'Not set')
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      secure: true,
      port: 465,
    })

    // Проверяем соединение
    console.log('Verifying email connection...')
    await transporter.verify()
    console.log('Email connection verified successfully')

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'il.isachenkov@gmail.com',
      subject: 'Новая заявка от стартапа',
      html: `
        <h2>Новая заявка от стартапа</h2>
        <p><strong>Название компании:</strong> ${data.companyName}</p>
        <p><strong>Контактное лицо:</strong> ${data.contactName}</p>
        <p><strong>Email:</strong> ${data.email || 'Не указан'}</p>
        <p><strong>Телефон:</strong> ${data.phone}</p>
        <p><strong>Запрашиваемая сумма инвестиций:</strong> ${data.investmentAmount}</p>
        <p><strong>Процент компании:</strong> ${data.equityPercentage}</p>
        <p><a href="${folderUrl}">Скачать приложенные файлы</a></p>
      `,
    }

    console.log('Sending email...')
    const result = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', result.messageId)
    
    return result
  } catch (error) {
    console.error('Detailed error sending email:', error)
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('Error code:', (error as any).code)
    }
    if (error && typeof error === 'object' && 'message' in error) {
      console.error('Error message:', (error as any).message)
    }
    throw error
  }
}

// Функция для сохранения заявки через Google Apps Script
export async function submitStartupApplication(data: any, docs: File | null) {
  try {
    console.log('Starting submission process...')
    console.log('GOOGLE_SCRIPT_URL:', GOOGLE_SCRIPT_URL)

    const submissionId = Date.now().toString()
    console.log('Generated submissionId:', submissionId)

    // Конвертируем файлы в base64
    let docsBase64 = null

    if (docs) {
      console.log('Converting docs to base64...')
      docsBase64 = await fileToBase64(docs)
    }

    // Подготовка данных для записи
    const formData = {
      // Интро
      submissionDate: new Date().toISOString(),
      companyName: data.companyName,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      
      // Команда
      teamExperience: data.teamExperience,
      teamMembers: data.teamMembers,
      teamComment: data.teamComment,
      
      // Продукт и технологии
      productDescription: data.productDescription,
      productAvailability: data.productAvailability,
      productAudience: data.productAudience,
      uniqueSellingPoint: data.uniqueSellingPoint,
      productUniqueness: data.productUniqueness,
      researchAvailability: data.researchAvailability,
      techScalability: data.techScalability,
      marketSize: data.marketSize,
      productTechComment: data.productTechComment,
      
      // Финансы
      currentSales: data.currentSales,
      currentUsers: data.currentUsers,
      investmentAmount: data.investmentAmount,
      equityPercentage: data.equityPercentage,
      investmentPlan: data.investmentPlan,
      geographicScalability: data.geographicScalability,
      unitEconomics: data.unitEconomics,
      currentInvestments: data.currentInvestments,
      capTable: data.capTable,
      companyValuation: data.companyValuation,
      financeComment: data.financeComment,
      
      // Риски
      marketRisks: data.marketRisks,
      operationalRisks: data.operationalRisks,
      companyRegistration: data.companyRegistration,
      licensesCompliance: data.licensesCompliance,
      risksComment: data.risksComment,
      
      // Завершение
      growthLimitations: data.growthLimitations,
      
      // Файлы
      docsBase64,
      
      // ID заявки
      submissionId
    }

    console.log('Sending data to Google Apps Script...')

    // Отправка данных в Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL!, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('Google Apps Script response status:', response.status)
    const rawText = await response.text()
    console.log('Google Apps Script rawText:', rawText);
    let responseData
    try {
      responseData = JSON.parse(rawText)
    } catch (e) {
      throw new Error('Google Script вернул некорректный ответ: ' + rawText.slice(0, 100))
    }
    console.log('Google Apps Script response:', responseData)
    if (!response.ok) {
      throw new Error(`Failed to submit to Google Sheets: ${JSON.stringify(responseData)}`)
    }

    console.log('Sending email notification...')
    // Отправка уведомления на email
    try {
      const emailResult = await sendEmailNotification(data, responseData.folderUrl)
      console.log('Email notification sent successfully:', emailResult.messageId)
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError)
      // Не прерываем выполнение, если email не отправился
    }

    return { success: true, submissionId, folderUrl: responseData.folderUrl }
  } catch (error) {
    console.error('Error in submitStartupApplication:', error)
    throw error
  }
}

// Функция для отправки заявки инвестора
export async function submitInvestorApplication(data: any) {
  const formData = {
    submissionDate: new Date().toISOString(),
    investorType: data.investorType,
    industries: data.industries?.join(', '),
    experience: data.experience,
    investmentSize: data.investmentSize,
    preferredStage: data.preferredStage,
    investmentPeriod: data.investmentPeriod,
    contactName: data.contactName,
    email: data.email,
    phone: data.phone,
  };

  const response = await fetch(GOOGLE_SCRIPT_URL!, {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(`Failed to submit to Google Sheets: ${JSON.stringify(responseData)}`);
  }

  return { success: true, responseData };
}

export async function submitLeadToGoogleSheet(data: { name: string; email: string; phone: string; comment: string }) {
  const response = await fetch(GOOGLE_SCRIPT_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      submissionDate: new Date().toISOString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      comment: data.comment,
    }),
  });
  const rawText = await response.text();
  console.log('Google Apps Script rawText:', rawText);
  let responseData;
  try {
    responseData = JSON.parse(rawText);
  } catch (e) {
    throw new Error('Google Script вернул некорректный ответ: ' + rawText.slice(0, 100));
  }
  if (!response.ok || !responseData.success) {
    throw new Error(responseData.error || 'Ошибка при отправке в Google Sheets');
  }
  return { success: true };
} 