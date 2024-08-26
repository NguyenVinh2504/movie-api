import path from 'path'

export const WHITELIST_DOMAINS = [
  'https://viejoy.vercel.app',
  'http://localhost:3000',
  'https://viejoy.site',
  'https://www.viejoy.site'
]

export const UPLOAD_TEMP_DIR = path.resolve(process.cwd(), 'uploads/temp')

export const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads')
export const timeExpired = '1h'