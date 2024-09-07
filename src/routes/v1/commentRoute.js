/* eslint-disable no-console */
import express from 'express'
import { commentController } from '~/controllers/commentController'
import tokenMiddleware from '~/middlewares/token.middleware'
import wrapRequestHandler from '~/utils/wrapRequestHandler'
import { commentValidation } from '~/validations/commentValidation'
const Router = express.Router({ mergeParams: true })
// /user/delete
Router.route('/add-comment').post(
  tokenMiddleware.auth,
  commentValidation.addComment,
  wrapRequestHandler(commentController.addComment)
)

Router.route('/get-comment/:movieType/:movieId').get(wrapRequestHandler(commentController.getCommentsByMovieId))
export const commentRoutes = Router
