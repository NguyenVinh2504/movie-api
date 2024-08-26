import express from 'express'
import { mediaUploadController } from '~/controllers/mediaUpload.controller'
const Router = express.Router()

Router.get('/image/:name', mediaUploadController.serveImage)
export const staticRoute = Router