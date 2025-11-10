import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Schema validation cho video link khi thêm mới
const addVideoLinkSchema = Joi.object({
  label: Joi.string().trim().min(1).required().messages({
    'any.required': 'Trường "label" là bắt buộc.',
    'string.empty': 'Trường "label" không được để trống.'
  }),
  url: Joi.string().trim().uri().required().messages({
    'any.required': 'Trường "url" là bắt buộc.',
    'string.uri': 'Trường "url" phải là một đường dẫn URL hợp lệ.'
  })
})

// Schema validation cho video link khi cập nhật
const updateVideoLinkSchema = Joi.object({
  label: Joi.string().trim().min(1).optional().messages({
    'string.empty': 'Trường "label" không được để trống.'
  }),
  url: Joi.string().trim().uri().optional().messages({
    'string.uri': 'Trường "url" phải là một đường dẫn URL hợp lệ.'
  })
}).min(1) // Ít nhất phải có 1 field

// Schema validation cho subtitle link khi thêm mới
// File hoặc URL phải có một - validation flexible
const addSubtitleLinkSchema = Joi.object({
  label: Joi.string().trim().min(1).required().messages({
    'any.required': 'Trường "label" là bắt buộc.',
    'string.empty': 'Trường "label" không được để trống.'
  }),
  url: Joi.string().trim().uri().optional().messages({
    'string.uri': 'Trường "url" phải là một đường dẫn URL hợp lệ.'
  }),
  lang: Joi.string().trim().lowercase().length(2).optional().allow(null).messages({
    'string.length': '"lang" phải là mã ISO 639-1 (2 ký tự).'
  }),
  kind: Joi.string().trim().optional().messages({
    'string.empty': '"kind" không được để trống.'
  })
})

// Schema validation cho subtitle link khi cập nhật
const updateSubtitleLinkSchema = Joi.object({
  label: Joi.string().trim().min(1).optional().messages({
    'string.empty': 'Trường "label" không được để trống.'
  }),
  url: Joi.string().trim().uri().optional().messages({
    'string.uri': 'Trường "url" phải là một đường dẫn URL hợp lệ.'
  }),
  lang: Joi.string().trim().lowercase().length(2).optional().allow(null).messages({
    'string.length': '"lang" phải là mã ISO 639-1 (2 ký tự).'
  }),
  kind: Joi.string().trim().optional().messages({
    'string.empty': '"kind" không được để trống.'
  })
}).min(1) // Ít nhất phải có 1 field

// Schema validation cho linkId trong params
const linkIdParamSchema = Joi.object({
  linkId: Joi.string().pattern(OBJECT_ID_RULE).required().messages({
    'any.required': 'linkId là trường bắt buộc.',
    'string.pattern.base': OBJECT_ID_RULE_MESSAGE
  })
})

// Schema validation cho movieId trong params
const movieIdParamSchema = Joi.object({
  movieId: Joi.string().pattern(OBJECT_ID_RULE).required().messages({
    'any.required': 'movieId là trường bắt buộc.',
    'string.pattern.base': OBJECT_ID_RULE_MESSAGE
  })
})

// Schema validation cho tvShowId và episodeId trong params
const episodeParamsSchema = Joi.object({
  tvShowId: Joi.string().pattern(OBJECT_ID_RULE).required().messages({
    'any.required': 'tvShowId là trường bắt buộc.',
    'string.pattern.base': OBJECT_ID_RULE_MESSAGE
  }),
  episodeId: Joi.string().pattern(OBJECT_ID_RULE).required().messages({
    'any.required': 'episodeId là trường bắt buộc.',
    'string.pattern.base': OBJECT_ID_RULE_MESSAGE
  })
})

// Middleware validators

