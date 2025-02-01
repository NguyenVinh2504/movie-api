import express from 'express'
import { mediaController } from '~/controllers/media.controller'
import { videoController } from '~/controllers/videoController'
import tokenMiddleware from '~/middlewares/token.middleware'

const Router = express.Router({ mergeParams: true })

Router.route('/movie/:mediaId').get(videoController.getMovieVideo)
// Router.route('/get-video/tv/:mediaId/:episodeId/:mediaSeason/:mediaEpisode').get(mediaController.getDiscoverGenres)

export const videoRoute = Router
