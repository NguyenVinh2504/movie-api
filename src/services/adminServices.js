/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { mongoClientInstance } from '~/config/mongodb'
import resolveLangCode from '~/helpers/resolveLangCode'
import { episodeModel } from '~/models/episodeModel'
import { videoMediaModel } from '~/models/videoMeidaModel'
import ApiError from '~/utils/ApiError'

const getPaginatedList = async (fetchFn, { page, pageSize }, message) => {
  try {
    const results = await fetchFn({ page, pageSize })
    const data = results[0].data
    const totalItems = results[0].pagination[0] ? results[0].pagination[0].totalItems : 0
    const totalPages = Math.ceil(totalItems / pageSize)
    return {
      status: 'success',
      message,
      data,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: pageSize
      }
    }
  } catch (error) {
    throw error
  }
}

const createMovie = async (body) => {
  try {
    // Kiểm tra trùng tmdb_id
    const existed = await videoMediaModel.findMediaByTmdbId(body.tmdb_id, 'movie')
    if (existed) {
      throw new ApiError(StatusCodes.CONFLICT, 'Phim với tmdb_id này đã tồn tại trong hệ thống.')
    }

    // Chuẩn hóa subtitle_links
    const subtitle_links = (body.subtitle_links || []).map((sub) => ({
      ...sub,
      lang: resolveLangCode(sub.label)
    }))
    const data = {
      ...body,
      media_type: 'movie',
      subtitle_links
    }
    // Validate và thêm vào DB
    const createdMovie = await videoMediaModel.createMovie(data)
    return {
      status: 'success',
      message: 'Tạo phim thành công',
      data: createdMovie
    }
  } catch (error) {
    // Xử lý lỗi validation
    throw error
  }
}

// Sử dụng:
const getMovieList = (params) => getPaginatedList(videoMediaModel.getMovieList, params, 'Lấy danh sách phim thành công')

const getMediaById = async (mediaId) => {
  try {
    const movie = await videoMediaModel.findById(mediaId)
    if (!movie) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Phim không tồn tại.')
    }
    return {
      status: 'success',
      message: 'Lấy thông tin phim thành công',
      data: movie
    }
  } catch (error) {
    throw error
  }
}

const updateMovie = async (idMovie, reqBody) => {
  try {
    // const movie = await videoMediaModel.findById(idMovie)
    // if (!movie) {
    //   throw new ApiError(StatusCodes.NOT_FOUND, 'Phim không tồn tại.')
    // }
    const { status, video_links, subtitle_links, title, poster_path } = reqBody

    const processedSubtitles = subtitle_links.map((sub) => ({
      ...sub,
      lang: resolveLangCode(sub.label),
      kind: 'subtitles'
    }))

    const updateData = {
      status,
      title,
      poster_path,
      video_links,
      subtitle_links: processedSubtitles
    }

    const updatedMovie = await videoMediaModel.update({ mediaId: idMovie, updateData, media_type: 'movie' })

    return {
      status: 'success',
      message: 'Cập nhật thông tin phim thành công',
      data: updatedMovie
    }
  } catch (error) {
    throw error
  }
}

const deleteMedia = async (mediaId) => {
  const session = mongoClientInstance.startSession()
  try {
    let deletedMedia = null // Biến để lưu trữ media đã xóa

    await session.withTransaction(async () => {
      deletedMedia = await videoMediaModel.deleteOneById(mediaId, { session })

      if (!deletedMedia) {
        // Ném lỗi này sẽ khiến transaction tự động rollback
        throw new ApiError(StatusCodes.NOT_FOUND, 'Media không tồn tại.')
      }

      // 2. Nếu media đã xóa là 'tv', thì xóa các episodes liên quan
      if (deletedMedia.media_type === 'tv') {
        await episodeModel.deleteManyByTvShowId(mediaId, { session })
      }
    })

    return {
      status: 'success',
      message: 'Xóa media thành công.'
    }
  } catch (error) {
    throw error
  } finally {
    await session.endSession()
  }
}

