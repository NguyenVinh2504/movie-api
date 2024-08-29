import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const FAVORITE_COLLECTION_NAME = 'favorites'
const FAVORITE_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().allow('').required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  media_type: Joi.string().allow('').valid('tv', 'movie').required(),
  mediaId: Joi.number().allow('').required(),
  title: Joi.string().allow('').required(),
  poster_path: Joi.string().allow('').required(),
  vote_average: Joi.number().allow('').required(),
  release_date: Joi.string().allow('').required()
})

const addFavorite = async (data) => {
  const validData = await FAVORITE_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
  const newFavoriteToAdd = {
    ...validData,
    userId: new ObjectId(validData.userId)
  }
  try {
    const favoriteItem = await GET_DB().collection(FAVORITE_COLLECTION_NAME).insertOne(newFavoriteToAdd)
    const result = await GET_DB()
      .collection(FAVORITE_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(favoriteItem.insertedId) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOneById = async ({ idUser, favoriteId }) => {
  try {
    await GET_DB()
      .collection(FAVORITE_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(favoriteId) })
    const result = await findFavorite(idUser)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findFavorite = async (idUser) => {
  try {
    const result = await GET_DB()
      .collection(FAVORITE_COLLECTION_NAME)
      .find({ userId: new ObjectId(idUser) })
      .toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const favoriteModel = {
  FAVORITE_COLLECTION_NAME,
  FAVORITE_COLLECTION_SCHEMA,
  addFavorite,
  deleteOneById,
  findFavorite
}
