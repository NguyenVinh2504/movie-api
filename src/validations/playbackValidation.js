import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const getTvPlayback = async (req, res, next) => {
  const correctCondition = Joi.object({
    tmdbId: Joi.number().integer().required().messages({
      'number.base': 'TMDB ID must be a number',
      'any.required': 'TMDB ID is required'
    }),
    episode_id: Joi.number().integer().required().messages({
      'number.base': 'Episode ID must be a number',
      'any.required': 'Episode ID is required'
    }),
    season: Joi.number().integer().min(1).required().messages({
      'number.base': 'Season must be a number',
      'number.min': 'Season must be at least 1',
      'any.required': 'Season number is required'
    }),
    episode: Joi.number().integer().min(1).required().messages({
      'number.base': 'Episode must be a number',
      'number.min': 'Episode must be at least 1',
      'any.required': 'Episode number is required'
    })
  })

  try {
    const validatedData = await correctCondition.validateAsync(
      {
        tmdbId: req.params.tmdbId,
        ...req.query
      },
      { abortEarly: false, convert: true }
    )

    // Chuyển validated data vào req để controller sử dụng
    req.validatedData = validatedData
    next()
  } catch (error) {
    const errorMessage = error.details?.map((detail) => detail.message).join(', ') || error.message
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage))
  }
}

const getMoviePlayback = async (req, res, next) => {
  const correctCondition = Joi.object({
    tmdbId: Joi.number().integer().required().messages({
      'number.base': 'TMDB ID must be a number',
      'any.required': 'TMDB ID is required'
    })
  })

  try {
    await correctCondition.validateAsync(req.params, { abortEarly: false })
    next()
  } catch (error) {
    const errorMessage = error.details?.map((detail) => detail.message).join(', ') || error.message
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage))
  }
}

export const playbackValidation = {
  getTvPlayback,
  getMoviePlayback
}
