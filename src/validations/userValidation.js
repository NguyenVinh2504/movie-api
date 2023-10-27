/* eslint-disable no-console */
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const signIn = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    avatar: Joi.string(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    phone: Joi.number(),
    userName: Joi.string().alphanum().min(3).max(30),
    access_token: [
      Joi.string(),
      Joi.number()
    ],
    refresh_token: [
      Joi.string(),
      Joi.number()
    ]
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // Kiểm tra dữ liệu xong xuôi cho giá trị client đi tiếp controller
    next()
  } catch (error) {
    // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const userValidation = {
  signIn
}