import express from 'express'
import { adminController } from '~/controllers/adminController'
import { adminValidation } from '~/validations/adminValidation'
import tokenMiddleware from '~/middlewares/token.middleware'
import { isAdmin } from '~/middlewares/isAdmin'
import { subtitleController } from '~/controllers/subtitle.controller'
import { subtitleValidation } from '~/validations/subtitleValidation'
import { subtitleMulterMiddleware } from '~/middlewares/subtitleMulter.middleware'
import { linkController } from '~/controllers/linkController'
import { linkValidation } from '~/validations/linkValidation'
const Router = express.Router({ mergeParams: true })

/* --- Movie Routes --- */
Router.route('/movies')
  .post(tokenMiddleware.auth, isAdmin, adminValidation.createMovie, adminController.createMovie) // POST: Đăng một movie mới
  .get(tokenMiddleware.auth, isAdmin, adminValidation.getMediaList, adminController.getMovieList) // GET: Lấy danh sách các movie

Router.route('/movies/:mediaId')
  .get(tokenMiddleware.auth, isAdmin, adminValidation.validateMediaAction, adminController.getMediaById) // GET: Lấy thông tin movie theo ID
  .put(
    tokenMiddleware.auth,
    isAdmin,
    adminValidation.validateMediaAction,
    adminValidation.updateMovie,
    adminController.updateMovie
  ) // PUT: Cập nhật thông tin movie theo ID
  .delete(tokenMiddleware.auth, isAdmin, adminValidation.validateMediaAction, adminController.deleteMedia) // DELETE: Xóa movie theo ID

/* --- Movie Video Links Routes --- */
Router.route('/movies/:movieId/video-links').post(
  tokenMiddleware.auth,
  isAdmin,
  linkValidation.addMovieVideoLink,
  linkController.addMovieVideoLink
) // POST: Thêm video link

Router.route('/movies/:movieId/video-links/:linkId')
  .patch(tokenMiddleware.auth, isAdmin, linkValidation.updateMovieVideoLink, linkController.updateMovieVideoLink) // PATCH: Cập nhật video link
  .delete(tokenMiddleware.auth, isAdmin, linkValidation.deleteMovieVideoLink, linkController.deleteMovieVideoLink) // DELETE: Xóa video link

/* --- Movie Subtitle Links Routes --- */
Router.route('/movies/:movieId/subtitle-links').post(
  tokenMiddleware.auth,
  isAdmin,
  subtitleMulterMiddleware.single('subtitle'), // Optional: parse file nếu có
  linkValidation.addMovieSubtitleLink,
  linkController.addMovieSubtitleLink
) // POST: Thêm subtitle link (có thể upload file hoặc thêm URL)

Router.route('/movies/:movieId/subtitle-links/:linkId')
  .patch(
    tokenMiddleware.auth,
    isAdmin,
    subtitleMulterMiddleware.single('subtitle'), // Optional: parse file nếu có (để replace file)
    linkValidation.updateMovieSubtitleLink,
    linkController.updateMovieSubtitleLink
  ) // PATCH: Cập nhật subtitle link (có thể replace file hoặc chỉ update metadata)
  .delete(tokenMiddleware.auth, isAdmin, linkValidation.deleteMovieSubtitleLink, linkController.deleteMovieSubtitleLink) // DELETE: Xóa subtitle link

/* --- TvShow Routes --- */
Router.route('/tv-shows')
  .post(tokenMiddleware.auth, isAdmin, adminValidation.createTvShow, adminController.createTvShow) // POST: Đăng một tv show mới
  .get(tokenMiddleware.auth, isAdmin, adminValidation.getMediaList, adminController.getTvShowList) // GET: Lấy danh sách các tv show

Router.route('/tv-shows/:mediaId')
  .get(tokenMiddleware.auth, isAdmin, adminValidation.validateMediaAction, adminController.getMediaById) // GET: Lấy thông tin tv show theo ID
  .put(
    tokenMiddleware.auth,
    isAdmin,
    adminValidation.validateMediaAction,
    adminValidation.updateTvShow,
    adminController.updateTvShow
  ) // PUT: Cập nhật thông tin tv show theo ID
  .delete(tokenMiddleware.auth, isAdmin, adminValidation.validateMediaAction, adminController.deleteMedia) // DELETE: Xóa tv show theo ID

