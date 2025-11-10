import { slugify } from '~/utils/formatters'

/**
 * Sanitize file name để phù hợp với R2 storage
 * Loại bỏ ký tự đặc biệt, thay spaces bằng underscores
 */
export const sanitizeFileName = (fileName) => {
  // Lấy extension
  const lastDotIndex = fileName.lastIndexOf('.')
  const nameWithoutExt = lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName
  const extension = lastDotIndex > 0 ? fileName.substring(lastDotIndex) : ''

  // Sử dụng slugify
  const sanitized = slugify(nameWithoutExt) // Giới hạn độ dài

  return sanitized + extension.toLowerCase()
}
