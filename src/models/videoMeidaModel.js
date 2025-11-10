import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
// --- 1. ĐỊNH NGHĨA CONSTANTS VÀ SCHEMA ---
// Tên collection cho media (bao gồm cả movies và tv_shows)
const MEDIA_COLLECTION_NAME = 'media'

// Sub‑schema chung cho video link
export const videoLinkSchema = Joi.object({
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
export const subtitleLinkSchema = Joi.object({
  lang: Joi.string().trim().lowercase().length(2).allow(null).optional().default(null).messages({
    'any.required': 'Mỗi subtitle phải có mã ngôn ngữ "lang" (ví dụ: "vi", "en").',
    'string.length': '"lang" phải là mã ISO 639-1 (2 ký tự).'
  }),
  url: Joi.string().uri({ allowRelative: true }).optional().allow(null).default(null).messages({
    'string.uri': '"url" phải là một đường dẫn hợp lệ.'
  }),
  label: Joi.string().trim().min(1).required().messages({
    'any.required': 'Mỗi video link phải có "label".',
    'string.empty': '"label" không được để trống.'
  }),
  kind: Joi.string().trim().optional().default('subtitles'),
  // Mới: Fields cho file management
  r2_key: Joi.string().trim().optional().allow(null).default(null).messages({
    'string.empty': '"r2_key" không được để trống.'
  }),
  source: Joi.string().valid('upload', 'external').optional().default('external').messages({
    'any.only': '"source" phải là "upload" hoặc "external".'
  })
})

// Schema cơ bản chung cho mọi media (Movie & TVShow)
const MediaBaseSchema = Joi.object({
  tmdb_id: Joi.number().integer().positive().required(),
  poster_path: Joi.string().uri({ allowRelative: true }).allow(null, '').default(null).optional(),
  status: Joi.string().valid('published', 'draft').required(),
  createdAt: Joi.forbidden(),
  updatedAt: Joi.forbidden()
}).unknown(false)

// Schema dành cho Movie
export const MOVIE_INPUT_SCHEMA = MediaBaseSchema.keys({
  media_type: Joi.valid('movie').required(),
  title: Joi.string().trim().min(1).required(),
  video_links: Joi.array().items(videoLinkSchema).default([]).forbidden(),
  subtitle_links: Joi.array().items(subtitleLinkSchema).default([]).forbidden()
})

// // Sub‑schema cho Season
// const SeasonSchema = Joi.object({
//   season_number: Joi.number().integer().required(),
//   episodes: Joi.array().items(EpisodeSchema).required()
// })

// Schema dành cho TVShow
export const TV_SHOW_INPUT_SCHEMA = MediaBaseSchema.keys({
  media_type: Joi.valid('tv').required(),
  name: Joi.string().trim().min(1).required(),
  seasonCount: Joi.number().integer().min(0).default(0),
  episodeCount: Joi.number().integer().min(0).default(0)
  // seasons: Joi.array().items(SeasonSchema).required()
})

// --- 2. HÀM TƯƠNG TÁC VỚI DATABASE ---
const createMedia = async (inputData, schema) => {
  try {
    const validatedData = await schema.validateAsync(inputData, {
      abortEarly: false,
      stripUnknown: true
    })

    const now = new Date()

    const dataToInsert = {
      ...validatedData,
      createdAt: now,
      updatedAt: now
    }

    const mediaCollection = GET_DB().collection(MEDIA_COLLECTION_NAME)
    const insertResult = await mediaCollection.insertOne(dataToInsert)
    const createdMedia = await mediaCollection.findOne({ _id: insertResult.insertedId })

    return createdMedia
  } catch (error) {
    throw new Error(error)
  }
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
      { $sort: { updatedAt: -1 } },
      // // Giai đoạn 3: Thêm các trường tính toán
      // {
      //   $addFields: {
      //     seasonCount: { $size: '$seasons' },
      //     episodeCount: {
      //       $sum: {
      //         $map: {
      //           input: '$seasons',
      //           as: 'season',
      //           in: { $size: '$$season.episodes' }
      //         }
      //       }
      //     }
      //   }
      // },
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
  try {
    const mediaCollection = GET_DB().collection(MEDIA_COLLECTION_NAME)
    return await mediaCollection.findOne({ tmdb_id, media_type })
  } catch (error) {
    throw new Error(error)
  }
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

const update = async ({ mediaId, media_type, updateData }, options = {}) => {
  try {
    // Lấy session từ options
    const { session } = options

    const result = await GET_DB()
      .collection(MEDIA_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(mediaId),
          media_type
        },
        {
          // Dùng $set để cập nhật các trường trong updateData
          $set: { ...updateData, updatedAt: new Date() }
        },
        {
          returnDocument: 'after', // Trả về document sau khi cập nhật
          session // <-- Thêm session vào đây
        }
      )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOneById = async (mediaId, options = {}) => {
  try {
    const { session } = options

    const result = await GET_DB()
      .collection(MEDIA_COLLECTION_NAME)
      .findOneAndDelete({ _id: new ObjectId(mediaId) }, { session })
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
    throw new Error(error)
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
    throw new Error(error)
  }
}

// --- 3. HÀM QUẢN LÝ VIDEO LINKS VÀ SUBTITLE LINKS ---

// Thêm video link vào media
const addVideoLink = async (mediaId, videoLinkData) => {
  try {
    // Validate data trước khi thêm vào database
    const validatedData = await videoLinkSchema.validateAsync(videoLinkData, {
      abortEarly: false,
      stripUnknown: true
    })

    // Tạo video link object với _id mới
    const newVideoLink = {
      _id: new ObjectId(),
      ...validatedData
    }

    await GET_DB()
      .collection(MEDIA_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(mediaId) },
        { $push: { video_links: newVideoLink }, $set: { updatedAt: new Date() } },
        { returnDocument: 'after' }
      )

    // Trả về link vừa thêm để FE dễ xử lý
    return newVideoLink
  } catch (error) {
    throw new Error(error)
  }
}

// Thu thập danh sách r2_key subtitles (upload) cho Movie từ media.subtitle_links bằng DISTINCT
// Thu thập danh sách r2_key subtitles (upload) cho Movie từ media.subtitle_links bằng AGG
const collectMovieSubtitleR2Keys = async (mediaId, options = {}) => {
  try {
    const { session } = options
    const res = await GET_DB()
      .collection(MEDIA_COLLECTION_NAME)
      .aggregate(
        [
          { $match: { _id: new ObjectId(mediaId) } },
          {
            $project: {
              _id: 0,
              filtered_subs: {
                $filter: {
                  input: '$subtitle_links',
                  as: 'sub',
                  cond: {
                    $and: [{ $eq: ['$$sub.source', 'upload'] }, { $ne: ['$$sub.r2_key', null] }]
                  }
                }
              }
            }
          },
          {
            $project: {
              keys: '$filtered_subs.r2_key' // Lấy trực tiếp mảng r2_key
            }
          }
        ],
        { session }
      )
      .toArray()
    return res[0]?.keys || []
  } catch (error) {
    throw new Error(error)
  }
}

// Cập nhật video link trong media
const updateVideoLink = async (mediaId, linkId, updateData) => {
  try {
    // Danh sách các field có thể update cho video link
    const updatableFields = ['label', 'url']

    // Tự động build updateFields từ các field có trong updateData
    const updateFields = updatableFields.reduce((fields, fieldName) => {
      if (updateData[fieldName] !== undefined) {
        fields[`video_links.$.${fieldName}`] = updateData[fieldName]
      }
      return fields
    }, {})

    updateFields.updatedAt = new Date()

    const result = await GET_DB()
      .collection(MEDIA_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(mediaId), 'video_links._id': new ObjectId(linkId) },
        { $set: updateFields },
        { returnDocument: 'after' }
      )

    // Tìm link vừa cập nhật trong document trả về
    const updatedLink = result?.video_links?.find((l) => String(l._id) === String(linkId)) || null
    return updatedLink
  } catch (error) {
    throw new Error(error)
  }
}

// Xóa video link khỏi media
const deleteVideoLink = async (mediaId, linkId) => {
  try {
    const result = await GET_DB()
      .collection(MEDIA_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(mediaId), 'video_links._id': new ObjectId(linkId) },
        { $pull: { video_links: { _id: new ObjectId(linkId) } }, $set: { updatedAt: new Date() } },
        { returnDocument: 'after' }
      )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findSubtitleLinkById = async (mediaId, linkId) => {
  try {
    const result = await GET_DB()
      .collection(MEDIA_COLLECTION_NAME)
      .findOne(
        { _id: new ObjectId(mediaId), 'subtitle_links._id': new ObjectId(linkId) },
        { projection: { 'subtitle_links.$': 1 } }
      )
    return result?.subtitle_links?.[0] || null
  } catch (error) {
    throw new Error(error)
  }
}

// Thêm subtitle link vào media
const addSubtitleLink = async (mediaId, subtitleLinkData) => {
  try {
    // Validate data trước khi thêm vào database
    const validatedData = await subtitleLinkSchema.validateAsync(subtitleLinkData, {
      abortEarly: false,
      stripUnknown: true
    })

    // Tạo subtitle link object với _id mới
    const newSubtitleLink = {
      _id: new ObjectId(),
      ...validatedData
    }

    await GET_DB()
      .collection(MEDIA_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(mediaId) },
        { $push: { subtitle_links: newSubtitleLink }, $set: { updatedAt: new Date() } },
        { returnDocument: 'after' }
      )

    // Trả về link vừa thêm để FE dễ xử lý
    return newSubtitleLink
  } catch (error) {
    throw new Error(error)
  }
}

// Cập nhật subtitle link trong media
const updateSubtitleLink = async (mediaId, linkId, updateData) => {
  try {
    // Danh sách các field có thể update cho subtitle link
    const updatableFields = ['label', 'url', 'lang', 'kind', 'r2_key', 'source']

    // Tự động build updateFields từ các field có trong updateData
    const updateFields = updatableFields.reduce((fields, fieldName) => {
      if (updateData[fieldName] !== undefined) {
        fields[`subtitle_links.$.${fieldName}`] = updateData[fieldName]
      }
      return fields
    }, {})

    updateFields.updatedAt = new Date()

    await GET_DB()
      .collection(MEDIA_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(mediaId), 'subtitle_links._id': new ObjectId(linkId) },
        { $set: updateFields },
        { returnDocument: 'after' }
      )

    // Tìm link vừa cập nhật trong document trả về
    const updatedLink = await findSubtitleLinkById(mediaId, linkId)
    return updatedLink
  } catch (error) {
    throw new Error(error)
  }
}

// Xóa subtitle link khỏi media
const deleteSubtitleLink = async (mediaId, linkId) => {
  try {
    const result = await GET_DB()
      .collection(MEDIA_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(mediaId), 'subtitle_links._id': new ObjectId(linkId) },
        { $pull: { subtitle_links: { _id: new ObjectId(linkId) } }, $set: { updatedAt: new Date() } },
        { returnDocument: 'after' }
      )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const videoMediaModel = {
  MEDIA_COLLECTION_NAME,

  createMovie,
  getMovieList,
  findMediaByTmdbId,
  findById,
  update,
  deleteOneById,
  collectMovieSubtitleR2Keys,

  //Tv show
  createTvShow,
  getTvShowList,

  getMovieByTmdbIdForUser,
  getEpisodeForUser,

  // Video & Subtitle Links Management
  addVideoLink,
  updateVideoLink,
  deleteVideoLink,

  findSubtitleLinkById,
  addSubtitleLink,
  updateSubtitleLink,
  deleteSubtitleLink
}