/* --- Episode Routes --- */
Router.route('/tv-shows/:tvShowId/episodes')
  .post(tokenMiddleware.auth, isAdmin, adminValidation.addEpisode, adminController.addEpisode)
  .get(tokenMiddleware.auth, isAdmin, adminValidation.getEpisodeList, adminController.getEpisodeList)

Router.route('/tv-shows/:tvShowId/episodes/lookup').get(
  tokenMiddleware.auth,
  isAdmin,
  adminValidation.getEpisodeDetailsByTmdbId,
  adminController.getEpisodeDetailsByTmdbId
)

Router.route('/tv-shows/:tvShowId/episodes/:episodeId')
  .get(
    tokenMiddleware.auth,
    isAdmin,
    adminValidation.validateEpisodeAction, // Middleware validate mới
    adminController.getEpisodeDetails // Controller mới
  )
  .put(
    tokenMiddleware.auth,
    isAdmin,
    adminValidation.validateEpisodeAction,
    adminValidation.updateEpisode,
    adminController.updateEpisode
  )
  .delete(
    tokenMiddleware.auth,
    isAdmin,
    adminValidation.validateEpisodeAction, // Middleware validate mới
    adminController.deleteEpisode // Controller mới
  )

/* --- Episode Video Links Routes --- */
Router.route('/tv-shows/:tvShowId/episodes/:episodeId/video-links').post(
  tokenMiddleware.auth,
  isAdmin,
  linkValidation.addEpisodeVideoLink,
  linkController.addEpisodeVideoLink
) // POST: Thêm video link

Router.route('/tv-shows/:tvShowId/episodes/:episodeId/video-links/:linkId')
  .patch(tokenMiddleware.auth, isAdmin, linkValidation.updateEpisodeVideoLink, linkController.updateEpisodeVideoLink) // PATCH: Cập nhật video link
  .delete(tokenMiddleware.auth, isAdmin, linkValidation.deleteEpisodeVideoLink, linkController.deleteEpisodeVideoLink) // DELETE: Xóa video link

/* --- Episode Subtitle Links Routes --- */
Router.route('/tv-shows/:tvShowId/episodes/:episodeId/subtitle-links').post(
  tokenMiddleware.auth,
  isAdmin,
  subtitleMulterMiddleware.single('subtitle'), // Optional: parse file nếu có
  linkValidation.addEpisodeSubtitleLink,
  linkController.addEpisodeSubtitleLink
) // POST: Thêm subtitle link (có thể upload file hoặc thêm URL)

Router.route('/tv-shows/:tvShowId/episodes/:episodeId/subtitle-links/:linkId')
  .patch(
    tokenMiddleware.auth,
    isAdmin,
    subtitleMulterMiddleware.single('subtitle'), // Optional: parse file nếu có (để replace file)
    linkValidation.updateEpisodeSubtitleLink,
    linkController.updateEpisodeSubtitleLink
  ) // PATCH: Cập nhật subtitle link (có thể replace file hoặc chỉ update metadata)
  .delete(
    tokenMiddleware.auth,
    isAdmin,
    linkValidation.deleteEpisodeSubtitleLink,
    linkController.deleteEpisodeSubtitleLink
  ) // DELETE: Xóa subtitle link

/* --- Subtitle Routes --- */
Router.post(
  '/subtitle/presigned-url',
  tokenMiddleware.auth,
  isAdmin,
  subtitleValidation.presignedUrl,
  subtitleController.getPresignedUrl
) // POST: Tạo pre-signed URL cho một file phụ đề

Router.post(
  '/subtitle/presigned-urls',
  tokenMiddleware.auth,
  isAdmin,
  subtitleValidation.multiplePresignedUrls,
  subtitleController.getMultiplePresignedUrls
) // POST: Tạo nhiều pre-signed URLs cho nhiều file phụ đề

export const adminRoute = Router
