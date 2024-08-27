import express from 'express'
import { mediaUploadController } from '~/controllers/mediaUpload.controller'
import wrapRequestHandler from '~/utils/wrapRequestHandler'
const Router = express.Router()

Router.get('/image/:name', wrapRequestHandler( mediaUploadController.serveImage))
Router.get('/video-stream/:name', wrapRequestHandler( mediaUploadController.serveVideoStream))
export const staticRoute = Router