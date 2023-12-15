import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userRoutes } from './userRoutes.js'
import { authRoutes } from './authRoutes.js'
import { mediaRoute } from './media.route.js'
const Router = express.Router({ mergeParams: true })

// Check api v1
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'Apis V1 are ready to use' })
})

// User APIs
Router.use('/user', userRoutes)
Router.use('/auth', authRoutes)

Router.use('/:mediaType', mediaRoute)

export default Router