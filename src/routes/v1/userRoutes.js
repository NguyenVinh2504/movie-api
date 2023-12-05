/* eslint-disable no-console */
import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
import tokenMiddleware from '~/middlewares/token.middleware'
import multer from 'multer'
const upload = multer({ storage: multer.memoryStorage() })
const Router = express.Router({ mergeParams: true })
// /user/delete
Router.route('/delete')
  .patch(tokenMiddleware.auth, userValidation.deleteUser, userController.deleteUser)

// /user/update-password
Router.route('/update-password')
  .patch(tokenMiddleware.auth, userValidation.updatePassword, userController.updatePassword)
// /user/update-profile
Router.route('/update-profile')
  .post(tokenMiddleware.auth, upload.single('imageAvatar'), userValidation.updateProfile, userController.updateProfile)
// /user/info
Router.route('/info')
  .get(tokenMiddleware.auth, userController.getInfo)
export const userRoutes = Router