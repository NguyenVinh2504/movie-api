import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userRoutes } from './userRoutes.js'
const Router = express.Router()

// Check api v1
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'Apis V1 are ready to use' })
})

// User APIs
Router.use('/user', userRoutes)

export const API_V1 = Router