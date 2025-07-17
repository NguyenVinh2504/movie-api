import express from 'express'
import { adminController } from '~/controllers/adminController'
import { adminValidation } from '~/validations/adminValidation'
import tokenMiddleware from '~/middlewares/token.middleware'
import { isAdmin } from '~/middlewares/isAdmin'
const Router = express.Router({ mergeParams: true })

/* --- Movie Routes --- */
Router.route('/movies')
  .post(tokenMiddleware.auth, isAdmin, adminValidation.createMovie, adminController.createMovie) // POST: Đăng một movie mới
  .get(tokenMiddleware.auth, isAdmin, adminValidation.paginationValidation, adminController.getMovieList) // GET: Lấy danh sách các movie

Router.route('/movies/:mediaId')
  .get(tokenMiddleware.auth, isAdmin, adminController.getMediaById) // GET: Lấy thông tin movie theo ID
  .put(tokenMiddleware.auth, isAdmin, adminValidation.updateMovie, adminController.updateMovie) // PUT: Cập nhật thông tin movie theo ID
  .delete(tokenMiddleware.auth, isAdmin, adminController.deleteMedia) // DELETE: Xóa movie theo ID

/* --- TvShow Routes --- */
Router.route('/tv-shows')
  .post(tokenMiddleware.auth, isAdmin, adminValidation.createTvShow, adminController.createTvShow) // POST: Đăng một tv show mới
  .get(tokenMiddleware.auth, isAdmin, adminValidation.paginationValidation, adminController.getTvShowList) // GET: Lấy danh sách các tv show

Router.route('/tv-shows/:mediaId')
  .get(tokenMiddleware.auth, isAdmin, adminController.getMediaById) // GET: Lấy thông tin tv show theo ID
  .put(tokenMiddleware.auth, isAdmin, adminValidation.updateTvShow, adminController.updateTvShow) // PUT: Cập nhật thông tin tv show theo ID
  .delete(tokenMiddleware.auth, isAdmin, adminController.deleteMedia) // DELETE: Xóa tv show theo ID

export const adminRoute = Router
