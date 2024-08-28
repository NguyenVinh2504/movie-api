import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
// import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
// import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const MEDIA_COLLECTION_NAME = 'videoStatus'
const MEDIA_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().optional(),
  status: Joi.string().valid('pending', 'processing', 'success', 'failed').required(),
  message: Joi.string().optional().default(''),
  updated_at: Joi.date().optional().default(() => new Date())
})


const createVideoStatus = async (data) => {
  const validData = await MEDIA_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
  const media = await GET_DB().collection(MEDIA_COLLECTION_NAME).insertOne(validData)
  const result = await GET_DB().collection(MEDIA_COLLECTION_NAME).findOne({ _id: new ObjectId(media.insertedId) })
  return result
}

const updateVideoStatus = async ({ name, status }) => {
  await GET_DB().collection(MEDIA_COLLECTION_NAME).updateOne({ name }, {
    $set: { status },
    $currentDate: { updated_at: true }
  })
  const result = await GET_DB().collection(MEDIA_COLLECTION_NAME).findOne({ name })
  return result
}

const getVideoStatus = async (name) => {
  const result = await GET_DB().collection(MEDIA_COLLECTION_NAME).findOne({ name })
  return result
}
export const mediaModel = {
  MEDIA_COLLECTION_NAME,
  MEDIA_COLLECTION_SCHEMA,
  createVideoStatus,
  updateVideoStatus,
  getVideoStatus
}