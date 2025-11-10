import { StatusCodes } from 'http-status-codes'
import { subtitleService } from '~/services/subtitle.service.js'

/**
 * Tạo pre-signed URL cho một file phụ đề
 * POST /api/v1/admin/subtitle/presigned-url
 * Body: {
 *   mediaId: string,
 *   mediaType: 'movie' | 'tv',
 *   seasonNumber?: number (required for TV),
 *   episodeNumber?: number (required for TV),
 *   fileName: string,
 *   label: string,
 *   expiresIn?: number
 * }
 */
const getPresignedUrl = async (req, res) => {
  // const { mediaId, mediaType, seasonNumber, episodeNumber, fileName, label, expiresIn } = req.body

  // const result = await subtitleService.generatePresignedUploadUrl({
  //   mediaId,
  //   mediaType,
  //   seasonNumber,
  //   episodeNumber,
  //   fileName,
  //   label,
  //   expiresIn
  // })
  const { fileName } = req.body

  const result = await subtitleService.generatePresignedUploadUrl({
    fileName
  })

  return res.status(StatusCodes.OK).json({
    message: 'Tạo presigned URL thành công',
    data: result
  })
}

/**
 * Tạo nhiều pre-signed URLs cho nhiều file phụ đề
 * POST /api/v1/admin/subtitle/presigned-urls
 * Body: {
 *   mediaId: string,
 *   mediaType: 'movie' | 'tv',
 *   seasonNumber?: number (required for TV),
 *   episodeNumber?: number (required for TV),
 *   subtitles: [{
 *     fileName: string,
 *     label: string,
 *     expiresIn?: number
 *   }]
 * }
 */
const getMultiplePresignedUrls = async (req, res) => {
  const { mediaId, mediaType, seasonNumber, episodeNumber, subtitles } = req.body

  const results = await subtitleService.generateMultiplePresignedUrls({
    mediaId,
    mediaType,
    seasonNumber,
    episodeNumber,
    subtitles
  })

  return res.status(StatusCodes.OK).json({
    message: `Tạo thành công ${results.length} presigned URLs`,
    data: results
  })
}

/**
 * Đọc file subtitle từ R2 và stream về client
 * POST /api/v1/subtitle
 * Body: {
 *   r2_key: string (required),
 *   mediaType?: 'movie' | 'episode' (optional),
 *   mediaId?: string (optional)
 * }
 */
const getSubtitle = async (req, res, next) => {
  try {
    const { r2_key } = req.query

    // Gọi service để lấy file từ R2
    const fileData = await subtitleService.getSubtitleFromR2(r2_key)

    // Set proper headers
    res.setHeader('Content-Type', fileData.contentType)
    res.setHeader('Content-Length', fileData.contentLength)
    res.setHeader('Content-Disposition', `inline; filename="${r2_key.split('/').pop()}"`)
    res.setHeader('Cache-Control', 'public, max-age=3600') // Cache 1 hour
    if (fileData.etag) {
      res.setHeader('ETag', fileData.etag)
    }
    if (fileData.lastModified) {
      res.setHeader('Last-Modified', fileData.lastModified.toUTCString())
    }

    fileData.bodyStream.pipe(res)

    fileData.bodyStream.on('error', (error) => {
      next(error)
    })
  } catch (error) {
    next(error)
  }
}

export const subtitleController = {
  getPresignedUrl,
  getMultiplePresignedUrls,
  getSubtitle
}
