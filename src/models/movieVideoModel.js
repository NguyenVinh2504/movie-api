import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
// import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
// import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const MOVIE_VIDEO_COLLECTION_NAME = 'media'
const MOVIE_VIDEO_COLLECTION_SCHEMA = Joi.object({
  // name: Joi.string().optional(),
  // status: Joi.string().valid('pending', 'processing', 'success', 'failed').required(),
  // message: Joi.string().optional().default(''),
  // updated_at: Joi.date()
  //   .optional()
  //   .default(() => new Date())
})

const getMovieVideoInfo = async ({ mediaId }) => {
  const result = await GET_DB().collection(MOVIE_VIDEO_COLLECTION_NAME).findOne({ tmdb_id: +mediaId })
  return result
}

export const movieVideoModel = {
  MOVIE_VIDEO_COLLECTION_NAME,
  MOVIE_VIDEO_COLLECTION_SCHEMA,
  getMovieVideoInfo
}
