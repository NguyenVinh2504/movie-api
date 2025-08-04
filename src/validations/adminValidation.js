import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const mediaActionSchema = Joi.object({
  mediaId: Joi.string().pattern(OBJECT_ID_RULE).required().messages({
    'any.required': 'mediaId là trường bắt buộc.',
    'string.pattern.base': OBJECT_ID_RULE_MESSAGE
  })
})

export const tvShowIdSchema = Joi.object({
  tvShowId: Joi.string().pattern(OBJECT_ID_RULE).required().messages({
    'any.required': 'tvShowId là trường bắt buộc.',
    'string.pattern.base': OBJECT_ID_RULE_MESSAGE
  })
})

const episodeActionSchema = tvShowIdSchema.concat(
  Joi.object({
    episodeId: Joi.string().pattern(OBJECT_ID_RULE).required().messages({
      'any.required': 'episodeId là trường bắt buộc.',
      'string.pattern.base': OBJECT_ID_RULE_MESSAGE
    })
  })
)

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': '"page" phải là số',
    'number.min': '"page" phải lớn hơn hoặc bằng 1',
    'number.integer': '"page" phải là số nguyên'
  }),
  pageSize: Joi.number().integer().min(1).default(10).messages({
    'number.base': '"pageSize" phải là số',
    'number.min': '"pageSize" phải lớn hơn hoặc bằng 1',
    'number.integer': '"pageSize" phải là số nguyên'
  })
})

