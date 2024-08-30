import multer from 'multer'
import ApiError from './ApiError'
import { StatusCodes } from 'http-status-codes'
export const uploadMulter = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, cb) {
    if (!file.mimetype.includes('image/')) {
      // upload only mp4 and mkv format
      return cb(new ApiError(StatusCodes.BAD_REQUEST, 'Please upload a Image'), false)
    }
    cb(undefined, true)
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
