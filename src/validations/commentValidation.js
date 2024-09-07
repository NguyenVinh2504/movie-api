/* eslint-disable no-console */
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const addComment = async (req, res, next) => {
  const correctCondition = Joi.object({
    movieId: Joi.string().required(),
    movieType: Joi.string().valid('movie', 'tv').required(),
    content: Joi.string().min(1).max(400).required()
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // Kiểm tra dữ liệu xong xuôi cho giá trị client đi tiếp controller
    next()
  } catch (error) {
    // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const commentValidation = {
  addComment
}
