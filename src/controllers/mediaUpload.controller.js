
import { StatusCodes } from 'http-status-codes'
import path from 'path'
import { mediaUploadService } from '~/services/mediaUpload.service'
import { UPLOAD_DIR } from '~/utils/constants'

const uploadImage = async (req, res, next) => {
  try {
    const result = await mediaUploadService.uploadImage(req)
    return res.status(StatusCodes.CREATED).json({ result })
  } catch (error) {
    next(error)
  }

}

const serveImage = (req, res, next) => {
  try {
    const { name } = req.params
    const filePath = path.resolve(UPLOAD_DIR, name)
    res.sendFile(filePath, (err) => {
      if (err) {
        next(err)
      }
    })
  } catch (error) {
    next(error)
  }
}


export const mediaUploadController = {
  uploadImage,
  serveImage
}