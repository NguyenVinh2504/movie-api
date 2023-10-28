/* eslint-disable no-console */
import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
const Router = express.Router({ mergeParams: true })
Router.route('/signup')
  .post(userValidation.signIn, userController.signIn)

Router.route('/info/:id')
  .get(userController.getInfo)
export const userRoutes = Router