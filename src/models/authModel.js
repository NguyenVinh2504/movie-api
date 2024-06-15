import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { joiPasswordExtendCore } from 'joi-password'
import { userModel } from './userModel'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
// import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const joiPassword = Joi.extend(joiPasswordExtendCore)
const USER_COLLECTION_NAME = 'users'
const REFRESH_TOKEN_COLLECTION_NAME = 'refreshToken'
const PUBLIC_KEY_COLLECTION_NAME = 'publicKey'
const ACCESS_TOKEN_COLLECTION_NAME = 'accessToken'
const USER_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().label('name')
    .messages({
      'any.required': '{#label} Chưa nhập tên đăng nhập'
    }),
  slug: Joi.string().required(),
  // favoriteIds: Joi.array().items(
  //   Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  // ).default([]),
  temporaryAvatar: Joi.string().default(null),
  avatar: Joi.string().default(null),
  email: Joi.string().email().required('This is required')
    .label('Email')
    .messages({
      'string.email': '{#label} Sai định dạng email',
      'any.required': '{#label} Email chưa nhập'
    }).external(async (value, help) => {
      const user = await userModel.getEmail(value)
      if (user) return help.message('ISEXISTS')
    }),
  password: joiPassword.string()
    .min(8)
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .onlyLatinCharacters()
    .required()
    .label('Mật khẩu')
    .messages({
      'any.required': 'Chưa nhập {#label}',
      'string.min': '{#label} chứa ít nhất 8 kí tự',
      'password.minOfUppercase': '{#label} nên chứa chữ viết hoa',
      'password.minOfSpecialCharacters':
        '{#label} nên chứa kí tự đặc biệt',
      'password.minOfLowercase': '{#label} nên chứa chữ viết thường',
      'password.minOfNumeric': '{#label} nên chứa chữ số',
      'password.noWhiteSpaces': '{#label} không nên có khoảng trắng',
      'password.onlyLatinCharacters': '{#label} chỉ nên chứa các kí tự Latin'
    }),
  phone: Joi.number().default(null),
  userName: Joi.string(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  admin: Joi.boolean().default(false),
  _destroy: Joi.boolean().default(false)
})

const REFRESH_TOKEN_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().allow('').required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  refreshToken: Joi.string().allow('').required()
})

const ACCESS_TOKEN_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().allow('').required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  accessToken: Joi.string().allow('').required()
})

const PUBLIC_KEY_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().allow('').required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  privateKey: Joi.string(),
  publicKey: Joi.string(),
  refreshTokensUsed: Joi.array().default([])
})

const signUp = async (data) => {
  const validData = await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
  try {
    const user = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validData)
    const result = await userModel.getIdUser(user.insertedId)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const createKeyToken = async ({ userId, privateKey, publicKey }) => {
  const validData = await PUBLIC_KEY_COLLECTION_SCHEMA.validateAsync({ userId, privateKey, publicKey }, { abortEarly: false })
  try {
    const filter = { userId: validData.userId }
    const update = { $set: { privateKey: validData.privateKey, publicKey: validData.publicKey } }
    const option = { upsert: true, new: true, returnDocument: 'after' }
    const tokens = await GET_DB().collection(PUBLIC_KEY_COLLECTION_NAME).findOneAndUpdate(filter, update, option)
    // const tokens = await GET_DB().collection(PUBLIC_KEY_COLLECTION_NAME).insertOne(validData)

    return tokens
  } catch (error) {
    throw new Error(error)
  }
}

const getKeyToken = async (userId) => {
  try {
    const user = await GET_DB().collection(PUBLIC_KEY_COLLECTION_NAME).findOne({ userId })
    return user
  } catch (error) {
    throw new Error(error)
  }
}

const updateKeyToken = async ({ userId, refreshToken }) => {
  try {
    const user = await GET_DB().collection(PUBLIC_KEY_COLLECTION_NAME).updateOne({ userId }, {
      $addToSet: { refreshTokensUsed: refreshToken }
    })
    return user
  } catch (error) {
    throw new Error(error)
  }
}

const deleteKeyToken = async (userId) => {
  try {
    const user = await GET_DB().collection(PUBLIC_KEY_COLLECTION_NAME).deleteOne({ userId: userId })
    return user
  } catch (error) {
    throw new Error(error)
  }
}

const addRefreshToken = async (data) => {
  try {
    const validData = await REFRESH_TOKEN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
    // const filter = { userId: validData.userId }
    // const update = { $set: { ...validData, createdAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) } }
    // const option = { upsert: true, new: true, returnDocument: 'after' }
    // const user = await GET_DB().collection(REFRESH_TOKEN_COLLECTION_NAME).findOneAndUpdate(filter, update, option)
    const user = await GET_DB().collection(REFRESH_TOKEN_COLLECTION_NAME).insertOne({
      ...validData,
      createdAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    })
    GET_DB().collection(REFRESH_TOKEN_COLLECTION_NAME).createIndex({ createdAt: 1 }, { expireAfterSeconds: 10 })
    return user
  } catch (error) {
    throw new Error(error)
  }
}

const findByRefreshTokensUsed = async (refreshToken) => {
  try {
    const user = await GET_DB().collection(REFRESH_TOKEN_COLLECTION_NAME).findOne({ refreshTokensUsed: refreshToken })
    return user
  } catch (error) {
    throw new Error(error)
  }
}

const addAccessToken = async (data) => {
  try {
    const validData = await ACCESS_TOKEN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
    // const filter = { userId: validData.userId }
    // const update = { $set: { ...validData, createdAt: new Date(new Date().setMinutes(new Date().getMinutes() + 1.5)) } }
    // const option = { upsert: true, new: true, returnDocument: 'after' }
    // const user = await GET_DB().collection(ACCESS_TOKEN_COLLECTION_NAME).findOneAndUpdate(filter, update, option)
    const user = await GET_DB().collection(ACCESS_TOKEN_COLLECTION_NAME).insertOne({
      ...validData,
      createdAt: new Date(new Date().setHours(new Date().getHours() + 1.5))
    })
    GET_DB().collection(ACCESS_TOKEN_COLLECTION_NAME).createIndex({ createdAt: 1 }, { expireAfterSeconds: 10 })
    return user
  } catch (error) {
    throw new Error(error)
  }
}

const getAccessToken = async (data) => {
  try {
    const user = await GET_DB().collection(ACCESS_TOKEN_COLLECTION_NAME).findOne({ accessToken: data })
    return user
  } catch (error) {
    throw new Error(error)
  }
}

const deleteAccessToken = async (data) => {
  try {
    const user = await GET_DB().collection(ACCESS_TOKEN_COLLECTION_NAME).deleteOne({ accessToken: data })
    return user
  } catch (error) {
    throw new Error(error)
  }
}
const getRefreshToken = async (data) => {
  try {
    const user = await GET_DB().collection(REFRESH_TOKEN_COLLECTION_NAME).findOne({ refreshToken: data })
    return user
  } catch (error) {
    throw new Error(error)
  }
}
const deleteRefreshToken = async (data) => {
  try {
    const user = await GET_DB().collection(REFRESH_TOKEN_COLLECTION_NAME).deleteOne({ refreshToken: data })
    return user
  } catch (error) {
    throw new Error(error)
  }
}


export const authModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  signUp,
  getKeyToken,
  createKeyToken,
  updateKeyToken,
  deleteKeyToken,
  addAccessToken,
  getAccessToken,
  deleteAccessToken,
  addRefreshToken,
  findByRefreshTokensUsed,
  deleteRefreshToken,
  getRefreshToken
}
