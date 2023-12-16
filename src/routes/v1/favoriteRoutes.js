/* eslint-disable no-console */
import express from 'express'
import { favoriteController } from '~/controllers/favoriteController'
import tokenMiddleware from '~/middlewares/token.middleware'
import { favoriteValidation } from '~/validations/favoriteValidation'
const Router = express.Router({ mergeParams: true })
// /user/delete
Router.route('/')
  .post(tokenMiddleware.auth, favoriteValidation.createFavorite, favoriteController.addFavorite)

Router.route('/:id')
  .delete(tokenMiddleware.auth, favoriteValidation.deleteFavorite, favoriteController.removeFavorite)
export const favoriteRoutes = Router