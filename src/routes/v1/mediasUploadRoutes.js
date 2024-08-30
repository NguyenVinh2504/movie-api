import express from 'express'
import { mediaUploadController } from '~/controllers/mediaUpload.controller'
import { imageMulterMiddleware, videoMulterMiddleware } from '~/middlewares/videoMulter.middleware'
import wrapRequestHandler from '~/utils/wrapRequestHandler'

const Router = express.Router()

Router.post('/upload-image', imageMulterMiddleware, wrapRequestHandler(mediaUploadController.uploadImage))
Router.post('/upload-video', videoMulterMiddleware, wrapRequestHandler(mediaUploadController.uploadVideo))
Router.post('/upload-video-hls', wrapRequestHandler(mediaUploadController.uploadVideoHls))
Router.get('/video-status/:id', wrapRequestHandler(mediaUploadController.videoStatus))

export const mediasUploadRoutes = Router
