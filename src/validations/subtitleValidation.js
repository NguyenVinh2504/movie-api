import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'

/**
 * Validation cho request tạo presigned URL đơn
 */
const presignedUrl = async (req, res, next) => {
  const correctCondition = Joi.object({
    // mediaId: Joi.string().required().trim().messages({
    //   'any.required': 'mediaId là bắt buộc',
    //   'string.empty': 'mediaId không được để trống'
    // }),
    // mediaType: Joi.string().required().valid('movie', 'tv').messages({
    //   'any.required': 'mediaType là bắt buộc',
    //   'any.only': 'mediaType phải là "movie" hoặc "tv"'
    // }),
    // seasonNumber: Joi.number().integer().min(1).when('mediaType', {
    //   is: 'tv',
    //   then: Joi.required(),
    //   otherwise: Joi.forbidden()
    // }).messages({
    //   'any.required': 'seasonNumber là bắt buộc đối với TV show',
    //   'number.min': 'seasonNumber phải lớn hơn hoặc bằng 1'
    // }),
    // episodeNumber: Joi.number().integer().min(1).when('mediaType', {
    //   is: 'tv',
    //   then: Joi.required(),
    //   otherwise: Joi.forbidden()
    // }).messages({
    //   'any.required': 'episodeNumber là bắt buộc đối với TV show',
    //   'number.min': 'episodeNumber phải lớn hơn hoặc bằng 1'
    // }),
    fileName: Joi.string().required().trim().min(1).max(255).messages({
      'any.required': 'fileName là bắt buộc',
      'string.empty': 'fileName không được để trống',
      'string.max': 'fileName không được vượt quá 255 ký tự'
    })
    // label: Joi.string().required().trim().min(1).max(100).messages({
    //   'any.required': 'label là bắt buộc (ví dụ: "Tiếng Việt", "English")',
    //   'string.empty': 'label không được để trống',
    //   'string.max': 'label không được vượt quá 100 ký tự'
    // }),
    // expiresIn: Joi.number().integer().min(60).max(86400).optional().messages({
    //   'number.min': 'expiresIn phải tối thiểu 60 giây',
    //   'number.max': 'expiresIn không được vượt quá 86400 giây (24 giờ)'
    // })
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ')
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage))
  }
}

/**
 * Validation cho request tạo nhiều presigned URLs
 */
const multiplePresignedUrls = async (req, res, next) => {
  const subtitleItemSchema = Joi.object({
    fileName: Joi.string().required().trim().min(1).max(255).messages({
      'any.required': 'fileName là bắt buộc',
      'string.empty': 'fileName không được để trống',
      'string.max': 'fileName không được vượt quá 255 ký tự'
    }),
    label: Joi.string().required().trim().min(1).max(100).messages({
      'any.required': 'label là bắt buộc (ví dụ: "Tiếng Việt", "English")',
      'string.empty': 'label không được để trống',
      'string.max': 'label không được vượt quá 100 ký tự'
    }),
    expiresIn: Joi.number().integer().min(60).max(86400).optional().messages({
      'number.min': 'expiresIn phải tối thiểu 60 giây',
      'number.max': 'expiresIn không được vượt quá 86400 giây (24 giờ)'
    })
  })

  const correctCondition = Joi.object({
    mediaId: Joi.string().required().trim().messages({
      'any.required': 'mediaId là bắt buộc',
      'string.empty': 'mediaId không được để trống'
    }),
    mediaType: Joi.string().required().valid('movie', 'tv').messages({
      'any.required': 'mediaType là bắt buộc',
      'any.only': 'mediaType phải là "movie" hoặc "tv"'
    }),
    seasonNumber: Joi.number()
      .integer()
      .min(1)
      .when('mediaType', {
        is: 'tv',
        then: Joi.required(),
        otherwise: Joi.forbidden()
      })
      .messages({
        'any.required': 'seasonNumber là bắt buộc đối với TV show',
        'number.min': 'seasonNumber phải lớn hơn hoặc bằng 1'
      }),
    episodeNumber: Joi.number()
      .integer()
      .min(1)
      .when('mediaType', {
        is: 'tv',
        then: Joi.required(),
        otherwise: Joi.forbidden()
      })
      .messages({
        'any.required': 'episodeNumber là bắt buộc đối với TV show',
        'number.min': 'episodeNumber phải lớn hơn hoặc bằng 1'
      }),
    subtitles: Joi.array().items(subtitleItemSchema).min(1).max(20).required().messages({
      'any.required': 'Mảng subtitles là bắt buộc',
      'array.min': 'Mảng subtitles phải có ít nhất 1 phần tử',
      'array.max': 'Mảng subtitles không được vượt quá 20 phần tử'
    })
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ')
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage))
  }
}

/**
 * Validation cho request đọc subtitle từ R2
 */
const getSubtitle = async (req, res, next) => {
  const correctCondition = Joi.object({
    r2_key: Joi.string().required().trim().min(1).messages({
      'any.required': 'r2_key là bắt buộc',
      'string.empty': 'r2_key không được để trống'
    })
  })

  try {
    await correctCondition.validateAsync(req.query, { abortEarly: false })
    next()
  } catch (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ')
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage))
  }
}

export const subtitleValidation = {
  presignedUrl,
  multiplePresignedUrls,
  getSubtitle
}
