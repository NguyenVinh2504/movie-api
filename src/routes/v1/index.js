import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userRoutes } from './userRoutes.js'
import { authRoutes } from './authRoutes.js'
const Router = express.Router()

// Check api v1
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'Apis V1 are ready to use' })
})

// User APIs
Router.use('/user', userRoutes)
Router.use('/auth', authRoutes)

export const API_V1 = Router