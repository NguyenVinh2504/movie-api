import express from 'express'
import { mediaUploadController } from '~/controllers/mediaUpload.controller'
import wrapRequestHandler from '~/utils/wrapRequestHandler'
const Router = express.Router()

Router.get('/image/:name', wrapRequestHandler(mediaUploadController.serveImage))
Router.get('/video-stream/:name', wrapRequestHandler(mediaUploadController.serveVideoStream))
Router.get('/video-hls/:id/master.m3u8', wrapRequestHandler(mediaUploadController.serveM3u8))
Router.get('/video-hls/:id/:v/:segment', wrapRequestHandler(mediaUploadController.serveSegment))
Router.get('/subtitle/:id/:name', wrapRequestHandler(mediaUploadController.serveSubtitle))
export const staticRoute = Router
