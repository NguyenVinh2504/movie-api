import multer from 'multer'
import ApiError from './ApiError'
import { StatusCodes } from 'http-status-codes'
import { ALLOW_COMMON_FILE_TYPES, LIMIT_COMMON_FILE_SIZE } from './validators'
export const uploadMulter = multer({
  limits: {
    fieldSize: LIMIT_COMMON_FILE_SIZE
  },
  storage: multer.memoryStorage(),
  fileFilter(req, file, cb) {
    // Nếu validate lỗi thì sẽ vào đây
    if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
      // Truyền lỗi vào đối số cb của multer để ném ra lỗi
      return cb(new ApiError(StatusCodes.BAD_REQUEST, 'Please upload a Image'), false)
    }
    // Còn không thì truyền null với true là validate thành công
    cb(null, true)
  }
})
export const videoUploadMulter = multer({
  storage: multer.memoryStorage(),
  limits: {
    // fileSize: 10000000, // 10000000 Bytes = 10 MB,
    files: 1
  },
  fileFilter(req, file, cb) {
    if (!(file.mimetype === 'video/mp4' || file.mimetype === 'video/quicktime')) {
      // upload only mp4 and mkv format
      return cb(new ApiError(StatusCodes.BAD_REQUEST, 'Please upload a Video MP4 or Quicktime'), false)
    }
    cb(undefined, true)
  }
})
