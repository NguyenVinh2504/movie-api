import { StatusCodes } from 'http-status-codes'
import path from 'path'
import { mediaUploadService } from '~/services/mediaUpload.service'
import ApiError from '~/utils/ApiError'
import { UPLOAD_VIDEO_DIR } from '~/utils/constants'
import fs from 'fs'
import mime from 'mime'
import { getDownloadURL, ref } from 'firebase/storage'
import { storage } from '~/config/firebase'
import axios from 'axios'

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
  const url = await getDownloadURL(file)
  const response = await axios.get(url, { responseType: 'stream' })
  response.data.pipe(res)
  // res.sendFile(file, (err) => {
  //   if (err) {
  //     next(err)
  //   }
  // })
}

const serveM3u8 = (req, res) => {
  const { id } = req.params
  const filePath = path.resolve(UPLOAD_VIDEO_DIR, id, 'master.m3u8')
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Not found', err: err.message })
    }
  })
}

const serveSegment = (req, res) => {
  const { id, v, segment } = req.params
  const filePath = path.resolve(UPLOAD_VIDEO_DIR, id, v, segment)
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Not found', err: err.message })
    }
  })
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

export const mediaUploadController = {
  uploadImage,
  serveM3u8,
  serveSegment,
  uploadVideo,
  uploadVideoHls,
  serveImage,
  serveVideoStream,
  videoStatus
}
