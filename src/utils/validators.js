export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/
export const OBJECT_ID_RULE_MESSAGE = 'Chuỗi của bạn không khớp với mẫu Id đối tượng!'

export const ALLOW_COMMON_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg']
export const LIMIT_COMMON_FILE_SIZE = 10 * 1024 * 1024 // 10MB;

export const ALLOWED_SUBTITLE_MIME_TYPES = [
  'text/vtt',
  'text/plain',
  'text/x-ssa',
  'application/ttml+xml',
  'application/octet-stream'
]
export const LIMIT_SUBTITLE_FILE_SIZE = 500 * 1024 // 500KB
