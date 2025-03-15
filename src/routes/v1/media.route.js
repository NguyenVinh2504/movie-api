import express from 'express'
import { mediaController } from '~/controllers/media.controller'
import tokenMiddleware from '~/middlewares/token.middleware'

const Router = express.Router({ mergeParams: true })

// Router.get('/genres', mediaController.getGenres)

// Router.get('/detail/:mediaId', mediaController.getDetail)

Router.route('/keywords/search').get(mediaController.searchKeyword)

Router.route('/:mediaType/trending/:timeWindow').get(mediaController.getTrending)
// discover/:mediaType
Router.route('/:mediaType/discover').get(mediaController.getDiscoverGenres)
Router.route('/:mediaType/detail/:mediaId').get(mediaController.getDetail)
Router.route('/:mediaType/search').get(mediaController.search)
Router.route('/:mediaType/:mediaCategory').get(mediaController.getList)
Router.route('/:mediaType/:series_id/season/:season_number').get(mediaController.getDetailSeason)
export const mediaRoute = Router
