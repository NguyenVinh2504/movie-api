import express from 'express'
import { videoController } from '~/controllers/videoController'
import tokenMiddleware from '~/middlewares/token.middleware'

const Router = express.Router({ mergeParams: true })

Router.route('/movie/:mediaId').get(videoController.getMovieVideo)
Router.route('/tv/:mediaId/:episodeId/:seasonNumber/:episodeNumber').get(videoController.getTvVideo)

export const videoRoute = Router
