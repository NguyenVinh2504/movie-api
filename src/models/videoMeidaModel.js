import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
// --- 1. ĐỊNH NGHĨA CONSTANTS VÀ SCHEMA ---
// Tên collection cho media (bao gồm cả movies và tv_shows)
const MEDIA_COLLECTION_NAME = 'media'

// Sub‑schema chung cho video link
const videoLinkSchema = Joi.object({
  label: Joi.string().trim().min(1).required().messages({
    'any.required': 'Mỗi video link phải có "label".',
    'string.empty': '"label" không được để trống.'
  }),
  url: Joi.string().uri({ allowRelative: true }).required().messages({
    'any.required': 'Mỗi video link phải có "url".',
    'string.uri': '"url" phải là một đường dẫn hợp lệ.'
  })
})

// Sub‑schema chung cho subtitle link
const subtitleLinkSchema = Joi.object({
  lang: Joi.string().trim().lowercase().length(2).allow(null).required().messages({
    'any.required': 'Mỗi subtitle phải có mã ngôn ngữ "lang" (ví dụ: "vi", "en").',
    'string.length': '"lang" phải là mã ISO 639-1 (2 ký tự).'
  }),
  url: Joi.string().uri({ allowRelative: true }).required().messages({
    'any.required': 'Mỗi subtitle phải có "url".',
    'string.uri': '"url" phải là một đường dẫn hợp lệ.'
  }),
  label: Joi.string().trim().min(1).required().messages({
    'any.required': 'Mỗi video link phải có "label".',
    'string.empty': '"label" không được để trống.'
  }),
  kind: Joi.string().trim().optional().default('subtitles')
})

// Schema cơ bản chung cho mọi media (Movie & TVShow)
const MediaBaseSchema = Joi.object({
  tmdb_id: Joi.number().integer().positive().required(),
  poster_path: Joi.string().uri({ allowRelative: true }).allow(null, '').optional(),
  status: Joi.string().valid('published', 'draft').required(),
  createdAt: Joi.forbidden(),
  updatedAt: Joi.forbidden()
}).unknown(false)

// Schema dành cho Movie
export const MOVIE_INPUT_SCHEMA = MediaBaseSchema.keys({
  media_type: Joi.valid('movie').required(),
  title: Joi.string().trim().min(1).required(),
  video_links: Joi.array().items(videoLinkSchema).required(),
  subtitle_links: Joi.array().items(subtitleLinkSchema).required()
})

// Sub‑schema cho Episode
const EpisodeSchema = Joi.object({
  episode_number: Joi.number().integer().required(),
  episode_id: Joi.number().integer().positive().required(),
  name: Joi.string().trim().min(1).required(),
  video_links: Joi.array().items(videoLinkSchema).required(),
  subtitle_links: Joi.array().items(subtitleLinkSchema).required()
})

// Sub‑schema cho Season
const SeasonSchema = Joi.object({
  season_number: Joi.number().integer().required(),
  episodes: Joi.array().items(EpisodeSchema).required()
})

// Schema dành cho TVShow
export const TV_SHOW_INPUT_SCHEMA = MediaBaseSchema.keys({
  media_type: Joi.valid('tv').required(),
  name: Joi.string().trim().min(1).required(),
  seasons: Joi.array().items(SeasonSchema).required()
})

// --- 2. HÀM TƯƠNG TÁC VỚI DATABASE ---
const createMedia = async (inputData, schema) => {
  // Validate dữ liệu đầu vào bằng schema truyền vào
  const validatedData = await schema.validateAsync(inputData, {
    abortEarly: false,
    stripUnknown: true
  })

  const now = new Date()
  validatedData.createdAt = now
  validatedData.updatedAt = now

  const mediaCollection = GET_DB().collection(MEDIA_COLLECTION_NAME)
  const insertResult = await mediaCollection.insertOne(validatedData)
  const createdMedia = await mediaCollection.findOne({ _id: insertResult.insertedId })

  return createdMedia
}

// Sử dụng cho Movie
const createMovie = (movieData) => createMedia(movieData, MOVIE_INPUT_SCHEMA)

// Sử dụng cho TV Show
const createTvShow = (tvShowData) => createMedia(tvShowData, TV_SHOW_INPUT_SCHEMA)

const getMovieList = async ({ page, pageSize }) => {
  try {
    const skip = (page - 1) * pageSize

    const mediaCollection = GET_DB().collection(MEDIA_COLLECTION_NAME)

    // 2. Xây dựng Aggregation Pipeline
    const pipeline = [
      // Giai đoạn 1: Chỉ lấy các document là 'movie'
      {
        $match: { media_type: 'movie' }
      },
      // Giai đoạn 2: Sắp xếp (ví dụ: mới nhất lên đầu)
      {
        $sort: { createdAt: -1 }
      },
      // // Giai đoạn 3: Join với collection 'categories'
      // {
      //   $lookup: {
      //     from: 'categories', // Collection để join
      //     localField: 'category_ids', // Trường trong collection 'media'
      //     foreignField: '_id', // Trường trong collection 'categories'
      //     as: 'categories' // Tên mảng mới chứa kết quả join
      //   }
      // },
      // Giai đoạn 4: Định hình lại output cuối cùng
      {
        $project: {
          // Bỏ các trường không cần thiết
          video_links: 0,
          subtitle_links: 0
          // category_ids: 0, // Bỏ trường id sau khi đã join

          // Chỉ lấy các trường cần thiết trong 'categories'
          // 'categories._id': 1,
          // 'categories.name': 1
        }
      },
      // Giai đoạn 5: Thực hiện phân trang và đếm tổng số document
      // $facet cho phép chạy nhiều pipeline con trên cùng một bộ dữ liệu
      {
        $facet: {
          // Pipeline con 1: Lấy dữ liệu cho trang hiện tại
          data: [{ $skip: skip }, { $limit: pageSize }],
          // Pipeline con 2: Lấy metadata (chỉ cần đếm tổng số)
          pagination: [{ $count: 'totalItems' }]
        }
      }
    ]

    // 3. Thực thi pipeline
    const results = await mediaCollection.aggregate(pipeline).toArray()
    return results
  } catch (error) {
    throw new Error(error)
  }
}

