import express from 'express'
import { mediaUploadController } from '~/controllers/mediaUpload.controller'
import wrapRequestHandler from '~/utils/wrapRequestHandler'

const Router = express.Router()

Router.post('/upload-image', wrapRequestHandler( mediaUploadController.uploadImage))
Router.post('/upload-video', wrapRequestHandler(mediaUploadController.uploadVideo))
Router.post('/upload-video-hls', wrapRequestHandler(mediaUploadController.uploadVideoHls))

export const mediasUploadRoutes = Router