const createTvShow = async (body) => {
  try {
    // Kiểm tra trùng tmdb_id
    const existed = await videoMediaModel.findMediaByTmdbId(body.tmdb_id, 'tv')
    if (existed) {
      throw new ApiError(StatusCodes.CONFLICT, 'Phim với tmdb_id này đã tồn tại trong hệ thống.')
    }

    const data = {
      ...body,
      media_type: 'tv'
    }

    // Validate và thêm vào DB
    const createdTvShow = await videoMediaModel.createTvShow(data)
    return createdTvShow
  } catch (error) {
    // Xử lý lỗi validation
    throw error
  }
}

const getTvShowList = (params) =>
  getPaginatedList(videoMediaModel.getTvShowList, params, 'Lấy danh sách phim thành công')

const updateTvShow = async (idTvShow, reqBody) => {
  try {
    // const tvShow = await videoMediaModel.findById(idTvShow)
    // if (!tvShow) {
    //   throw new ApiError(StatusCodes.NOT_FOUND, 'Phim không tồn tại.')
    // }

    const { status, name, poster_path } = reqBody

    const updateData = {
      status,
      name,
      poster_path
    }

    const updatedTvShow = await videoMediaModel.update({ media_type: 'tv', mediaId: idTvShow, updateData })

    return {
      status: 'success',
      message: 'Cập nhật thông tin phim thành công',
      data: updatedTvShow
    }
  } catch (error) {
    throw error
  }
}

const addEpisode = async (tvShowId, episodeData) => {
  // 1. Kiểm tra TV show và tập phim tồn tại (có thể giữ nguyên)
  const tvShow = await videoMediaModel.findById(tvShowId)
  if (!tvShow) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Vui lòng tạo TV show trước khi thêm tập phim.')
  }

  const existingEpisode = await episodeModel.findOne({
    tv_show_id: new ObjectId(tvShowId),
    season_number: episodeData.season_number,
    episode_number: episodeData.episode_number
  })
  if (existingEpisode) {
    throw new ApiError(StatusCodes.CONFLICT, 'Tập phim này đã tồn tại.')
  }

  // Bắt đầu một session để chạy transaction
  const session = mongoClientInstance.startSession()

  try {
    let newEpisode // Khai báo biến để có thể return sau transaction

    // Chạy tất cả các thao tác ghi trong một transaction
    await session.withTransaction(async () => {
      // Thao tác 1: Tạo tập phim mới
      const dataToCreate = {
        ...episodeData,
        tv_show_id: tvShowId
      }
      // Gán kết quả vào newEpisode và truyền session
      newEpisode = await episodeModel.create(dataToCreate, { session })

      if (!newEpisode) {
        // Nếu có lỗi, transaction sẽ tự rollback
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Thêm tập phim mới thất bại.')
      }

      // Thao tác 2: Dùng Aggregation để tính toán lại
      const stats = await episodeModel.aggregate(
        [
          { $match: { tv_show_id: new ObjectId(tvShowId) } },
          {
            $group: {
              _id: '$tv_show_id',
              episodeCount: { $sum: 1 },
              uniqueSeasons: { $addToSet: '$season_number' }
            }
          },
          {
            $project: {
              _id: 0,
              episodeCount: 1,
              seasonCount: { $size: '$uniqueSeasons' }
            }
          }
        ],
        { session }
      )

      // Thao tác 3: Cập nhật document TV Show
      if (stats.length > 0) {
        const { seasonCount, episodeCount } = stats[0]
        await videoMediaModel.update(
          {
            mediaId: tvShowId,
            media_type: 'tv',
            updateData: { seasonCount, episodeCount, updatedAt: new Date() }
          },
          { session }
        )
      }
    })

    return newEpisode // Trả về tập phim đã tạo
  } finally {
    // Luôn luôn phải kết thúc session sau khi hoàn thành
    await session.endSession()
  }
}

const getEpisodeList = async (tvShowId, { page, pageSize }) => {
  // 1. Kiểm tra xem TV show có tồn tại không
  const tvShow = await videoMediaModel.findById(tvShowId)
  if (!tvShow) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'TV show không tồn tại.')
  }

  // 2. Gọi model để lấy danh sách tập phim
  const { data, pagination } = await episodeModel.findByTvShow(tvShowId, { page, pageSize })
  const totalPages = Math.ceil(pagination.totalItems / pageSize)
  return {
    status: 'success',
    message: 'Lấy danh sách tập phim',
    data,
    pagination: {
      totalItems: pagination.totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage: pageSize
    }
  }
}

