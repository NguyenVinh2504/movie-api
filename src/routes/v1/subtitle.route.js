import express from 'express'
import { subtitleController } from '~/controllers/subtitle.controller'
// import tokenMiddleware from '~/middlewares/token.middleware'
import { subtitleValidation } from '~/validations/subtitleValidation'

const Router = express.Router({ mergeParams: true })

Router.route('/').get(subtitleValidation.getSubtitle, subtitleController.getSubtitle)

export const subtitleRoute = Router
