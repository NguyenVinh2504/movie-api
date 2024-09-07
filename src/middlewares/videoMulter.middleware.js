import { StatusCodes } from 'http-status-codes'
import multer from 'multer'
import ApiError from '~/utils/ApiError'

const { videoUploadMulter, uploadMulter } = require('~/utils/multerFile')
export const imageMulterMiddleware = (req, res, next) => {
  const arrayImage = uploadMulter.array('image')
  arrayImage(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, err.message))
      }
      return next(err)
    }
    // Kiểm tra nếu không có file nào được tải lên
    if (!req.files) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, 'Không có file nào được tải lên!'))
    }
    return next()
  })
}

export const videoMulterMiddleware = (req, res, next) => {
  const singleVideo = videoUploadMulter.single('video')
  singleVideo(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, err.message))
      }
      return next(err)
    }
    // Kiểm tra nếu không có file nào được tải lên
    if (!req.file) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, 'Không có file nào được tải lên!'))
    }
    return next()
  })
}
