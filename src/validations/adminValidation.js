import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'

const paginationValidation = async (req, res, next) => {
  const correctCondition = Joi.object({
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
  url: Joi.string().uri().required().messages({
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
const EpisodeSchema = Joi.object({
  episode_number: Joi.number().integer().required(),
  episode_id: Joi.number().integer().positive().required(),
  name: Joi.string().trim().min(1).required(),
  video_links: Joi.array().items(linkSchema).required(),
  subtitle_links: Joi.array().items(linkSchema).required()
})

// Sub‑schema cho Season
const SeasonSchema = Joi.object({
  season_number: Joi.number().integer().positive().required(),
  episodes: Joi.array().items(EpisodeSchema).required()
})

const createTvShow = async (req, res, next) => {
  const correctCondition = MediaBaseSchema.keys({
    /**
     * Tên (tiêu đề) của phim.
     * Bắt buộc, là chuỗi và không được rỗng sau khi đã cắt khoảng trắng.
     */
    name: Joi.string().trim().min(1).required().messages({
      'any.required': 'name là trường bắt buộc.',
      'string.empty': 'name không được để trống.'
    }),
    seasons: Joi.array().items(SeasonSchema).required().messages({
      'array.base': 'seasons phải là một mảng.'
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
    }),
    seasons: Joi.array().items(SeasonSchema).required().messages({
      'array.base': 'seasons phải là một mảng.'
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

export const adminValidation = {
  //Movie
  createMovie,
  updateMovie,

  //Tv Show
  createTvShow,
  updateTvShow,

  paginationValidation
}
