/* eslint-disable no-console */
import express from 'express'
import { favoriteController } from '~/controllers/favoriteController'
import tokenMiddleware from '~/middlewares/token.middleware'
import { favoriteValidation } from '~/validations/favoriteValidation'
const Router = express.Router({ mergeParams: true })
// /user/delete
Router.route('/')
  .post(tokenMiddleware.auth, favoriteValidation.createFavorite, favoriteController.addFavorite)
export const favoriteRoutes = Router