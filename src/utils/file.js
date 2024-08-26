import formidable from 'formidable'
import fs from 'fs'
import ApiError from './ApiError'
import { StatusCodes } from 'http-status-codes'
import { UPLOAD_TEMP_DIR } from './constants'

export const initFolder = () => {
  if (!fs.existsSync(UPLOAD_TEMP_DIR)) {
    fs.mkdirSync(UPLOAD_TEMP_DIR, {
      recursive: true // Tạo folder lồng nhau
    })
  }
}

export const handleUploadImage = (req) => {
  const form = formidable({
    uploadDir: UPLOAD_TEMP_DIR,
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

export const getNameFromFullName = (fullName) => {
  const name = fullName.split('.')
  name.pop()
  return name.join('')
}