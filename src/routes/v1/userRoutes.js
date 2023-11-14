/* eslint-disable no-console */
import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
import tokenMiddleware from '~/middlewares/token.middleware'
const Router = express.Router({ mergeParams: true })

Router.route('/delete')
  .delete(tokenMiddleware.auth, userValidation.deleteUser, userController.deleteUser)

Router.route('/update-password')
  .put(tokenMiddleware.auth, userValidation.updatePassword, userController.updatePassword)

Router.route('/update-profile')
  .put(tokenMiddleware.auth, userValidation.updateProfile, userController.updateProfile)

Router.route('/info')
  .get(tokenMiddleware.auth, userController.getInfo)
export const userRoutes = Router