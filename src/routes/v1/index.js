import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userRoutes } from './userRoutes.js'
import { authRoutes } from './authRoutes.js'
import { mediaRoute } from './media.route.js'
import { favoriteRoutes } from './favoriteRoutes.js'
import { mediasUploadRoutes } from './mediasUploadRoutes.js'
import { staticRoute } from './static.routes.js'
import { UPLOAD_VIDEO_TEMP_DIR } from '~/utils/constants.js'
import { commentRoutes } from './commentRoute.js'
import { videoRoute } from './video.route.js'
const Router = express.Router({ mergeParams: true })

// Check api v1
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'Apis V1 are ready to use' })
})

// User APIs
Router.use('/user', userRoutes)
Router.use('/favorite', favoriteRoutes)
Router.use('/auth', authRoutes)

Router.use('/files', staticRoute)
Router.use('/files/video', express.static(UPLOAD_VIDEO_TEMP_DIR))

Router.use('/medias-upload', mediasUploadRoutes)

Router.use('/comment', commentRoutes)
Router.use('/media', mediaRoute)

Router.use('/get-video', videoRoute)

export default Router