const deleteEpisode = async (tvShowId, episodeId) => {
  // 1. Kiểm tra sự tồn tại của TV Show và Episode
  const tvShow = await videoMediaModel.findById(tvShowId)
  if (!tvShow) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'TV show không tồn tại.')
  }

  const episode = await episodeModel.findOne({ _id: new ObjectId(episodeId) })
  if (!episode) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Tập phim không tồn tại.')
  }

  // Bắt đầu một session để chạy transaction
  const session = mongoClientInstance.startSession()

  try {
    // Chạy tất cả các thao tác trong một transaction
    await session.withTransaction(async () => {
      // 2. Xóa tập phim
      await episodeModel.deleteOneById(episodeId, { session })

      // 3. Tính toán lại số liệu
      const stats = await episodeModel.aggregate(
        [
          { $match: { tv_show_id: new ObjectId(tvShowId) } },
          { $group: { _id: null, episodeCount: { $sum: 1 }, uniqueSeasons: { $addToSet: '$season_number' } } },
          { $project: { _id: 0, episodeCount: 1, seasonCount: { $size: '$uniqueSeasons' } } }
        ],
        { session }
      )

      const { seasonCount = 0, episodeCount = 0 } = stats[0] || {}

      // 4. Cập nhật lại TV show cha
      await videoMediaModel.update(
        {
          mediaId: tvShowId,
          media_type: 'tv',
          updateData: { seasonCount, episodeCount, updatedAt: new Date() }
        },
        { session }
      )
    })
  } finally {
    // Luôn đảm bảo kết thúc session
    await session.endSession()
  }

  return {
    status: 'success',
    message: 'Xóa tập phim thành công.'
  }
}

const getEpisodeDetails = async (tvShowId, episodeId) => {
  const episode = await episodeModel.findOne(
    {
      _id: new ObjectId(episodeId),
      tv_show_id: new ObjectId(tvShowId) // Thêm điều kiện tv_show_id vào đây
    },
    episodeId
  )

  // 2. Nếu không tìm thấy, nghĩa là episode không tồn tại hoặc không thuộc tvShow này
  if (!episode) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Tập phim không tồn tại hoặc không thuộc TV show này.')
  }

  return {
    status: 'success',
    message: 'Lấy thông tin tập phim thành công.',
    data: episode
  }
}

const getEpisodeDetailsByTmdbId = async ({ tvShowId, episodeTmdbId }) => {
  const episode = await episodeModel.findByTmdbId({ tvShowId, episodeTmdbId })
  if (!episode) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Tập phim hiện chưa được tạo.')
  }
  return {
    status: 'success',
    message: 'Lấy thông tin tập phim thành công.',
    data: episode
  }
}

const updateEpisode = async (tvShowId, episodeId, body) => {
  const episode = await episodeModel.findOne({
    _id: new ObjectId(episodeId),
    tv_show_id: new ObjectId(tvShowId)
  })
  if (!episode) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Tập phim không tồn tại hoặc không thuộc TV show này.')
  }

  const { name, season_number, episode_number, episode_id, video_links, subtitle_links } = body

  const processedSubtitles = (subtitle_links ?? []).map((sub) => ({
    ...sub,
    lang: resolveLangCode(sub.label),
    kind: 'subtitles'
  }))

  // Tạo object updateData chứa tất cả các trường
  const updateData = {
    name,
    season_number,
    episode_number,
    episode_id,
    video_links,
    subtitle_links: processedSubtitles
  }

  const updatedEpisode = await episodeModel.update(episodeId, updateData)

  await videoMediaModel.update({
    mediaId: tvShowId,
    media_type: 'tv',
    updateData: { updatedAt: new Date() }
  })

  return {
    status: 'success',
    message: 'Cập nhật thông tin tập phim thành công.',
    data: updatedEpisode
  }
}

export const adminService = {
  createMovie,
  getMovieList,
  getMediaById,
  updateMovie,
  deleteMedia,
  //Tv Show
  createTvShow,
  getTvShowList,
  updateTvShow,
  //Episode
  addEpisode,
  updateEpisode,
  getEpisodeList,
  deleteEpisode,
  getEpisodeDetails,
  getEpisodeDetailsByTmdbId
}
