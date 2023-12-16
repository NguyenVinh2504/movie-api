import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createFavorite = async (req, res, next) => {
  const correctCondition = Joi.object({
    media_type: Joi.string().valid('tv', 'movie').required(),
    mediaId: Joi.string().required(),
    title: Joi.string().required(),
    poster_path: Joi.string().required(),
    vote_average: Joi.number().required(),
    release_date: Joi.string().required()
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

export const favoriteValidation = {
  createFavorite
}