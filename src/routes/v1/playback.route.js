import express from 'express'
import { playbackController } from '~/controllers/playbackController'
import { playbackValidation } from '~/validations/playbackValidation'

const Router = express.Router({ mergeParams: true })

Router.route('/movie/:tmdbId').get(playbackValidation.getMoviePlayback, playbackController.getMoviePlayback)

// Example: /tv/1399?episode_id=123&season=1&episode=1
Router.route('/tv/:tmdbId').get(playbackValidation.getTvPlayback, playbackController.getTvPlayback)

export const playbackRoute = Router
