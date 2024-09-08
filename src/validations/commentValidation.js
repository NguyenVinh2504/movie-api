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
const paginationValidation = async (req, res, next) => {
  const correctCondition = Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
      'number.base': '"page" phải là số',
      'number.min': '"page" phải lớn hơn hoặc bằng 1',
      'number.integer': '"page" phải là số nguyên'
    }),
    limit: Joi.number().integer().min(1).default(10).messages({
      'number.base': '"limit" phải là số',
      'number.min': '"limit" phải lớn hơn hoặc bằng 1',
      'number.integer': '"limit" phải là số nguyên'
    })
  })
  try {
    const value = await correctCondition.validateAsync(req.query, { abortEarly: false })
    // Kiểm tra dữ liệu xong xuôi cho giá trị client đi tiếp controller
    req.query = value
    next()
  } catch (error) {
    // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}
export const commentValidation = {
  addComment,
  paginationValidation
}
