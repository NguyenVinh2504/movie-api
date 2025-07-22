import path from 'path'

export const WHITELIST_DOMAINS = [
  'https://viejoy.vercel.app',
  'http://localhost:3000',
  'https://viejoy.site',
  'https://www.viejoy.site',
  'https://viejoy.io.vn',
  'http://localhost:5173',
  'https://admin.viejoy.io.vn'
]

export const UPLOAD_IMAGE_TEMP_DIR = path.resolve('uploads/images/temp')

export const UPLOAD_IMAGE_DIR = path.resolve('uploads/images')

export const UPLOAD_VIDEO_TEMP_DIR = path.resolve('uploads/videos/temp')

export const UPLOAD_VIDEO_DIR = path.resolve('uploads/videos')

export const timeExpired = '1h'

export const EncodingStatus = {
  pending: 'pending',
  processing: 'processing',
  success: 'success',
  failed: 'failed'
}