const getTvShowList = async ({ page, pageSize }) => {
  try {
    const skip = (page - 1) * pageSize

    const mediaCollection = GET_DB().collection(MEDIA_COLLECTION_NAME)

    // 2. Xây dựng Aggregation Pipeline
    const pipeline = [
      // Giai đoạn 1: Chỉ lấy các document là 'tv'
      {
        $match: { media_type: 'tv' }
      },
      // Giai đoạn 2: Sắp xếp (ví dụ: mới nhất lên đầu)
      {
        $sort: { createdAt: -1 }
      },
      // Giai đoạn 3: Thêm các trường tính toán
      {
        $addFields: {
          seasonCount: { $size: '$seasons' },
          episodeCount: {
            $sum: {
              $map: {
                input: '$seasons',
                as: 'season',
                in: { $size: '$$season.episodes' }
              }
            }
          }
        }
      },
      // Giai đoạn 4: Định hình lại output cuối cùng
      {
        $project: {
          _id: 1,
          tmdb_id: 1,
          media_type: 1,
          name: 1,
          poster_path: 1,
          status: 1,
          seasonCount: 1,
          episodeCount: 1,
          createdAt: 1,
          updatedAt: 1
          // Loại bỏ seasons array gốc và các trường không cần thiết
        }
      },
      // Giai đoạn 5: Thực hiện phân trang và đếm tổng số document
      {
        $facet: {
          // Pipeline con 1: Lấy dữ liệu cho trang hiện tại
          data: [{ $skip: skip }, { $limit: pageSize }],
          // Pipeline con 2: Lấy metadata (chỉ cần đếm tổng số)
          pagination: [{ $count: 'totalItems' }]
        }
      }
    ]

    // 3. Thực thi pipeline
    const results = await mediaCollection.aggregate(pipeline).toArray()
    return results
  } catch (error) {
    throw new Error(error)
  }
}

const findMediaByTmdbId = async (tmdb_id, media_type) => {
  const mediaCollection = GET_DB().collection(MEDIA_COLLECTION_NAME)
  return await mediaCollection.findOne({ tmdb_id, media_type })
}

const findById = async (mediaId) => {
  try {
    const result = await GET_DB()
      .collection(MEDIA_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(mediaId)
      })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async ({ mediaId, media_type, updateData }) => {
  try {
    const result = await GET_DB()
      .collection(MEDIA_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(mediaId),
          media_type
        },
        {
          $set: updateData
        },
        {
          returnDocument: 'after' // Trả về document sau khi cập nhật
        }
      )
    if (!result) throw 'Có lỗi trong quá trình cập nhật phim'

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOneById = async (columnId) => {
  try {
    const result = await GET_DB()
      .collection(MEDIA_COLLECTION_NAME)
      .deleteOne({
        _id: new ObjectId(columnId)
      })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getMovieByTmdbIdForUser = async ({ tmdbId }) => {
  try {
    const result = await GET_DB()
      .collection(MEDIA_COLLECTION_NAME)
      .findOne(
        {
          tmdb_id: +tmdbId,
          status: 'published',
          media_type: 'movie'
        },
        {
          projection: {
            _id: 1,
            title: 1,
            poster_path: 1,
            video_links: 1,
            subtitle_links: 1,
            createdAt: 1,
            updatedAt: 1
          }
        }
      )

    return result
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch media')
  }
}

const getEpisodeForUser = async ({ tmdbId, seasonNumber, episodeNumber, episodeId }) => {
  try {
    const result = await GET_DB()
      .collection(MEDIA_COLLECTION_NAME)
      .findOne(
        {
          tmdb_id: +tmdbId,
          status: 'published',
          media_type: 'tv'
        },
        {
          projection: {
            name: 1,
            poster_path: 1,
            'seasons.season_number': 1,
            'seasons.episodes': 1
          }
        }
      )

    if (!result) {
      throw new Error('TV show not found or not available')
    }

    // Tìm season
    const season = result.seasons?.find((s) => s.season_number === seasonNumber)
    if (!season) {
      throw new Error('Season not found')
    }

    // Tìm episode với nhiều điều kiện
    const episode = season.episodes?.find((e) => e.episode_number === episodeNumber && e.episode_id === episodeId)
    if (!episode) {
      throw new Error('Episode not found')
    }

    // Trả về format đã flatten
    return {
      poster_path: result.poster_path,
      season_number: seasonNumber,
      episode_id: episode.episode_id,
      episode_number: episode.episode_number,
      name: episode.name,
      video_links: episode.video_links,
      subtitle_links: episode.subtitle_links
    }
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch episode')
  }
}

export const videoMediaModel = {
  createMovie,
  getMovieList,
  findMediaByTmdbId,
  findById,
  update,
  deleteOneById,

  //Tv show
  createTvShow,
  getTvShowList,

  getMovieByTmdbIdForUser,
  getEpisodeForUser
}
