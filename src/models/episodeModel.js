import { GET_DB } from '~/config/mongodb'
import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { subtitleLinkSchema, videoLinkSchema, videoMediaModel } from './videoMeidaModel'
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
  video_links: Joi.array().items(videoLinkSchema).required(),
  subtitle_links: Joi.array().items(subtitleLinkSchema).required()
})

const EPISODE_COLLECTION_NAME = 'episodes'

// Hàm tạo episode mới
const create = async (episodeData, options = {}) => {
  const { session } = options // Lấy session từ options
  const validatedData = await EpisodeSchema.validateAsync(episodeData, {
    abortEarly: false,
    stripUnknown: true
  })

  const now = new Date()
  const newEpisodeToAdd = {
    ...validatedData,
    tv_show_id: new ObjectId(validatedData.tv_show_id),
    createdAt: now,
    updatedAt: now
  }

  const episodeCollection = GET_DB().collection(EPISODE_COLLECTION_NAME)
  const insertResult = await episodeCollection.insertOne(newEpisodeToAdd, { session })
  const createdEpisode = await episodeCollection.findOne({ _id: insertResult.insertedId }, { session })

  return createdEpisode
}

// Hàm tìm một episode theo điều kiện
const findOne = async (condition, options = {}) => {
  const { session } = options // Lấy session từ options
  return await GET_DB().collection(EPISODE_COLLECTION_NAME).findOne(condition, { session })
}

// Hàm chạy aggregation trên collection episodes
const aggregate = async (pipeline, options = {}) => {
  const { session } = options // Lấy session từ options
  return await GET_DB().collection(EPISODE_COLLECTION_NAME).aggregate(pipeline, { session }).toArray()
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
          subtitle_links: 0,
          updatedAt: 0
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
  return await GET_DB()
    .collection(EPISODE_COLLECTION_NAME)
    .findOne({
      tv_show_id: new ObjectId(tvShowId),
      episode_id: +episodeTmdbId
    })
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

const deleteOneById = async (episodeId, options = {}) => {
  const { session } = options // Lấy session từ options
  try {
    const result = await GET_DB()
      .collection(EPISODE_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(episodeId) }, { session })
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
    throw new Error(error.message || 'Failed to fetch episode')
  }
}

export const episodeModel = {
  create,
  findOne,
  aggregate,
  findByTvShow,
  findByTmdbId,
  deleteOneById,
  deleteManyByTvShowId,
  update,
  getEpisodeForUser
}
