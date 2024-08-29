/* eslint-disable no-console */
import sharp from 'sharp'
import { EncodingStatus, UPLOAD_IMAGE_DIR } from '~/utils/constants'
import { getNameFromFullName, handleUploadImage, handleUploadVideo } from '~/utils/file'
import { env } from '~/config/environment'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video.js'
import fsPromises from 'fs/promises'
import fs from 'fs'
import { mediaModel } from '~/models/mediaModel'

class Queue {
  #listItem = []
  #isEncoding = false
  constructor() {}
  async enqueue(item) {
    this.#listItem.push(item)
    const fileName = item.split('\\').pop()
    const idName = getNameFromFullName(fileName)
    await mediaModel
      .createVideoStatus({ name: idName, status: EncodingStatus.pending })
      .catch((err) => console.error('createVideoStatus error: ', err))
    this.processEncode()
  }

  async processEncode() {
    if (this.#isEncoding) return
    if (this.#listItem.length > 0) {
      this.#isEncoding = true
      const videoPath = this.#listItem[0]
      const fileName = videoPath.split('\\').pop()
      const idName = getNameFromFullName(fileName)
      await mediaModel.updateVideoStatus({ name: idName, status: EncodingStatus.processing })
      try {
        await encodeHLSWithMultipleVideoStreams(videoPath)
        await fsPromises.unlink(videoPath)
        await mediaModel.updateVideoStatus({ name: idName, status: EncodingStatus.success })

        console.log('encode success')
      } catch (error) {
        console.error(`encode error: ${videoPath}`)

        await mediaModel
          .updateVideoStatus({ name: idName, status: EncodingStatus.failed })
          .catch((err) => console.error('updateVideoStatus error: ', err))

        console.error(error)
      }
      this.#isEncoding = false
      this.#listItem.shift()
      this.processEncode()
    } else {
      console.log('queue is empty')
    }
  }
}

const queue = new Queue()
const uploadImage = async (req) => {
  const files = await handleUploadImage(req)
  // const newName = getNameFromFullName(file?.newFilename)
  // const newPath = `${UPLOAD_IMAGE_DIR}/${newName}.jpg`

  const result = await Promise.all(
    files.map(async (file) => {
      const newPath = `${UPLOAD_IMAGE_DIR}/${file?.newFilename}`
      await sharp(file.filepath).resize({ width: 400, withoutEnlargement: true }).toFile(newPath)
      try {
        fs.unlinkSync(file.filepath)
      } catch (error) {
        // console.log(error)
      }
      return {
        name: file?.newFilename,
        type: file?.mimetype,
        url:
          env.BUILD_MODE === 'production'
            ? `${env.PRODUCT_APP_HOST}/files/image/${file?.newFilename}`
            : `http://localhost:${env.LOCAL_DEV_APP_PORT}/api/v1/files/image/${file?.newFilename}`
      }
    })
  )

  return result
}

const uploadVideo = async (req) => {
  const files = await handleUploadVideo(req)
  const result = files.map((file) => {
    return {
      name: file?.newFilename,
      type: file?.mimetype,
      url:
        env.BUILD_MODE === 'production'
          ? `${env.PRODUCT_APP_HOST}/files/video/${file?.newFilename}`
          : `http://localhost:${env.LOCAL_DEV_APP_PORT}/api/v1/files/video/${file?.newFilename}`
    }
  })
  return result
}

const uploadVideoHls = async (req) => {
  const files = await handleUploadVideo(req)
  const result = await Promise.all(
    files.map(async (file) => {
      // console.log('file.filepath', file)
      const newName = getNameFromFullName(file?.newFilename)
      queue.enqueue(file.filepath)
      return {
        name: file?.newName,
        type: 'video/m3u8',
        url:
          env.BUILD_MODE === 'production'
            ? `${env.PRODUCT_APP_HOST}/files/video-hls/${newName}.m3u8`
            : `http://localhost:${env.LOCAL_DEV_APP_PORT}/api/v1/files/video-hls/${newName}.m3u8`
      }
    })
  )
  return result
}

const getVideoStatus = async (idName) => {
  const videoStatus = await mediaModel.getVideoStatus(idName)
  return videoStatus
}

export const mediaUploadService = {
  uploadImage,
  uploadVideo,
  uploadVideoHls,
  getVideoStatus
}
