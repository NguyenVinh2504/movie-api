import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/utils/constants'
import { handleUploadImage, handleUploadVideo } from '~/utils/file'
import fs from 'fs'
import { env } from '~/config/environment'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'

const uploadImage = async (req) => {
  const files = await handleUploadImage(req)
  // const newName = getNameFromFullName(file?.newFilename)
  // const newPath = `${UPLOAD_IMAGE_DIR}/${newName}.jpg`
  const result = await Promise.all(files.map(async (file) => {
    const newPath = `${UPLOAD_IMAGE_DIR}/${file?.newFilename}`
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

const uploadVideo = async (req) => {
  const files = await handleUploadVideo(req)
  const result = files.map((file) => {
    return {
      name: file?.newFilename,
      type: file?.mimetype,
      url: env.BUILD_MODE === 'production' ? `${env.PRODUCT_APP_HOST}/files/video/${file?.newFilename}`: `http://localhost:${env.LOCAL_DEV_APP_PORT}/api/v1/files/video/${file?.newFilename}`
    }
  })
  return result
}

const uploadVideoHls = async (req) => {
  const files = await handleUploadVideo(req)
  console.log('files', files)
  const result = await Promise.all(files.map( async (file) => {
    await encodeHLSWithMultipleVideoStreams(file.filepath)
    return {
      name: file?.newFilename,
      type: file?.mimetype,
      url: env.BUILD_MODE === 'production' ? `${env.PRODUCT_APP_HOST}/files/video/${file?.newFilename}`: `http://localhost:${env.LOCAL_DEV_APP_PORT}/api/v1/files/video/${file?.newFilename}`
    }
  }))
  return result
}

export const mediaUploadService = {
  uploadImage,
  uploadVideo,
  uploadVideoHls
}