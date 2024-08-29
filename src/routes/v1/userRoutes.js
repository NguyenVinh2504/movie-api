/* eslint-disable no-console */
import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
import tokenMiddleware from '~/middlewares/token.middleware'
import { uploadMulter } from '~/utils/multerFile'

const Router = express.Router({ mergeParams: true })
// /user/delete
Router.route('/delete').patch(tokenMiddleware.auth, userValidation.deleteUser, userController.deleteUser)

// /user/update-password
Router.route('/update-password').patch(
  tokenMiddleware.auth,
  userValidation.updatePassword,
  userController.updatePassword
)
// /user/update-profile
Router.route('/update-profile').post(
  tokenMiddleware.auth,
  uploadMulter.single('imageAvatar'),
  userValidation.updateProfile,
  userController.updateProfile
)
// /user/info
Router.route('/info').get(tokenMiddleware.auth, userController.getInfo)
Router.route('/check-email').post(userValidation.sendGmail, userController.checkEmail)
Router.route('/send-email').post(userValidation.sendGmail, userController.sendEmail)
Router.route('/forgot-password').post(userValidation.forgotPassword, userController.forgotPassword)
export const userRoutes = Router
