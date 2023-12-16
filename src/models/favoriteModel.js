import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const FAVORITE_COLLECTION_NAME = 'favorites'
const FAVORITE_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  media_type: Joi.string().valid('tv', 'movie').required(),
  mediaId: Joi.number().required(),
  title: Joi.string().required(),
  poster_path: Joi.string().required(),
  vote_average: Joi.number().required(),
  release_date: Joi.string().required()
})

const addFavorite = async (data) => {
  const validData = await FAVORITE_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
  const newFavoriteToAdd = {
    ...validData,
    userId: new ObjectId(validData.userId)
  }
  try {
    const favoriteItem = await GET_DB().collection(FAVORITE_COLLECTION_NAME).insertOne(newFavoriteToAdd)
    const result = await GET_DB().collection(FAVORITE_COLLECTION_NAME).findOne({ _id: new ObjectId(favoriteItem.insertedId) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOneById = async (favoriteId) => {
  try {
    const result = await GET_DB().collection(FAVORITE_COLLECTION_NAME).deleteOne({ _id: new ObjectId(favoriteId) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const favoriteModel = {
  FAVORITE_COLLECTION_NAME,
  FAVORITE_COLLECTION_SCHEMA,
  addFavorite,
  deleteOneById
}