// Movie Video Links
const addMovieVideoLink = async (req, res, next) => {
  try {
    const validatedParams = await movieIdParamSchema.validateAsync(req.params, { abortEarly: false })
    const validatedBody = await addVideoLinkSchema.validateAsync(req.body, { abortEarly: false })
    req.params = validatedParams
    req.body = validatedBody
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const updateMovieVideoLink = async (req, res, next) => {
  try {
    const validatedParams = await movieIdParamSchema
      .concat(linkIdParamSchema)
      .validateAsync(req.params, { abortEarly: false })
    const validatedBody = await updateVideoLinkSchema.validateAsync(req.body, { abortEarly: false })
    req.params = validatedParams
    req.body = validatedBody
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const deleteMovieVideoLink = async (req, res, next) => {
  try {
    const validatedParams = await movieIdParamSchema
      .concat(linkIdParamSchema)
      .validateAsync(req.params, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

// Movie Subtitle Links
const addMovieSubtitleLink = async (req, res, next) => {
  try {
    const validatedParams = await movieIdParamSchema.validateAsync(req.params, { abortEarly: false })

    const validatedBody = await addSubtitleLinkSchema.validateAsync(req.body, { abortEarly: false })

    // Validation: Không cho phép có cả file và url cùng lúc
    const hasFile = !!req.file
    const hasUrl = !!validatedBody.url

    if (hasFile && hasUrl) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Không được gửi cả file và url cùng lúc. Chỉ được gửi file HOẶC url.')
    }

    // Validation: Phải có ít nhất file hoặc url
    if (!hasFile && !hasUrl) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Phải cung cấp file (multipart/form-data) hoặc url.')
    }

    req.params = validatedParams
    req.body = validatedBody
    next()
  } catch (error) {
    // Nếu error đã là ApiError thì truyền trực tiếp, nếu không thì bọc lại
    if (error instanceof ApiError) {
      next(error)
    } else {
      next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
    }
  }
}

const updateMovieSubtitleLink = async (req, res, next) => {
  try {
    const validatedParams = await movieIdParamSchema
      .concat(linkIdParamSchema)
      .validateAsync(req.params, { abortEarly: false })
    const validatedBody = await updateSubtitleLinkSchema.validateAsync(req.body, { abortEarly: false })

    // Validation: Không cho phép có cả file và url cùng lúc
    const hasFile = !!req.file
    const hasUrl = !!validatedBody.url

    if (hasFile && hasUrl) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Không được gửi cả file và url cùng lúc. Chỉ được gửi file HOẶC url.')
    }

    req.params = validatedParams
    req.body = validatedBody
    next()
  } catch (error) {
    // Nếu error đã là ApiError thì truyền trực tiếp, nếu không thì bọc lại
    if (error instanceof ApiError) {
      next(error)
    } else {
      next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
    }
  }
}

const deleteMovieSubtitleLink = async (req, res, next) => {
  try {
    const validatedParams = await movieIdParamSchema
      .concat(linkIdParamSchema)
      .validateAsync(req.params, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

// Episode Video Links
const addEpisodeVideoLink = async (req, res, next) => {
  try {
    const validatedParams = await episodeParamsSchema.validateAsync(req.params, { abortEarly: false })
    const validatedBody = await addVideoLinkSchema.validateAsync(req.body, { abortEarly: false })
    req.params = validatedParams
    req.body = validatedBody
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const updateEpisodeVideoLink = async (req, res, next) => {
  try {
    const validatedParams = await episodeParamsSchema
      .concat(linkIdParamSchema)
      .validateAsync(req.params, { abortEarly: false })
    const validatedBody = await updateVideoLinkSchema.validateAsync(req.body, { abortEarly: false })
    req.params = validatedParams
    req.body = validatedBody
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const deleteEpisodeVideoLink = async (req, res, next) => {
  try {
    const validatedParams = await episodeParamsSchema
      .concat(linkIdParamSchema)
      .validateAsync(req.params, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

// Episode Subtitle Links
const addEpisodeSubtitleLink = async (req, res, next) => {
  try {
    const validatedParams = await episodeParamsSchema.validateAsync(req.params, { abortEarly: false })

    const validatedBody = await addSubtitleLinkSchema.validateAsync(req.body, { abortEarly: false })

    // Validation: Không cho phép có cả file và url cùng lúc
    const hasFile = !!req.file
    const hasUrl = !!validatedBody.url

    if (hasFile && hasUrl) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Không được gửi cả file và url cùng lúc. Chỉ được gửi file HOẶC url.')
    }

    // Validation: Phải có ít nhất file hoặc url
    if (!hasFile && !hasUrl) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Phải cung cấp file (multipart/form-data) hoặc url.')
    }

    req.params = validatedParams
    req.body = validatedBody
    next()
  } catch (error) {
    // Nếu error đã là ApiError thì truyền trực tiếp, nếu không thì bọc lại
    if (error instanceof ApiError) {
      next(error)
    } else {
      next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
    }
  }
}

const updateEpisodeSubtitleLink = async (req, res, next) => {
  try {
    const validatedParams = await episodeParamsSchema
      .concat(linkIdParamSchema)
      .validateAsync(req.params, { abortEarly: false })
    const validatedBody = await updateSubtitleLinkSchema.validateAsync(req.body, { abortEarly: false })

    // Validation: Không cho phép có cả file và url cùng lúc
    const hasFile = !!req.file
    const hasUrl = !!validatedBody.url

    if (hasFile && hasUrl) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Không được gửi cả file và url cùng lúc. Chỉ được gửi file HOẶC url.')
    }

    req.params = validatedParams
    req.body = validatedBody
    next()
  } catch (error) {
    // Nếu error đã là ApiError thì truyền trực tiếp, nếu không thì bọc lại
    if (error instanceof ApiError) {
      next(error)
    } else {
      next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
    }
  }
}

const deleteEpisodeSubtitleLink = async (req, res, next) => {
  try {
    const validatedParams = await episodeParamsSchema
      .concat(linkIdParamSchema)
      .validateAsync(req.params, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const linkValidation = {
  // Movie Video Links
  addMovieVideoLink,
  updateMovieVideoLink,
  deleteMovieVideoLink,

  // Movie Subtitle Links
  addMovieSubtitleLink,
  updateMovieSubtitleLink,
  deleteMovieSubtitleLink,

  // Episode Video Links
  addEpisodeVideoLink,
  updateEpisodeVideoLink,
  deleteEpisodeVideoLink,

  // Episode Subtitle Links
  addEpisodeSubtitleLink,
  updateEpisodeSubtitleLink,
  deleteEpisodeSubtitleLink
}
