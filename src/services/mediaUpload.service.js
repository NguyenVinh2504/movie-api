import sharp from 'sharp'
import { UPLOAD_DIR } from '~/utils/constants'
import { handleUploadImage } from '~/utils/file'
import fs from 'fs'
import { env } from '~/config/environment'

const uploadImage = async (req) => {
  const files = await handleUploadImage(req)
  // const newName = getNameFromFullName(file?.newFilename)
  // const newPath = `${UPLOAD_DIR}/${newName}.jpg`
  const result = await Promise.all(files.map(async (file) => {
    const newPath = `${UPLOAD_DIR}/${file?.newFilename}`
    await sharp(file.filepath).resize({ width: 400, withoutEnlargement: true }).toFile(newPath )
    try {
      fs.unlinkSync(file.filepath)
    } catch (error) {
      // console.log(error)
    }
    return {
      name: file?.newFilename,
      type: file?.mimetype,
      url: env.BUILD_MODE === 'production' ? `${env.PRODUCT_APP_HOST}/files/image/${file?.newFilename}`: `http://localhost:${env.LOCAL_DEV_APP_PORT}/api/v1/files/image/${file?.newFilename}`
    }
  }))

  return result
}

export const mediaUploadService = {
  uploadImage
}