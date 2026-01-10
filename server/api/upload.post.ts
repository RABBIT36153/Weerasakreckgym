import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readFormData(event)
    const file = formData.get('file') as File
    const type = formData.get('type') as string || 'image' // 'image' or 'pdf'

    if (!file) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ไม่พบไฟล์'
      })
    }

    // ตรวจสอบประเภทไฟล์
    if (type === 'image' && !file.type.startsWith('image/')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ไฟล์ต้องเป็นรูปภาพเท่านั้น'
      })
    }
    
    if (type === 'pdf' && file.type !== 'application/pdf') {
      throw createError({
        statusCode: 400,
        statusMessage: 'ไฟล์ต้องเป็น PDF เท่านั้น'
      })
    }

    // สร้างโฟลเดอร์ถ้ายังไม่มี (ใช้ public directory)
    const publicDir = join(process.cwd(), 'public')
    const uploadDir = join(publicDir, 'uploads', type)
    
    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true })
    }
    
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // สร้างชื่อไฟล์ใหม่
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_') // Sanitize filename
    const fileName = `${timestamp}-${originalName}`

    // บันทึกไฟล์
    const buffer = Buffer.from(await file.arrayBuffer())
    const filePath = join(uploadDir, fileName)
    await writeFile(filePath, buffer)

    // ส่งกลับ URL ของไฟล์
    const fileUrl = `/uploads/${type}/${fileName}`

    return {
      success: true,
      url: fileUrl,
      fileName: fileName
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'เกิดข้อผิดพลาดในการอัพโหลดไฟล์'
    })
  }
})

