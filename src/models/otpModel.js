import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'

const OTP_COLLECTION_NAME = 'otp'
const OTP_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().email().required()
    .label('email')
    .messages({
      'string.email': '{#label} Sai định dạng email',
      'any.required': '{#label} Email chưa nhập'
    }),
  otp: Joi.string().required()
})

const createOtp = async (data) => {
  const validData = await OTP_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
  try {
    const otp = await GET_DB().collection(OTP_COLLECTION_NAME).insertOne({
      ...validData
      , createdAt: new Date(new Date().setMinutes(new Date().getMinutes() + 2))
    })
    GET_DB().collection(OTP_COLLECTION_NAME).createIndex({ createdAt: 1 }, { expireAfterSeconds: 10 })
    return otp
  } catch (error) {
    throw new Error(error)
  }
}

const findOtp = async (email) => {
  try {
    const otp = await GET_DB().collection(OTP_COLLECTION_NAME).find({ email }).toArray()
    return otp
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOtp = async (email) => {
  try {
    const otp = await GET_DB().collection(OTP_COLLECTION_NAME).deleteMany({ email })
    return otp
  } catch (error) {
    throw new Error(error)
  }
}

export const otpModel = {
  OTP_COLLECTION_NAME,
  OTP_COLLECTION_SCHEMA,
  createOtp,
  findOtp,
  deleteOtp
}
