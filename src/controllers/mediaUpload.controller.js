import { StatusCodes } from 'http-status-codes'
import path from 'path'
import { mediaUploadService } from '~/services/mediaUpload.service'
import ApiError from '~/utils/ApiError'
import { UPLOAD_VIDEO_DIR } from '~/utils/constants'
import fs from 'fs'
import mime from 'mime'
import { getMetadata, getStream, ref } from 'firebase/storage'
import { storage } from '~/config/firebase'

const uploadImage = async (req, res) => {
  const result = await mediaUploadService.uploadImage(req)
  return res.status(StatusCodes.CREATED).json({ message: 'Upload image successfully', result })
}

const uploadVideo = async (req, res) => {
  const result = await mediaUploadService.uploadVideo(req)
  return res.status(StatusCodes.CREATED).json({ message: 'Upload video successfully', result })
}

const uploadVideoHls = async (req, res) => {
  const result = await mediaUploadService.uploadVideoHls(req)
  return res.status(StatusCodes.CREATED).json({ message: 'Upload video successfully', result })
}

const serveImage = async (req, res) => {
  const { name } = req.params
  // const filePath = path.resolve(UPLOAD_IMAGE_DIR, name)
  const file = ref(storage, `images/${name}`)
  getStream(file).pipe(res)
  // response.data.pipe(res)
  // res.sendFile(file, (err) => {
  //   if (err) {
  //     next(err)
  //   }
  // })
}

const serveM3u8 = async (req, res) => {
  try {
    const { id } = req.params
    const fileRef = ref(storage, `video-hls/${id}/master.m3u8`)

    // Kiểm tra file có tồn tại không trước khi get stream
    // const [exists] = await getMetadata(fileRef)
    //   .then(() => [true])
    //   .catch(() => [false])

    // if (!exists) {
    //   return res.status(404).send('File not found')
    // }

    const stream = await getStream(fileRef)

    // Xử lý lỗi stream
    stream.on('error', (error) => {
      res.status(500).send('Error streaming file')
    })

    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl') // Content type cho .m3u8
    res.setHeader('Content-Disposition', `attachment; filename=${id}-master.m3u8`)
    stream.pipe(res)

    // const filePath = path.resolve(UPLOAD_VIDEO_DIR, 'test.m3u8')
    // res.sendFile(filePath)
  } catch (error) {
    if (!res.headersSent) {
      if (error.code === 'storage/object-not-found') {
        res.status(404).send('File not found')
      } else {
        res.status(500).send('Error downloading file')
      }
    }
  }
}

const serveSegment = async (req, res) => {
  try {
    const { id, v, segment } = req.params
    const fileRef = ref(storage, `video-hls/${id}/${v}/${segment}`)

    // Kiểm tra file tồn tại
    const [exists] = await getMetadata(fileRef)
      .then(() => [true])
      .catch(() => [false])

    if (!exists) {
      return res.status(404).send('Segment not found')
    }

    const stream = await getStream(fileRef)

    // Set content type phù hợp cho segment file (.ts)
    res.setHeader('Content-Type', 'video/MP2T')

    // Xử lý lỗi stream
    stream.on('error', (error) => {
      if (!res.headersSent) {
        res.status(500).send('Error streaming segment')
      }
    })

    // Stream trực tiếp không cần attachment
    stream.pipe(res)
  } catch (error) {
    if (!res.headersSent) {
      if (error.code === 'storage/object-not-found') {
        res.status(404).send('Segment not found')
      } else {
        res.status(500).send('Error streaming segment')
      }
    }
  }
}

const serveVideoStream = async (req, res) => {
  const { name } = req.params
  const range = req.headers.range
  if (!range) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing Range header')
  }
  const filePath = path.resolve(UPLOAD_VIDEO_DIR, name.split('.')[0], name)
  // 1MB = 10^6 bytes (Tính theo hệ thập phân, đây là giá trị thấy trên UI )
  // 1 MB = 2^20 bytes tính theo hệ thập phân (1024 * 1024)

  //Lấy dung lượng video (Bytes)
  const videoSize = fs.statSync(filePath).size

  // Dung lượng video cho mỗi phân đoạn stream
  const CHUNK_SIZE = 10 ** 6 // 1MB
  // Lấy giá trị byte bắt đầu từ header Range (vd: bytes=1048575-)
  const start = Number(range.replace(/\D/g, ''))
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1)

  // Dung lượng thực tế cho một phân đoạn stream
  // Thường đây là chunks, ngoại trừ đoạn cuối cùng
  const contentLength = end - start + 1
  const contentType = mime.getType(filePath) || 'video/*'
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }

  res.writeHead(StatusCodes.PARTIAL_CONTENT, headers)
  const videoStream = fs.createReadStream(filePath, { start, end })
  videoStream.pipe(res)
}

const videoStatus = async (req, res) => {
  const { id } = req.params
  const result = await mediaUploadService.getVideoStatus(id)
  return res.status(StatusCodes.OK).json({ message: 'Get video status successfully', result })
}

const serveSubtitle = async (req, res) => {
  try {
    const { id, name } = req.params
    const fileRef = ref(storage, `/video-hls/${id}/subtitle/${name}`)

    // Kiểm tra sự tồn tại của file
    const [exists] = await getMetadata(fileRef)
      .then(() => [true])
      .catch(() => [false])

    if (!exists) {
      return res.status(404).send('File not found')
    }

    const stream = await getStream(fileRef)

    // Xác định Content-Type phù hợp
    const contentType = getContentType(name) // Thêm hàm xử lý định dạng file

    // Thiết lập headers QUAN TRỌNG
    res.setHeader('Content-Type', `${contentType}; charset=utf-8`)
    res.setHeader('Content-Disposition', `inline; filename="${name}"`) // Sử dụng "inline" thay vì "attachment"
    res.setHeader('Cache-Control', 'public, max-age=3600') // Tùy chọn cache

    // Xử lý lỗi stream
    stream.on('error', (error) => {
      if (!res.headersSent) {
        res.status(500).send('Error streaming file')
      }
    })

    stream.pipe(res)
  } catch (error) {
    if (!res.headersSent) {
      if (error.code === 'storage/object-not-found') {
        res.status(404).send('File not found')
      } else {
        res.status(500).send('Internal Server Error')
      }
    }
  }
}

// Hỗ trợ xác định Content-Type
function getContentType(filename) {
  const ext = filename.split('.').pop().toLowerCase()
  const typeMap = {
    vtt: 'text/vtt',
    srt: 'text/plain',
    ass: 'text/x-ssa',
    dfxp: 'application/ttml+xml'
  }
  return typeMap[ext] || 'application/octet-stream'
}

export const mediaUploadController = {
  uploadImage,
  serveM3u8,
  serveSegment,
  uploadVideo,
  uploadVideoHls,
  serveImage,
  serveVideoStream,
  videoStatus,
  serveSubtitle
}
