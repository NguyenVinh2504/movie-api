import express from 'express'
import { mediaUploadController } from '~/controllers/mediaUpload.controller'
import { uploadMulter } from '~/utils/multerFile'
import wrapRequestHandler from '~/utils/wrapRequestHandler'

const Router = express.Router()

Router.post('/upload-image', uploadMulter.array('image'), wrapRequestHandler(mediaUploadController.uploadImage))
Router.post('/upload-video', wrapRequestHandler(mediaUploadController.uploadVideo))
Router.post('/upload-video-hls', wrapRequestHandler(mediaUploadController.uploadVideoHls))
Router.get('/video-status/:id', wrapRequestHandler(mediaUploadController.videoStatus))

export const mediasUploadRoutes = Router
