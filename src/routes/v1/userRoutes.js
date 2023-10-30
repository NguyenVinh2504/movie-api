/* eslint-disable no-console */
import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
import tokenMiddleware from '~/middlewares/token.middleware'
const Router = express.Router({ mergeParams: true })
Router.route('/signup')
  .post(userValidation.signIn, userController.signIn)

Router.route('/login')
  .post(userController.login)

Router.route('/info')
  .get(tokenMiddleware.auth, userController.getInfo)
export const userRoutes = Router