const getMediaList = async (req, res, next) => {
  const correctCondition = paginationSchema
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

const linkSchema = Joi.object({
  label: Joi.string().trim().min(1).required().messages({
    'any.required': 'Trường "label" là bắt buộc cho mỗi link.',
    'string.empty': 'Trường "label" không được để trống.'
  }),
  url: Joi.string().trim().uri().required().messages({
    'any.required': 'Trường "url" là bắt buộc cho mỗi link.',
    'string.uri': 'Trường "url" phải là một đường dẫn URL hợp lệ.'
  })
})

const MediaBaseSchema = Joi.object({
  // --- Các trường bắt buộc ---
  /**
   * ID của phim từ The Movie Database (TMDB).
   * Bắt buộc, phải là số nguyên dương.
   */
  tmdb_id: Joi.number().integer().positive().required().messages({
    'any.required': 'tmdb_id là trường bắt buộc.',
    'number.base': 'tmdb_id phải là một số.',
    'number.integer': 'tmdb_id phải là số nguyên.',
    'number.positive': 'tmdb_id phải là số nguyên dương.'
  }),
  // --- Các trường tùy chọn ---
  /**
   * Đường dẫn đến ảnh poster.
   * Không bắt buộc, nhưng nếu có phải là một chuỗi.
   * Cho phép giá trị là null hoặc chuỗi rỗng.
   */
  poster_path: Joi.string()
    .uri({
      allowRelative: true
    })
    .optional()
    .allow(null, '')
    .messages({
      'string.uri': 'Poster_path phải là một đường dẫn URI hợp lệ.'
    }),
  /**
   * Trạng thái của phim.
   * Bắt buộc, và chỉ chấp nhận một trong hai giá trị: 'published' hoặc 'draft'.
   */
  status: Joi.string().valid('published', 'draft').required().messages({
    'any.required': 'status là trường bắt buộc.',
    'any.only': 'status chỉ có thể là "published" hoặc "draft".'
  })
})

const validateMediaAction = async (req, res, next) => {
  try {
    await mediaActionSchema.validateAsync(req.params, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const createMovie = async (req, res, next) => {
  const correctCondition = MediaBaseSchema.keys({
    // --- Các trường bắt buộc ---
    /**
     * Tên (tiêu đề) của phim.
     * Bắt buộc, là chuỗi và không được rỗng sau khi đã cắt khoảng trắng.
     */
    title: Joi.string().trim().min(1).required().messages({
      'any.required': 'title là trường bắt buộc.',
      'string.empty': 'title không được để trống.'
    }),
    /**
     * Mảng chứa các link video.
     * Phải là một mảng và mỗi phần tử phải tuân thủ linkSchema.
     */
    video_links: Joi.array().items(linkSchema).required().messages({
      'array.base': 'video_links phải là một mảng.'
    }),
    /**
     * Mảng chứa các link phụ đề.
     * Phải là một mảng và mỗi phần tử phải tuân thủ linkSchema.
     */
    subtitle_links: Joi.array().items(linkSchema).required().messages({
      'array.base': 'subtitle_links phải là một mảng.'
    })
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

const updateMovie = async (req, res, next) => {
  const correctCondition = Joi.object({
    status: Joi.string().valid('published', 'draft').required(),
    video_links: Joi.array().items(linkSchema).required(),
    subtitle_links: Joi.array().items(linkSchema).required(),
    poster_path: Joi.string()
      .uri({
        allowRelative: true
      })
      .required()
      .allow(null, '')
      .messages({
        'string.uri': 'Poster_path phải là một đường dẫn URI hợp lệ.'
      }),
    title: Joi.string().trim().min(1).required().messages({
      'any.required': 'title là trường bắt buộc.',
      'string.empty': 'title không được để trống.'
    })
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

// Sub‑schema cho Episode
// const EpisodeSchema = Joi.object({
//   episode_number: Joi.number().integer().positive().required(),
//   episode_id: Joi.number().integer().positive().required(),
//   name: Joi.string().trim().min(1).required(),
//   video_links: Joi.array().items(linkSchema).required(),
//   subtitle_links: Joi.array().items(linkSchema).required()
// })

// Sub‑schema cho Season
// const SeasonSchema = Joi.object({
//   season_number: Joi.number().integer().positive().required(),
//   episodes: Joi.array().items(EpisodeSchema).required()
// })

const createTvShow = async (req, res, next) => {
  const correctCondition = MediaBaseSchema.keys({
    /**
     * Tên (tiêu đề) của phim.
     * Bắt buộc, là chuỗi và không được rỗng sau khi đã cắt khoảng trắng.
     */
    name: Joi.string().trim().min(1).required().messages({
      'any.required': 'name là trường bắt buộc.',
      'string.empty': 'name không được để trống.'
    })
    // seasons: Joi.array().items(SeasonSchema).required().messages({
    //   'array.base': 'seasons phải là một mảng.'
    // })
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

const updateTvShow = async (req, res, next) => {
  const correctCondition = Joi.object({
    status: Joi.string().valid('published', 'draft').required(),
    poster_path: Joi.string()
      .uri({
        allowRelative: true
      })
      .required()
      .allow(null, '')
      .messages({
        'string.uri': 'Poster_path phải là một đường dẫn URI hợp lệ.'
      }),
    name: Joi.string().trim().min(1).required().messages({
      'any.required': 'name là trường bắt buộc.',
      'string.empty': 'name không được để trống.'
    })
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const addEpisode = async (req, res, next) => {
  const episodeSchema = Joi.object({
    season_number: Joi.number().integer().positive().required(),
    episode_number: Joi.number().integer().positive().required(),
    episode_id: Joi.number().integer().positive().required(),
    name: Joi.string().trim().min(1).required(),
    video_links: Joi.array().items(linkSchema).required(),
    subtitle_links: Joi.array().items(linkSchema).required()
  }).concat(tvShowIdSchema)

  try {
    // Validate đồng thời cả params và body
    await episodeSchema.validateAsync({ ...req.params, ...req.body }, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const getEpisodeList = async (req, res, next) => {
  const finalSchema = tvShowIdSchema.concat(paginationSchema)

  try {
    // Validate trên schema cuối cùng
    const validatedData = await finalSchema.validateAsync(
      { ...req.params, ...req.query },
      { abortEarly: false, allowUnknown: true }
    )

    // Gán lại dữ liệu đã được validate và có giá trị default
    req.query.page = validatedData.page
    req.query.pageSize = validatedData.pageSize

    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const validateEpisodeAction = async (req, res, next) => {
  try {
    await episodeActionSchema.validateAsync(req.params, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const updateEpisode = async (req, res, next) => {
  // Schema bây giờ giống hệt với schema khi tạo mới
  const correctCondition = Joi.object({
    name: Joi.string().trim().min(1).required(),
    season_number: Joi.number().integer().positive().required(),
    episode_number: Joi.number().integer().required(), // Chấp nhận cả số 0
    episode_id: Joi.number().integer().positive().required(),
    video_links: Joi.array().items(linkSchema).required(),
    subtitle_links: Joi.array().items(linkSchema).required()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const getEpisodeDetailsByTmdbId = async (req, res, next) => {
  const schema = Joi.object({
    episodeTmdbId: Joi.number().integer().positive().required()
  }).concat(tvShowIdSchema)
  try {
    await schema.validateAsync({ ...req.params, ...req.query }, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const adminValidation = {
  getMediaList,
  validateMediaAction,

  //Movie
  createMovie,
  updateMovie,

  //Tv Show
  createTvShow,
  updateTvShow,

  //Episode
  addEpisode,
  getEpisodeList,
  validateEpisodeAction,
  updateEpisode,
  getEpisodeDetailsByTmdbId
}
