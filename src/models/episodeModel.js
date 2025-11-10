import { GET_DB } from '~/config/mongodb'
import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { videoMediaModel, videoLinkSchema, subtitleLinkSchema } from './videoMeidaModel'
import { ObjectId } from 'mongodb'

const EpisodeSchema = Joi.object({
  tv_show_id: Joi.string().pattern(OBJECT_ID_RULE).required().messages({
    'string.pattern.base': OBJECT_ID_RULE_MESSAGE,
    'any.required': 'tvShowId là trường bắt buộc.'
  }),
  season_number: Joi.number().integer().min(1).required(),
  episode_number: Joi.number().integer().required(),
  episode_id: Joi.number().integer().positive().required(),
  name: Joi.string().trim().min(1).required(),
  createdAt: Joi.forbidden(),
  updatedAt: Joi.forbidden()
}).unknown(false)

const EPISODE_COLLECTION_NAME = 'episodes'

// Hàm tạo episode mới
const create = async (episodeData, options = {}) => {
  try {
    const { session } = options // Lấy session từ options
    const validatedData = await EpisodeSchema.validateAsync(episodeData, {
      abortEarly: false,
      stripUnknown: true
    })

    const now = new Date()
    const newEpisodeToAdd = {
      ...validatedData,
      tv_show_id: new ObjectId(validatedData.tv_show_id),
      video_links: [],
      subtitle_links: [],
      createdAt: now,
      updatedAt: now
    }

    const episodeCollection = GET_DB().collection(EPISODE_COLLECTION_NAME)
    const insertResult = await episodeCollection.insertOne(newEpisodeToAdd, { session })
    const createdEpisode = await episodeCollection.findOne({ _id: insertResult.insertedId }, { session })

    return createdEpisode
  } catch (error) {
    throw new Error(error)
  }
}

// Hàm tìm một episode theo điều kiện
const findOne = async (condition, options = {}) => {
  try {
    const { session } = options // Lấy session từ options
    return await GET_DB().collection(EPISODE_COLLECTION_NAME).findOne(condition, { session })
  } catch (error) {
    throw new Error(error)
  }
}

// Hàm chạy aggregation trên collection episodes
const aggregate = async (pipeline, options = {}) => {
  try {
    const { session } = options // Lấy session từ options
    return await GET_DB().collection(EPISODE_COLLECTION_NAME).aggregate(pipeline, { session }).toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const findByTvShow = async (tvShowId, { page, pageSize }, options = {}) => {
  const { session } = options
  try {
    const skip = (page - 1) * pageSize
    const episodeCollection = GET_DB().collection(EPISODE_COLLECTION_NAME)

    const pipeline = [
      // Giai đoạn 1: Lọc ra các tập phim của TV show cần tìm
      {
        $match: { tv_show_id: new ObjectId(tvShowId) }
      },
      // Giai đoạn 2: Sắp xếp theo thứ tự mùa và tập
      {
        $sort: { season_number: 1, episode_number: 1 }
      },
      // Giai đoạn 3 (MỚI): Thêm các trường đếm số lượng link
      {
        $addFields: {
          videoLinkCount: { $size: { $ifNull: ['$video_links', []] } },
          subtitleLinkCount: { $size: { $ifNull: ['$subtitle_links', []] } }
        }
      },
      // Giai đoạn 4 (MỚI): Chỉ lấy các trường cần thiết (loại bỏ các mảng lớn)
      {
        $project: {
          // Bỏ các trường không cần thiết để giảm dung lượng
          video_links: 0,
          subtitle_links: 0
        }
      },
      // Giai đoạn 5: Dùng $facet để phân trang và lấy tổng số lượng
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: pageSize }],
          pagination: [{ $count: 'totalItems' }]
        }
      }
    ]

    const results = await episodeCollection.aggregate(pipeline, { session }).toArray()

    return {
      data: results[0]?.data || [],
      pagination: {
        totalItems: results[0]?.pagination[0]?.totalItems || 0
      }
    }
  } catch (error) {
    throw new Error(error)
  }
}

