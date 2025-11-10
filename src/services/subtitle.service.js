import { PutObjectCommand, DeleteObjectCommand, DeleteObjectsCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { r2Client, R2_SUBTITLE_BUCKET } from '~/config/cloudflare-r2.js'
import { randomUUID } from 'crypto'
import ApiError from '~/utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment.js'
import mime from 'mime'

/**
 * Tạo pre-signed URL để upload file phụ đề lên Cloudflare R2
 * @param {string} params.fileName - Tên file phụ đề
 * @returns {Promise<Object>} Object chứa presigned URL và subtitle_link object
 */
const generatePresignedUploadUrl = async ({ fileName, expiresIn = 3600 }) => {
  if (!fileName) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Thiếu thông tin bắt buộc: fileName')
  }

  // Validate file extension
  const allowedExtensions = ['.vtt', '.srt', '.ass', '.ssa', '.dfxp', '.ttml', '.webvtt']
  const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase()

  if (!allowedExtensions.includes(fileExtension)) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Định dạng file không hợp lệ. Chỉ chấp nhận: ${allowedExtensions.join(', ')}`
    )
  }

  // Xác định content type dựa vào extension

  const contentType = mime.getType(fileName) || 'application/octet-stream'

  // Tạo unique ID cho file
  const fileId = randomUUID()

  const key = `${fileId}`

  // Tạo key (path) cho file trong R2
  // Format cho TV: {mediaId}/s{seasonNumber}/e{episodeNumber}/{fileId}_{fileName}
  // Format cho Movie: {mediaId}/{mediaType}/{fileId}_{fileName}
  // let key
  // if (mediaType === 'tv') {
  //   key = `${mediaId}/${mediaType}/s${seasonNumber.toString().padStart(2, '0')}/e${episodeNumber.toString().padStart(2, '0')}/${fileId}_${fileName}`
  // } else {
  //   key = `${mediaId}/${mediaType}/${fileId}_${fileName}`
  // }

  // Tạo command để upload

  const command = new PutObjectCommand({
    Bucket: R2_SUBTITLE_BUCKET,
    Key: key,
    ContentType: contentType
    // Metadata: {
    //   mediaId: mediaId,
    //   mediaType: mediaType,
    //   ...(mediaType === 'tv' && {
    //     seasonNumber: seasonNumber.toString(),
    //     episodeNumber: episodeNumber.toString()
    //   }),
    //   label: label,
    //   originalFileName: fileName,
    //   uploadedAt: new Date().toISOString()
    // }
  })

  try {
    // Tạo pre-signed URL
    const presignedUrl = await getSignedUrl(r2Client, command, {
      expiresIn: expiresIn
    })

    // URL công khai để truy cập file sau khi upload
    const publicUrl = env.R2_PUBLIC_URL ? `${env.R2_PUBLIC_URL}/${key}` : null

    return {
      uploadUrl: presignedUrl, // URL để upload file (dùng PUT method)
      publicUrl // URL công khai để truy cập file sau khi upload thành công
    }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Không thể tạo presigned URL')
  }
}

/**
 * Tạo nhiều pre-signed URLs cho nhiều file phụ đề của cùng một episode/movie
 * @param {Object} params - Thông tin chung về media
 * @param {string} params.mediaId - ID của media
 * @param {string} params.mediaType - Loại media: 'movie' hoặc 'tv'
 * @param {number} params.seasonNumber - Số season (chỉ cho TV show)
 * @param {number} params.episodeNumber - Số episode (chỉ cho TV show)
 * @param {Array} params.subtitles - Mảng các object subtitle
 * @returns {Promise<Array>} Mảng các object chứa presigned URLs
 */
const generateMultiplePresignedUrls = async ({ mediaId, mediaType, seasonNumber, episodeNumber, subtitles }) => {
  if (!Array.isArray(subtitles) || subtitles.length === 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Mảng subtitles không được rỗng')
  }

  // Giới hạn số lượng file upload cùng lúc
  if (subtitles.length > 20) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Tối đa 20 file phụ đề mỗi lần gửi')
  }

  const results = await Promise.all(
    subtitles.map((subtitle) =>
      generatePresignedUploadUrl({
        mediaId,
        mediaType,
        seasonNumber,
        episodeNumber,
        ...subtitle
      })
    )
  )
  return results
}

/**
 * Upload file lên R2 và trả về metadata
 */
const uploadFileToR2 = async ({ file, r2Key }) => {
  try {
    if (!file) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'File là bắt buộc')
    }
    if (!r2Key) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'r2Key là bắt buộc')
    }

    // Determine content type
    const contentType = file.mimetype || 'application/octet-stream'

    // Upload file lên R2
    const uploadCommand = new PutObjectCommand({
      Bucket: R2_SUBTITLE_BUCKET,
      Key: r2Key,
      Body: file.buffer,
      ContentType: contentType
    })

    await r2Client.send(uploadCommand)

    // Generate public URL
    const publicUrl = env.R2_PUBLIC_URL ? `${env.R2_PUBLIC_URL}/${r2Key}` : null

    return {
      r2_key: r2Key,
      url: publicUrl,
      file_name: file.originalname,
      file_size: file.size,
      content_type: contentType
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Không thể upload file: ' + error.message)
  }
}

/**
 * Xóa file từ R2 storage
 */
const deleteFileFromR2 = async (r2Key) => {
  try {
    if (!r2Key) {
      return // Không có r2Key thì không cần xóa
    }

    const deleteCommand = new DeleteObjectCommand({
      Bucket: R2_SUBTITLE_BUCKET,
      Key: r2Key
    })

    await r2Client.send(deleteCommand)
  } catch (error) {
    // Log nhưng không throw (file có thể không tồn tại)
    // eslint-disable-next-line no-console
    console.warn('Lỗi khi xóa file từ R2:', error.message)
  }
}
/**
 * Xóa nhiều file từ R2 theo lô (batch)
 */
const deleteFilesFromR2 = async (keys = []) => {
  try {
    if (!Array.isArray(keys) || keys.length === 0) return
    const chunkSize = 1000
    for (let i = 0; i < keys.length; i += chunkSize) {
      const chunk = keys.slice(i, i + chunkSize)
      const command = new DeleteObjectsCommand({
        Bucket: R2_SUBTITLE_BUCKET,
        Delete: { Objects: chunk.map((Key) => ({ Key })) }
      })
      await r2Client.send(command)
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Lỗi khi batch delete R2:', error.message)
  }
}

/**
 * Đọc file subtitle từ R2 bằng r2_key
 * @param {string} r2Key - Key của file trong R2
 * @returns {Promise<Object>} Object chứa stream và metadata của file
 */
const getSubtitleFromR2 = async (r2Key) => {
  // eslint-disable-next-line no-useless-catch
  try {
    if (!r2Key) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'r2_key là bắt buộc')
    }

    const command = new GetObjectCommand({
      Bucket: R2_SUBTITLE_BUCKET,
      Key: r2Key
    })

    const response = await r2Client.send(command)

    const contentType = response.ContentType || mime.getType(r2Key) || 'text/vtt'

    const contentLength = response.ContentLength || 0

    return {
      bodyStream: response.Body,
      contentType: `${contentType}; charset=utf-8`,
      contentLength,
      lastModified: response.LastModified,
      etag: response.ETag
    }
  } catch (error) {
    if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy file subtitle với r2_key này')
    }
    throw error
  }
}

export const subtitleService = {
  generatePresignedUploadUrl,
  generateMultiplePresignedUrls,
  uploadFileToR2,
  deleteFileFromR2,
  deleteFilesFromR2,
  getSubtitleFromR2
}
