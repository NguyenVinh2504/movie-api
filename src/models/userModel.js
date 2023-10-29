import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  slug: Joi.string().min(3).required(),
  avatar: Joi.string().default(null),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  phone: Joi.number(),
  userName: Joi.string().alphanum().min(3).max(30).default(null),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  _destroy: Joi.boolean().default(false),
  access_token: [
    Joi.string(),
    Joi.number()
  ],
  refresh_token: [
    Joi.string(),
    Joi.number()
  ]
})

const signIn = async (data) => {
  const validData = await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validData)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getUser = async (data) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ name: data.name })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getInfo = async (data) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ _id: new ObjectId(data) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  signIn,
  getUser,
  getInfo
}