const findByTmdbId = async ({ tvShowId, episodeTmdbId }) => {
  try {
    return await GET_DB()
      .collection(EPISODE_COLLECTION_NAME)
      .findOne({
        tv_show_id: new ObjectId(tvShowId),
        episode_id: +episodeTmdbId
      })
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (episodeId, updateData, options = {}) => {
  const { session } = options
  try {
    const result = await GET_DB()
      .collection(EPISODE_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(episodeId) },
        { $set: { ...updateData, updatedAt: new Date() } },
        { returnDocument: 'after', session } // Trả về document sau khi cập nhật
      )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOneByIdAndTvShowId = async (episodeId, tvShowId, options = {}) => {
  const { session } = options // Lấy session từ options
  try {
    const result = await GET_DB()
      .collection(EPISODE_COLLECTION_NAME)
      .findOneAndDelete({ _id: new ObjectId(episodeId), tv_show_id: new ObjectId(tvShowId) }, { session })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteManyByTvShowId = async (tvShowId, options = {}) => {
  const { session } = options
  try {
    const result = await GET_DB()
      .collection(EPISODE_COLLECTION_NAME)
      .deleteMany({ tv_show_id: new ObjectId(tvShowId) }, { session })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getEpisodeForUser = async ({ tmdbId, seasonNumber, episodeNumber, episodeId }) => {
  try {
    const pipeline = [
      // === Giai đoạn 1: Match để tìm các tập phim ứng viên ===
      // Tìm tất cả các tập có season và episode number trùng khớp.
      // Bước này giúp thu hẹp phạm vi tìm kiếm một cách hiệu quả.
      {
        $match: {
          season_number: +seasonNumber,
          episode_number: +episodeNumber,
          episode_id: +episodeId
        }
      },
      // === Giai đoạn 2: Join với collection 'media' (TV Show cha) ===
      // Đây là trái tim của việc join dữ liệu.
      {
        $lookup: {
          from: videoMediaModel.MEDIA_COLLECTION_NAME, // Collection cần join vào
          localField: 'tv_show_id', // Trường của collection 'episodes' hiện tại
          foreignField: '_id', // Trường của collection 'media' để đối chiếu
          as: 'tvShowInfo' // Tên của mảng mới chứa kết quả join
        }
      },
      // === Giai đoạn 3: "Mở" mảng kết quả join ===
      // Vì mỗi episode chỉ thuộc về 1 TV Show, mảng tvShowInfo sẽ chỉ có 1 phần tử.
      // $unwind sẽ biến mảng đó thành một object để dễ truy cập.
      {
        $unwind: '$tvShowInfo'
      },
      // === Giai đoạn 4: Lọc kết quả sau khi join ===
      // Bây giờ chúng ta có thể lọc dựa trên thông tin của TV Show cha.
      {
        $match: {
          'tvShowInfo.tmdb_id': +tmdbId,
          'tvShowInfo.status': 'published'
        }
      },
      // === Giai đoạn 5: Định hình lại cấu trúc dữ liệu trả về ===
      // Chọn và đổi tên các trường để tạo ra một object "phẳng" và sạch đẹp.
      {
        $project: {
          _id: 0,
          poster_path: '$tvShowInfo.poster_path',
          season_number: '$season_number',
          episode_id: '$episode_id',
          episode_number: '$episode_number',
          name: '$name',
          tv_show: '$tvShowInfo',
          video_links: '$video_links',
          subtitle_links: '$subtitle_links'
        }
      }
    ]

    const result = await GET_DB().collection(EPISODE_COLLECTION_NAME).aggregate(pipeline).toArray()

    return result[0] || null
  } catch (error) {
    throw new Error(error)
  }
}

const findSubtitleLinkById = async (episodeId, linkId) => {
  try {
    const result = await GET_DB()
      .collection(EPISODE_COLLECTION_NAME)
      .findOne(
        { _id: new ObjectId(episodeId), 'subtitle_links._id': new ObjectId(linkId) },
        { projection: { 'subtitle_links.$': 1 } }
      )
    return result?.subtitle_links?.[0] || null
  } catch (error) {
    throw new Error(error)
  }
}

// --- HÀM QUẢN LÝ VIDEO LINKS VÀ SUBTITLE LINKS CHO EPISODE ---

// Thêm video link vào episode
const addVideoLink = async ({ tvShowId, episodeId, videoLinkData }) => {
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
      .collection(EPISODE_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(episodeId), tv_show_id: new ObjectId(tvShowId) },
        { $push: { video_links: newVideoLink }, $set: { updatedAt: new Date() } },
        { returnDocument: 'after' }
      )
    // Trả về link vừa thêm để FE dễ xử lý
    return newVideoLink
  } catch (error) {
    throw new Error(error)
  }
}

// Cập nhật video link trong episode
const updateVideoLink = async ({ tvShowId, episodeId, linkId, updateData }) => {
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
      .collection(EPISODE_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(episodeId), tv_show_id: new ObjectId(tvShowId), 'video_links._id': new ObjectId(linkId) },
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

// Xóa video link khỏi episode
const deleteVideoLink = async ({ tvShowId, episodeId, linkId }) => {
  try {
    const result = await GET_DB()
      .collection(EPISODE_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(episodeId), tv_show_id: new ObjectId(tvShowId), 'video_links._id': new ObjectId(linkId) },
        { $pull: { video_links: { _id: new ObjectId(linkId) } }, $set: { updatedAt: new Date() } },
        { returnDocument: 'after' }
      )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Thêm subtitle link vào episode
const addSubtitleLink = async ({ tvShowId, episodeId, subtitleLinkData }) => {
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
      .collection(EPISODE_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(episodeId), tv_show_id: new ObjectId(tvShowId) },
        { $push: { subtitle_links: newSubtitleLink }, $set: { updatedAt: new Date() } },
        { returnDocument: 'after' }
      )

    // Trả về link vừa thêm để FE dễ xử lý
    return newSubtitleLink
  } catch (error) {
    throw new Error(error)
  }
}

// Cập nhật subtitle link trong episode
const updateSubtitleLink = async ({ tvShowId, episodeId, linkId, updateData }) => {
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
      .collection(EPISODE_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(episodeId),
          tv_show_id: new ObjectId(tvShowId),
          'subtitle_links._id': new ObjectId(linkId)
        },
        { $set: updateFields },
        { returnDocument: 'after' }
      )

    // Tìm link vừa cập nhật trong document trả về
    const updatedLink = await findSubtitleLinkById(episodeId, linkId)
    return updatedLink
  } catch (error) {
    throw new Error(error)
  }
}

// Xóa subtitle link khỏi episode
const deleteSubtitleLink = async ({ tvShowId, episodeId, linkId }) => {
  try {
    const result = await GET_DB()
      .collection(EPISODE_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(episodeId),
          tv_show_id: new ObjectId(tvShowId),
          'subtitle_links._id': new ObjectId(linkId)
        },
        { $pull: { subtitle_links: { _id: new ObjectId(linkId) } }, $set: { updatedAt: new Date() } },
        { returnDocument: 'after' }
      )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Thu thập danh sách r2_key subtitles (upload) cho toàn bộ Episodes của một TV show bằng AGG
const collectTvEpisodeSubtitleR2Keys = async (tvShowId, options = {}) => {
  const { session } = options
  try {
    const res = await GET_DB()
      .collection(EPISODE_COLLECTION_NAME)
      .aggregate(
        [
          { $match: { tv_show_id: new ObjectId(tvShowId) } },
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
          { $unwind: '$filtered_subs' },
          { $group: { _id: null, keys: { $addToSet: '$filtered_subs.r2_key' } } }
        ],
        { session }
      )
      .toArray()
    return res[0]?.keys || []
  } catch (error) {
    throw new Error(error)
  }
}

// Thu thập r2_key subtitles (upload) cho một Episode cụ thể bằng Aggregation (không duyệt JS)
const collectEpisodeSubtitleR2Keys = async ({ tvShowId, episodeId }, options = {}) => {
  const { session } = options
  try {
    const res = await GET_DB()
      .collection(EPISODE_COLLECTION_NAME)
      .aggregate(
        [
          { $match: { _id: new ObjectId(episodeId), tv_show_id: new ObjectId(tvShowId) } },
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

export const episodeModel = {
  create,
  findOne,
  aggregate,
  findByTvShow,
  findByTmdbId,
  deleteOneByIdAndTvShowId,
  deleteManyByTvShowId,
  update,
  getEpisodeForUser,
  findSubtitleLinkById,
  collectTvEpisodeSubtitleR2Keys,
  collectEpisodeSubtitleR2Keys,
  // Video & Subtitle Links Management
  addVideoLink,
  updateVideoLink,
  deleteVideoLink,
  addSubtitleLink,
  updateSubtitleLink,
  deleteSubtitleLink
}
