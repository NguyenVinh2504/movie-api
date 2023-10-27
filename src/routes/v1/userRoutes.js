/* eslint-disable no-console */
import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
const Router = express.Router({ mergeParams: true })
Router.post('/', userValidation.signIn, userController.signIn)

export const userRoutes = Router