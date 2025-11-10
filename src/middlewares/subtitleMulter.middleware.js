import { StatusCodes } from 'http-status-codes'
import multer from 'multer'
import ApiError from '~/utils/ApiError'
import { ALLOWED_SUBTITLE_MIME_TYPES, LIMIT_SUBTITLE_FILE_SIZE } from '~/utils/validators'

const customFilter = (req, file, cb) => {
  if (!ALLOWED_SUBTITLE_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new ApiError(
        StatusCodes.BAD_REQUEST,
        `Định dạng file không hợp lệ. Chỉ chấp nhận: ${ALLOWED_SUBTITLE_MIME_TYPES.join(', ')}`
      ),
      false
    )
  }

  cb(null, true)
}

export const subtitleMulterMiddleware = multer({
  limits: {
    fileSize: LIMIT_SUBTITLE_FILE_SIZE, // 500KB
    files: 1
  },
  fileFilter: customFilter
})
