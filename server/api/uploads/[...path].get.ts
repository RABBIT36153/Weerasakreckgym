import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
  try {
    // Get path from catch-all route - it will be like "image/filename.jpg"
    const pathParam = getRouterParam(event, 'path')
    
    if (!pathParam) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid path'
      })
    }

    // Construct file path
    const publicDir = join(process.cwd(), 'public')
    
    // Path will be like "image/filename.jpg" or "pdf/filename.pdf"
    // We need to construct the full path to public/uploads/{type}/{filename}
    const filePath = join(publicDir, 'uploads', pathParam)

    // Security: Ensure the file is within public/uploads directory
    const resolvedPath = filePath
    const uploadsDir = join(publicDir, 'uploads')
    if (!resolvedPath.startsWith(uploadsDir)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied'
      })
    }

    // Check if file exists
    if (!existsSync(filePath)) {
      throw createError({
        statusCode: 404,
        statusMessage: `File not found: ${pathParam}`
      })
    }

    // Read file
    const fileBuffer = await readFile(filePath)
    
    // Determine content type based on file extension
    const ext = pathParam.split('.').pop()?.toLowerCase()
    const contentTypeMap: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'pdf': 'application/pdf',
      'svg': 'image/svg+xml'
    }
    
    const contentType = contentTypeMap[ext || ''] || 'application/octet-stream'

    // Set headers and return file
    setHeader(event, 'Content-Type', contentType)
    setHeader(event, 'Cache-Control', 'public, max-age=31536000')
    
    return fileBuffer
  } catch (error: any) {
    console.error('Error serving file:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Error serving file'
    })
  }
})

