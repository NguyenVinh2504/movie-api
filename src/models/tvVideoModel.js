import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
// import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
// import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const TV_VIDEO_COLLECTION_NAME = 'tvVideo'
const TV_VIDEO_COLLECTION_SCHEMA = Joi.object({
  // name: Joi.string().optional(),
  // status: Joi.string().valid('pending', 'processing', 'success', 'failed').required(),
  // message: Joi.string().optional().default(''),
  // updated_at: Joi.date()
  //   .optional()
  //   .default(() => new Date())
})

const getTvVideoInfo = async ({ mediaId, episodeId, seasonNumber, episodeNumber }) => {
  console.log({ mediaId, episodeId, seasonNumber, episodeNumber })

  const result = await GET_DB().collection(TV_VIDEO_COLLECTION_NAME).findOne({
    mediaId,
    episodeId,
    seasonNumber,
    episodeNumber
  })
  return result
}
export const tvVideoModel = {
  TV_VIDEO_COLLECTION_NAME,
  TV_VIDEO_COLLECTION_SCHEMA,
  getTvVideoInfo
}
