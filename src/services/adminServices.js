/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { mongoClientInstance } from '~/config/mongodb'
import { episodeModel } from '~/models/episodeModel'
import { videoMediaModel } from '~/models/videoMeidaModel'
import ApiError from '~/utils/ApiError'
import { subtitleService } from '~/services/subtitle.service'

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

    const data = {
      ...body,
      media_type: 'movie'
    }

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
    const { status, title, poster_path } = reqBody

    const updateData = {
      status,
      title,
      poster_path
    }

    const updatedMovie = await videoMediaModel.update({ mediaId: idMovie, updateData, media_type: 'movie' })
    if (!updatedMovie) {
      throw new ApiError(StatusCodes.NOT_FOUND, `Không tìm thấy movie với ID: ${idMovie} để cập nhật.`)
    }

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
    let mediaBeforeDelete = null
    let r2KeysToDelete = []

    mediaBeforeDelete = await videoMediaModel.findById(mediaId)
    if (!mediaBeforeDelete) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Media không tồn tại.')
    }

    if (mediaBeforeDelete.media_type === 'movie') {
      // Movie: gom keys từ media.subtitle_links (distinct) thông qua model
      const mediaKeys = await videoMediaModel.collectMovieSubtitleR2Keys(mediaId, { session })
      r2KeysToDelete.push(...mediaKeys)
    } else if (mediaBeforeDelete.media_type === 'tv') {
      // TV: gom keys từ episodes.subtitle_links (distinct) thông qua model và xóa episodes
      const episodeKeys = await episodeModel.collectTvEpisodeSubtitleR2Keys(mediaId, { session })
      r2KeysToDelete.push(...episodeKeys)
    }

    await session.withTransaction(async () => {
      // Xóa media sau cùng
      await videoMediaModel.deleteOneById(mediaId, { session })

      if (mediaBeforeDelete.media_type === 'tv') {
        await episodeModel.deleteManyByTvShowId(mediaId, { session })
      }
    })

    // Xóa file R2 theo lô (ngoài transaction)
    const uniqueKeys = Array.from(new Set(r2KeysToDelete)).filter(Boolean)
    await subtitleService.deleteFilesFromR2(uniqueKeys)

    return {
      status: 'success',
      message: 'Xóa media thành công.',
      data: { deletedId: String(mediaId) }
    }
  } catch (error) {
    throw error
  } finally {
    await session.endSession()
  }
}

const createTvShow = async (body) => {
  try {
    const existed = await videoMediaModel.findMediaByTmdbId(body.tmdb_id, 'tv')
    if (existed) {
      throw new ApiError(StatusCodes.CONFLICT, 'Phim với tmdb_id này đã tồn tại trong hệ thống.')
    }

    const data = {
      ...body,
      media_type: 'tv'
    }

    const createdTvShow = await videoMediaModel.createTvShow(data)
    return {
      status: 'success',
      message: 'Tạo TV show thành công',
      data: createdTvShow
    }
  } catch (error) {
    throw error
  }
}

const getTvShowList = (params) =>
  getPaginatedList(videoMediaModel.getTvShowList, params, 'Lấy danh sách phim thành công')

const updateTvShow = async (idTvShow, reqBody) => {
  try {
    const { status, name, poster_path } = reqBody

    const updateData = {
      status,
      name,
      poster_path
    }

    const updatedTvShow = await videoMediaModel.update({ media_type: 'tv', mediaId: idTvShow, updateData })

    if (!updatedTvShow) {
      throw new ApiError(StatusCodes.NOT_FOUND, `Không tìm thấy tv show với ID: ${idTvShow} để cập nhật.`)
    }

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

    return {
      status: 'success',
      message: 'Thêm tập phim thành công.',
      data: newEpisode
    } // Trả về tập phim đã tạo
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
  // Kiểm tra cả TV show và episode CÙNG LÚC để giảm số query
  const [tvShow, episode] = await Promise.all([
    videoMediaModel.findById(tvShowId),
    episodeModel.findOne({
      _id: new ObjectId(episodeId),
      tv_show_id: new ObjectId(tvShowId) // Kiểm tra luôn cả tv_show_id
    })
  ])

  if (!tvShow) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'TV show không tồn tại.')
  }

  if (!episode) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Tập phim không tồn tại hoặc không thuộc TV show này.')
  }

  // Bắt đầu một session để chạy transaction
  const session = mongoClientInstance.startSession()

  let r2KeysToDelete = []
  // 1. Gom r2_key subtitles (upload) bằng aggregation (không duyệt JS)
  r2KeysToDelete = await episodeModel.collectEpisodeSubtitleR2Keys({ tvShowId, episodeId })

  try {
    // Chạy tất cả các thao tác trong một transaction
    await session.withTransaction(async () => {
      // 2. Xóa tập phim
      await episodeModel.deleteOneByIdAndTvShowId(episodeId, tvShowId, { session })

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

  // Xóa file phụ đề trên R2 (ngoài transaction)
  const uniqueKeys = Array.from(new Set(r2KeysToDelete)).filter(Boolean)
  await subtitleService.deleteFilesFromR2(uniqueKeys)

  return {
    status: 'success',
    message: 'Xóa tập phim thành công.',
    data: { deletedId: String(episodeId) }
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

  const { name, season_number, episode_number, episode_id } = body

  const updateData = {
    name,
    season_number,
    episode_number,
    episode_id
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
