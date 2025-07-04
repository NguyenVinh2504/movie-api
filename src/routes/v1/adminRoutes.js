import express from 'express'
import { adminController } from '~/controllers/adminController'
import { adminValidation } from '~/validations/adminValidation'

const Router = express.Router({ mergeParams: true })

/* --- Movie Routes --- */
Router.route('/movies')
  .post(adminValidation.createMovie, adminController.createMovie) // POST: Đăng một movie mới
  .get(adminValidation.paginationValidation, adminController.getMovieList) // GET: Lấy danh sách các movie

Router.route('/movies/:mediaId')
  .get(adminController.getMediaById) // GET: Lấy thông tin movie theo ID
  .put(adminValidation.updateMovie, adminController.updateMovie) // PUT: Cập nhật thông tin movie theo ID
  .delete(adminController.deleteMedia) // DELETE: Xóa movie theo ID

/* --- TvShow Routes --- */
Router.route('/tv-shows')
  .post(adminValidation.createTvShow, adminController.createTvShow) // POST: Đăng một tv show mới
  .get(adminValidation.paginationValidation, adminController.getTvShowList) // GET: Lấy danh sách các tv show

Router.route('/tv-shows/:mediaId')
  .get(adminController.getMediaById) // GET: Lấy thông tin tv show theo ID
  .put(adminValidation.updateTvShow, adminController.updateTvShow) // PUT: Cập nhật thông tin tv show theo ID
  .delete(adminController.deleteMedia) // DELETE: Xóa tv show theo ID

export const adminRoute = Router
