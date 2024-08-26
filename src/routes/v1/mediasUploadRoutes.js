import express from 'express'
import { mediaUploadController } from '~/controllers/mediaUpload.controller'

const Router = express.Router()

Router.post('/upload-image', mediaUploadController.uploadImage)

export const mediasUploadRoutes = Router