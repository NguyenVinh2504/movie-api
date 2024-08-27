import formidable from 'formidable'
import fs from 'fs'
import ApiError from './ApiError'
import { StatusCodes } from 'http-status-codes'
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR } from './constants'

export const initFolder = () => {
  try {
    [UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR].forEach((dir) => { 
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
          recursive: true // Tạo folder lồng nhau
        })
      }
    })
  } catch {
    // console.log(error)
  }
}

export const handleUploadImage = (req) => {
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    // maxFiles: 4,
    keepExtensions: true,
    // maxFileSize: 1 * 1024 * 1024, // 1MB,
    filter: function({ name, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error', new ApiError(StatusCodes.BAD_REQUEST, 'Invalid file type'))
      }
      return valid
    }
  })

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      // console.log('fields', fields)
      // console.log('files', files)

      if (err) {
        return reject(err)
      }
      if (Object.keys(files).length === 0) {
        return reject(new ApiError(StatusCodes.BAD_REQUEST, 'File is empty'))
      }
      return resolve(files.image)
    })
  })
}

export const handleUploadVideo = (req) => {
  const form = formidable({
    uploadDir: UPLOAD_VIDEO_TEMP_DIR,
    maxFiles: 1,
    keepExtensions: true,
    // maxFileSize: 1 * 1024 * 1024, // 1MB,

    // Filter file type nếu trả về true thì pass
    filter: function({ name, mimetype }) {
      const valid = name === 'video' && Boolean(mimetype?.includes('mp4') || mimetype?.includes('quicktime'))
      if (!valid) {
        form.emit('error', new ApiError(StatusCodes.BAD_REQUEST, 'Invalid file type'))
      }
      return valid
    }
  })

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      // console.log('fields', fields)
      // console.log('files', files)

      if (err) {
        return reject(err)
      }
      if (Object.keys(files).length === 0) {
        return reject(new ApiError(StatusCodes.BAD_REQUEST, 'File is empty'))
      }
      return resolve(files.video)
    })
  })
}

export const getNameFromFullName = (fullName) => {
  const name = fullName.split('.')
  name.pop()
  return name.join('')
}