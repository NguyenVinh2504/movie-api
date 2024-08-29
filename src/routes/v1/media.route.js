import express from 'express'
import { mediaController } from '~/controllers/media.controller'

const Router = express.Router({ mergeParams: true })

// Router.get('/genres', mediaController.getGenres)

// Router.get('/detail/:mediaId', mediaController.getDetail)

Router.route('/trending/:timeWindow').get(mediaController.getTrending)
// discover/:mediaType
Router.route('/discover').get(mediaController.getDiscoverGenres)
Router.route('/detail/:mediaId').get(mediaController.getDetail)
Router.route('/search').get(mediaController.search)
Router.route('/:mediaCategory').get(mediaController.getList)
Router.route('/:series_id/season/:season_number').get(mediaController.getDetailSeason)
export const mediaRoute = Router
