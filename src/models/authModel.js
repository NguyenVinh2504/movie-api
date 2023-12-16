import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { joiPasswordExtendCore } from 'joi-password'
import { userModel } from './userModel'
// import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const joiPassword = Joi.extend(joiPasswordExtendCore)
const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_NAME_2 = 'refreshToken'
const USER_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().min(8).required().label('name')
    .messages({
      'string.min': '{#label} Tối thiếu 8 kí tự',
      'any.required': '{#label} Chưa nhập tên đăng nhập'
    }),
  slug: Joi.string().min(3).required(),
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
      if (user) return help.message('Email đã được sử dụng. Hãy thử email khác')
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

const signUp = async (data) => {
  const validData = await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
  try {
    const user = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validData)
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ _id: new ObjectId(user.insertedId) }, {
      projection: { password: 0 }
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const addRefreshToken = async (data) => {
  try {
    const user = await GET_DB().collection(USER_COLLECTION_NAME_2).insertOne(data)
    return user
  } catch (error) {
    throw new Error(error)
  }
}
const getRefreshToken = async (data) => {
  try {
    const user = await GET_DB().collection(USER_COLLECTION_NAME_2).findOne({ refreshToken: data })
    return user
  } catch (error) {
    throw new Error(error)
  }
}
const deleteRefreshToken = async (data) => {
  try {
    const user = await GET_DB().collection(USER_COLLECTION_NAME_2).deleteOne({ refreshToken: data })
    return user
  } catch (error) {
    throw new Error(error)
  }
}


export const authModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  signUp,
  addRefreshToken,
  deleteRefreshToken,
  getRefreshToken
}
