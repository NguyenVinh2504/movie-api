import express from 'express'
import { authValidation } from '~/validations/authValidation'
import { authController } from '~/controllers/authController'
import tokenMiddleware from '~/middlewares/token.middleware'
const Router = express.Router({ mergeParams: true })
Router.route('/signup').post(authValidation.signUp, authController.signUp)

Router.route('/google-login')
  // .post(authValidation.signUp, authController.loginGoogle)
  .get(authController.loginGoogle)

Router.route('/login').post(authValidation.login, authController.login)

Router.route('/refresh-token').post(tokenMiddleware.refreshTokenDecode, authController.refreshToken)
Router.route('/logout').post(tokenMiddleware.auth, authController.logout)
export const authRoutes = Router
